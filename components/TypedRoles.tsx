"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ROLES } from "@/lib/site";

// Per-character speeds, plus the two rests that make the line read as someone typing rather
// than as a ticker: a beat on the finished role, a shorter one on the empty prompt.
const TYPE_MS = 70;
const DELETE_MS = 40;
const HOLD_MS = 1800;
const PAUSE_MS = 400;

// A role that names a product shows the product's mark once it is fully typed, in its own
// colours. Keyed by the full role string so the mark appears exactly when the word does and
// leaves with its first erased character.
const ROLE_MARKS: Record<string, string> = { "Building GasMap": "/projects/gasmap-192.png" };

/**
 * The line under the greeting: a `$` prompt with one of `ROLES` typed after it and a caret
 * riding the end of the text, held, erased, and replaced by the next — forever.
 *
 * The server renders the first role in full and the loop starts from there, already typed, so
 * the paragraph has its height before hydration and nothing shifts. Under
 * `prefers-reduced-motion` the effect returns immediately and that first role is simply the
 * line; without JS at all it is the same markup, for the same reason.
 *
 * The whole thing is one `aria-label` — the roles, once, as a list. A screen reader has no use
 * for a paragraph that rewrites itself every 70ms, so the live region is explicitly off and the
 * animated text is only ever read through that label.
 */
export default function TypedRoles() {
  const [text, setText] = useState<string>(ROLES[0]);
  // True while characters are arriving or leaving. A terminal's caret sits solid while you
  // type and only blinks once you stop, so the rests are the only time this one blinks.
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The loop's state is three locals rather than three pieces of React state: nothing here
    // is rendered except `text`, and re-running the effect on every keystroke would restart it.
    let index = 0;
    let count = ROLES[0].length;
    let deleting = true; // the first role is already on screen, so the loop begins by erasing it
    let timer = 0;

    const tick = () => {
      const role = ROLES[index];
      if (deleting) {
        count -= 1;
        setText(role.slice(0, count));
        if (count === 0) {
          deleting = false;
          index = (index + 1) % ROLES.length;
          setBusy(false);
          timer = window.setTimeout(tick, PAUSE_MS);
          return;
        }
        setBusy(true);
        timer = window.setTimeout(tick, DELETE_MS);
        return;
      }
      count += 1;
      setText(role.slice(0, count));
      if (count === role.length) {
        deleting = true;
        setBusy(false);
        timer = window.setTimeout(tick, HOLD_MS);
        return;
      }
      setBusy(true);
      timer = window.setTimeout(tick, TYPE_MS);
    };

    timer = window.setTimeout(tick, HOLD_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <p
      className="mt-3 text-[17px] text-muted-strong"
      aria-live="off"
      aria-label={ROLES.join(" · ")}
    >
      {/* The same decorative `$` the section headings open with (components/terminal/Prompt.tsx);
          `mr-2` is that component's `gap-2` written for a line of running text. */}
      <span aria-hidden className="prompt mr-2">
        $
      </span>
      {text}
      {ROLE_MARKS[text] ? (
        <Image src={ROLE_MARKS[text]} alt="" width={18} height={18} className="role-mark" />
      ) : null}
      {/* The prompt's own caret: solid while a role is being typed or erased, blinking on the
          rests, exactly as a shell's does. Decorative — the label above already says it all. */}
      <span aria-hidden className={`caret caret-typed${busy ? " caret-solid" : ""}`} />
    </p>
  );
}
