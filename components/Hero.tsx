"use client";

import { useState, useEffect, useRef, MouseEvent } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { Mail, ArrowDown, FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import NetworkBackground from "@/components/NetworkBackground";
import { personalInfo } from "@/lib/data";
import Image from "next/image";

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = personalInfo.roles[roleIndex];
    const speed = isDeleting ? 30 : 60;

    if (!isDeleting && text === currentRole) {
      const pause = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(pause);
    }

    if (isDeleting && text === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % personalInfo.roles.length);
      return;
    }

    const timer = setTimeout(() => {
      setText(
        isDeleting
          ? currentRole.substring(0, text.length - 1)
          : currentRole.substring(0, text.length + 1)
      );
    }, speed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, roleIndex]);

  // Interactive cursor-follow glow
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const glow = useMotionTemplate`radial-gradient(550px circle at ${glowX}px ${glowY}px, rgba(59,130,246,0.10), transparent 65%)`;
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-24 text-center"
    >
      {/* ===== CS node-network background ===== */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <NetworkBackground />
        {/* edge vignette so the field fades toward the borders */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,var(--background))]" />
      </div>

      {/* interactive cursor glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: glow }}
      />

      {/* ===== Memoji ===== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          {/* ambient glow */}
          <div className="absolute -inset-3 rounded-full bg-accent/20 blur-2xl" />
          {/* rotating arc */}
          <motion.div
            aria-hidden
            className="absolute -inset-[3px] rounded-full opacity-80 blur-[2px]"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(59,130,246,0.9) 80deg, transparent 200deg)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-card-border bg-background md:h-40 md:w-40">
            <Image
              src="/memoji/hello.png"
              alt="Lucas Rocchetti memoji"
              width={320}
              height={320}
              className="h-full w-full translate-y-1 object-contain"
              unoptimized
              priority
            />
          </div>
        </motion.div>
      </motion.div>

      {/* ===== Text ===== */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-mono text-sm text-accent"
      >
        Hi, my name is
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-3 text-5xl font-bold tracking-tight text-foreground md:text-7xl"
      >
        {personalInfo.name}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-3 h-10 text-2xl font-bold text-muted md:h-12 md:text-4xl"
      >
        <span>{text}</span>
        <span className="cursor-blink text-accent">|</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
      >
        {personalInfo.bio}
      </motion.p>

      {/* ===== CTAs ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-4"
      >
        <a
          href="#projects"
          className="rounded-lg bg-accent px-6 py-3 font-medium text-background transition-colors hover:bg-accent-hover"
        >
          View Projects
        </a>
        <a
          href="/Lucas_Rocchetti_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-accent px-6 py-3 font-medium text-accent transition-colors hover:bg-accent/10"
        >
          <FileText size={18} />
          Resume
        </a>
      </motion.div>

      {/* ===== Socials ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 flex justify-center gap-5"
      >
        <a
          href={personalInfo.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted transition-colors hover:text-accent"
          aria-label="GitHub"
        >
          <GithubIcon size={22} />
        </a>
        <a
          href={personalInfo.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted transition-colors hover:text-accent"
          aria-label="LinkedIn"
        >
          <LinkedinIcon size={22} />
        </a>
        <a
          href={`mailto:${personalInfo.email}`}
          className="text-muted transition-colors hover:text-accent"
          aria-label="Email"
        >
          <Mail size={22} />
        </a>
      </motion.div>

      {/* ===== Scroll cue → About ===== */}
      <motion.a
        href="#about"
        aria-label="Scroll to about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-muted transition-colors hover:text-accent"
      >
        <span className="font-mono text-xs tracking-widest uppercase">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-card-border group-hover:border-accent"
        >
          <ArrowDown size={18} />
        </motion.span>
      </motion.a>
    </section>
  );
}
