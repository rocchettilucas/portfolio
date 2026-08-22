import SectionHeading from "./SectionHeading";

export default function Section({
  id,
  title,
  action,
  children,
}: {
  id: string;
  title: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="mx-auto max-w-[1000px] px-10 py-20 max-md:px-5 max-sm:py-14"
    >
      <SectionHeading id={id} title={title} action={action} />
      {children}
    </section>
  );
}
