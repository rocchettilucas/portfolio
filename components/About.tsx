"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { about, personalInfo } from "@/lib/data";
import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground">
            About<span className="text-accent">.</span>
          </h2>
        </motion.div>

        <div className="grid items-center gap-10 md:grid-cols-[300px_1fr] lg:gap-14">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-[300px]"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-card-border shadow-lg shadow-accent/5">
              <Image
                src={about.image}
                alt={personalInfo.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 300px"
                unoptimized
                priority
              />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-2xl font-bold text-foreground">
              {personalInfo.name}
            </h3>
            <div className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
              <MapPin size={15} className="text-accent" />
              {personalInfo.location}
            </div>

            <div className="mt-5 space-y-4">
              {about.paragraphs.map((p, i) => (
                <p key={i} className="text-muted leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
