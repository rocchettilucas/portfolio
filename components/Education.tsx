"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users } from "lucide-react";
import { education } from "@/lib/data";
import Image from "next/image";

export default function Education() {
  const club = education.club;

  return (
    <section id="education" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground">
            Education<span className="text-accent">.</span>
          </h2>
        </motion.div>

        {/* University card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card border border-card-border rounded-xl p-8"
        >
          <div className="flex items-start gap-4">
            {education.logo ? (
              <div className="flex h-14 w-14 items-center justify-center shrink-0 rounded-lg bg-white">
                <Image
                  src={education.logo}
                  alt="University of Toronto logo"
                  width={56}
                  height={56}
                  className="h-full w-full object-contain p-1.5"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-14 w-14 items-center justify-center shrink-0 rounded-lg bg-accent/10 text-accent">
                <GraduationCap size={24} />
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                {education.school}
              </h3>
              <p className="text-muted text-sm mt-1">{education.degree}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm">
                <span className="text-accent font-mono">
                  {education.graduation}
                </span>
                <span className="text-muted">{education.location}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* connector to the attached club node */}
        <div className="flex justify-center" aria-hidden>
          <div className="relative flex flex-col items-center">
            <span className="h-8 w-0.5 bg-accent/40" />
            <span className="-mt-1 h-2 w-2 rounded-full bg-accent/70" />
          </div>
        </div>

        {/* Attached node: Google Developer Student Club */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-[92%] rounded-xl border border-card-border bg-card p-6"
        >
          <div className="flex items-start gap-4">
            {club.logo ? (
              <div className="flex h-12 w-12 items-center justify-center shrink-0 rounded-lg bg-white">
                <Image
                  src={club.logo}
                  alt={`${club.name} logo`}
                  width={48}
                  height={48}
                  className="h-full w-full object-contain p-1.5"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center shrink-0 rounded-lg bg-accent/10 text-accent">
                <Users size={20} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {club.name}
                </h3>
                <span className="font-mono text-sm text-accent shrink-0">
                  {club.date}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-sm font-medium text-foreground/90">
                  {club.role}
                </span>
                <span className="text-sm text-muted">{club.location}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {club.detail}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
