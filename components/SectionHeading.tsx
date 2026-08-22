import Link from "next/link";

export default function SectionHeading({
  id,
  title,
  action,
}: {
  id: string;
  title: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-7 flex items-center gap-5">
      <h2 id={`${id}-title`} className="text-[34px] font-medium leading-tight max-sm:text-[28px]">
        {title}
      </h2>
      <span aria-hidden className="h-px w-[260px] bg-rule max-[800px]:hidden" />
      {action && (
        <Link href={action.href} className="arrow-link ml-auto text-[15px]">
          {action.label} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}
