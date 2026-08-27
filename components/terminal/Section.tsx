import Prompt from "./Prompt";

// Every section of the page is headed by the command that would have produced it — which is
// the section's own id, and therefore exactly what the reader can type into the command
// palette to jump here (see lib/commands.ts). The heading's visible text is that command, so
// `label` supplies the plain-language name the screen reader announces instead ("Projects",
// "Experience", …).
export default function Section({
  id,
  command,
  label,
  children,
}: {
  id: string;
  command: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="px-6 py-14 max-sm:px-4 max-md:py-10">
      <h2 id={`${id}-title`} aria-label={label} className="mb-6 text-[15px] font-normal">
        <Prompt command={command} />
      </h2>
      {children}
    </section>
  );
}
