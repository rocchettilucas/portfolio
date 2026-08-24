// A shell prompt line: the pink `$` glyph, then the command in the accent purple. The `$`
// is decorative — it is punctuation, not content — so it is hidden from assistive tech and
// callers that need a spoken name give the surrounding element one.
export default function Prompt({ command, caret = false }: { command: string; caret?: boolean }) {
  return (
    <span className="inline-flex items-baseline gap-2">
      <span aria-hidden className="prompt">
        $
      </span>
      <span className="text-accent">{command}</span>
      {caret ? <span aria-hidden className="caret" /> : null}
    </span>
  );
}
