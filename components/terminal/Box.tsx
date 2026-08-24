// A framed region: 1px rule, 4px radius, and — optionally — a muted title strip cut off
// from the body by another hairline, the way a pane header sits above its contents.
export default function Box({
  title,
  className,
  children,
}: {
  title?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`tbox${className ? ` ${className}` : ""}`}>
      {title ? (
        <div className="border-b border-border px-4 py-2 text-[13px] text-muted">{title}</div>
      ) : null}
      <div className="p-4">{children}</div>
    </div>
  );
}
