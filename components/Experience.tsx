"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Building2, Wrench, Briefcase, ExternalLink } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { experience, type Experience as ExperienceItem } from "@/lib/data";
import Image from "next/image";

const iconMap: Record<string, LucideIcon> = {
  gamepad: Gamepad2,
  building: Building2,
  wrench: Wrench,
};

function CardIcon({
  logo,
  cover,
  Icon,
  sizeClass,
  iconSize,
  company,
}: {
  logo?: string;
  cover?: boolean;
  Icon: LucideIcon;
  sizeClass: string;
  iconSize: number;
  company: string;
}) {
  const [ok, setOk] = useState(true);

  if (logo && ok) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden rounded-lg ${
          cover ? "" : "bg-white"
        } ${sizeClass}`}
      >
        <Image
          src={logo}
          alt={`${company} logo`}
          width={160}
          height={160}
          className={`h-full w-full ${cover ? "object-cover" : "object-contain p-1.5"}`}
          unoptimized
          onError={() => setOk(false)}
        />
      </div>
    );
  }

  return (
    <div className={`flex shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent ${sizeClass}`}>
      <Icon size={iconSize} />
    </div>
  );
}

function TechBadges({ tech }: { tech: string[] }) {
  if (!tech.length) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tech.map((t) => (
        <span
          key={t}
          className="rounded-full border border-card-border bg-background px-2.5 py-1 text-xs text-muted"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function LeadCard({ job }: { job: ExperienceItem }) {
  const Icon = iconMap[job.icon] ?? Briefcase;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl p-[1.5px] shadow-xl shadow-accent/10"
    >
      {/* subtle animated gradient border */}
      <div aria-hidden className="animated-border-glow absolute inset-0" />

      {/* card surface */}
      <div className="relative overflow-hidden rounded-[14px] bg-card p-8 md:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
          <CardIcon
            logo={job.logo}
            cover={job.logoCover}
            Icon={Icon}
            sizeClass="h-20 w-20 md:h-24 md:w-24"
            iconSize={40}
            company={job.company}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              {job.company}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-base font-semibold text-foreground/90">
                {job.role}
              </span>
              <span className="font-mono text-sm text-accent">{job.date}</span>
              <span className="text-sm text-muted">{job.location}</span>
            </div>
            {job.metric && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-sm font-semibold text-accent">
                <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                {job.metric}
              </div>
            )}
            <p className="mt-4 text-base leading-relaxed text-muted">
              {job.description}
            </p>
            <TechBadges tech={job.tech} />
            {job.liveUrl && (
              <a
                href={job.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
              >
                <ExternalLink size={16} />
                Visit {job.company}
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SmallCard({ job, index }: { job: ExperienceItem; index: number }) {
  const Icon = iconMap[job.icon] ?? Briefcase;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full rounded-xl border border-card-border bg-card p-5"
    >
      <div className="flex items-center gap-4">
        <CardIcon
          logo={job.logo}
          cover={job.logoCover}
          Icon={Icon}
          sizeClass="h-12 w-12"
          iconSize={20}
          company={job.company}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground">{job.company}</h3>
          <div className="mt-1 text-sm font-medium text-foreground/90">
            {job.role}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted">
            <span className="font-mono">{job.date}</span>
            <span>{job.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const lead = experience.find((e) => e.lead);
  const others = experience.filter((e) => !e.lead);

  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground">
            Experience<span className="text-accent">.</span>
          </h2>
          <p className="text-muted mt-2">Where I&apos;ve been building</p>
        </motion.div>

        {lead && <LeadCard job={lead} />}

        {others.length > 0 && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {others.map((job, i) => (
              <SmallCard key={job.company} job={job} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
