"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { LinkedinIcon } from "@/components/Icons";
import { personalInfo } from "@/lib/data";
import Image from "next/image";

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-center justify-center gap-4"
        >
          <Image
            src="/memoji/contact.png"
            alt="Waving memoji"
            width={320}
            height={320}
            className="w-14 h-14"
            unoptimized
          />
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Get In Touch<span className="text-accent">.</span>
            </h2>
            <p className="text-muted mt-1">Let&apos;s build something together</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-2xl rounded-xl border border-card-border bg-card p-8 text-center"
        >
          <div className="flex justify-center">
            <a
              href={`mailto:${personalInfo.email}`}
              className="inline-flex items-center gap-3 text-muted transition-colors hover:text-accent"
            >
              <span className="rounded-lg bg-accent/10 p-2 text-accent">
                <Mail size={18} />
              </span>
              {personalInfo.email}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${personalInfo.email}`}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
            >
              <Mail size={18} />
              Email Me
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-accent px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
            >
              <LinkedinIcon size={18} />
              LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
