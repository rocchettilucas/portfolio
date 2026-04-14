"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { education } from "@/lib/data";

export default function Education() {
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card border border-card-border rounded-xl p-8"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent/10 rounded-lg text-accent shrink-0">
              <GraduationCap size={24} />
            </div>
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
      </div>
    </section>
  );
}
