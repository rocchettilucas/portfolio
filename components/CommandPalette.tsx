"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Prompt from "@/components/terminal/Prompt";
import { complete, runCommand } from "@/lib/commands";

// The hidden terminal. It is mounted once in the root layout and renders nothing until
// someone presses `/` (or `~`, or the top bar's `>_` button), so it costs one keydown
// listener on a page that otherwise works entirely without it — nothing here is a gate in
// front of content, it is a shortcut past the scrolling.

// A log entry is one echoed command plus whatever it printed. `cmd: null` is an entry that
// no command produced (the opening hint, a Tab completion listing) and so has no `$` line.
type Entry = { id: number; cmd: string | null; lines: string[] };

// Both caps are there so a long session can't grow the DOM (or the arrow-key ring) without
// bound; the oldest entries fall off the top the way a real scrollback buffer trims.
const MAX_LOG = 200;
const MAX_HISTORY = 50;

const HINT: Entry = { id: 0, cmd: null, lines: ["type help to list commands"] };

// The global `/` shortcut must never steal a keystroke someone meant for a field — this
// includes the palette's own input, which is how typing `/` inside it inserts a slash.
function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || target.isContentEditable;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [log, setLog] = useState<Entry[]>([HINT]);

  // Newest first, so ArrowUp walks forward through the array. `historyIndex` is -1 while
  // the user is typing something new rather than browsing what they typed before.
  const historyRef = useRef<string[]>([]);
  const historyIndex = useRef(-1);
  const nextId = useRef(1);

  // `open` is also kept in a ref so the window listeners can read it without re-binding on
  // every open/close, and so two opens racing in one tick can't double-capture the focus.
  const openRef = useRef(false);
  const previousFocus = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLOListElement>(null);

  const openPalette = useCallback(() => {
    if (openRef.current) return;
    openRef.current = true;
    previousFocus.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    const restore = previousFocus.current;
    previousFocus.current = null;
    setOpen(false);
    // Focus goes back before React unmounts the input: whatever we focus here keeps focus,
    // and if there is nothing to restore the browser falls back to <body> on its own.
    if (restore?.isConnected) restore.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "/" && e.key !== "~") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (openRef.current) return;
      if (isEditable(e.target)) return;
      e.preventDefault();
      openPalette();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("palette:open", openPalette);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("palette:open", openPalette);
    };
  }, [openPalette]);

  // The page behind the overlay must not scroll under it — including the momentum scroll a
  // trackpad hands to whatever is beneath the pointer.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // New output lands at the bottom, so the view has to follow it there.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  const append = useCallback((cmd: string | null, lines: string[]) => {
    setLog(prev => {
      const next = [...prev, { id: nextId.current++, cmd, lines }];
      return next.length > MAX_LOG ? next.slice(next.length - MAX_LOG) : next;
    });
  }, []);

  const submit = useCallback(() => {
    const value = input;
    const echo = value.trim();
    const action = runCommand(value);

    setInput("");
    historyIndex.current = -1;
    if (echo) {
      historyRef.current = [echo, ...historyRef.current].slice(0, MAX_HISTORY);
    }

    switch (action.kind) {
      case "empty":
        append("", []);
        break;
      case "clear":
        setLog([]);
        break;
      case "print":
        append(echo, action.lines);
        break;
      case "notfound":
        append(echo, [`command not found: ${action.name}`]);
        break;
      case "open":
        append(echo, [`opening ${action.href}`]);
        window.open(action.href, "_blank", "noopener,noreferrer");
        break;
      case "scroll": {
        const { id } = action;
        closePalette();
        // Deferred a frame so the scroll lock is already lifted — a smooth scroll started
        // while <body> is still `overflow: hidden` goes nowhere.
        requestAnimationFrame(() => {
          const target = document.getElementById(id);
          // The sections only exist on the home page. Off it there is nothing to scroll
          // to, and writing the hash alone would leave the address bar pointing at an
          // anchor this document does not have — navigate home instead.
          if (!target) {
            router.push(`/#${id}`);
            return;
          }
          target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
          history.replaceState(null, "", `#${id}`);
        });
        break;
      }
    }
  }, [append, closePalette, input, router]);

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        closePalette();
        return;
      }
      if (e.key === "Tab") {
        // Also the focus trap: the input is the dialog's only focusable control, and
        // swallowing Tab keeps the browser from walking out into the page behind it.
        e.preventDefault();
        const matches = complete(input);
        if (matches.length === 1) setInput(matches[0]);
        else if (matches.length > 1) append(null, [matches.join(" ")]);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyRef.current.length === 0) return;
        historyIndex.current = Math.min(historyIndex.current + 1, historyRef.current.length - 1);
        setInput(historyRef.current[historyIndex.current]);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        historyIndex.current = Math.max(historyIndex.current - 1, -1);
        setInput(historyIndex.current === -1 ? "" : historyRef.current[historyIndex.current]);
      }
    },
    [append, closePalette, input, submit],
  );

  if (!open) return null;

  return (
    // Click-outside is a handler on the overlay itself rather than a document listener, so
    // the only thing that can trigger it is a press that landed on the ground around the
    // panel. On mousedown rather than click: a selection dragged out of the log would
    // otherwise release on the overlay and read as a click outside. Keyboard users have
    // Escape.
    <div
      onMouseDown={e => {
        if (e.target === e.currentTarget) closePalette();
      }}
      className="fixed inset-0 z-50 flex h-[100dvh] items-center justify-center bg-bg/80 px-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="tbox flex max-h-[70dvh] w-[92vw] max-w-[720px] flex-col bg-bg"
      >
        <div className="shrink-0 border-b border-border px-4 py-2 text-[13px] text-muted">
          lucas@portfolio:~
        </div>

        <ol ref={logRef} aria-live="polite" className="min-h-0 flex-1 overflow-y-auto p-4">
          {log.map(entry => (
            <li key={entry.id}>
              {entry.cmd !== null ? <Prompt command={entry.cmd} /> : null}
              {entry.lines.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap text-fg">
                  {line}
                </div>
              ))}
            </li>
          ))}
        </ol>

        <div className="flex shrink-0 items-baseline gap-2 border-t border-border px-4 py-3">
          <span aria-hidden className="prompt">
            $
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onInputKeyDown}
            aria-label="Command"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="type help"
            // No focus ring: the panel's own border is the focus context, and a second
            // outline inside it would be noise. Every other control keeps :focus-visible.
            className="min-w-0 flex-1 bg-transparent font-mono text-fg outline-none placeholder:text-muted"
          />
        </div>
      </div>
    </div>
  );
}
