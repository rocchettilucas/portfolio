// A framed region: 1px rule, 4px radius, and — optionally — a muted title strip cut off
// from the body by another hairline, the way a pane header sits above its contents.
//
// `padding="none"` drops the body inset for boxes that frame a single fixed-size piece of
// media (the ASCII portrait), where the frame should sit on the artwork's own edge.
export default function Box({
  title,
  className,
  padding = "default",
  children,
}: {
  title?: string;
  className?: string;
  padding?: "none" | "default";
  children: React.ReactNode;
}) {
  return (
    <div className={`tbox${className ? ` ${className}` : ""}`}>
      {title ? (
        <div className="border-b border-border px-4 py-2 text-[13px] text-muted">{title}</div>
      ) : null}
      <div className={padding === "none" ? undefined : "p-4"}>{children}</div>
    </div>
  );
}
