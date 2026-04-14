"use client";

import { motion } from "framer-motion";
import { skills } from "@/lib/data";
import Image from "next/image";

// Map to devicon classes — using "colored" variant for original brand colors
const iconMap: Record<string, string> = {
  python: "devicon-python-plain colored",
  java: "devicon-java-plain colored",
  cplusplus: "devicon-cplusplus-plain colored",
  csharp: "devicon-csharp-plain colored",
  javascript: "devicon-javascript-plain colored",
  typescript: "devicon-typescript-plain colored",
  sql: "devicon-azuresqldatabase-plain colored",
  html5: "devicon-html5-plain colored",
  css3: "devicon-css3-plain colored",
  react: "devicon-react-original colored",
  nodejs: "devicon-nodejs-plain-wordmark colored",
  fastapi: "devicon-fastapi-plain colored",
  tailwindcss: "devicon-tailwindcss-original colored",
  pandas: "devicon-pandas-plain colored",
  numpy: "devicon-numpy-plain colored",
  scikitlearn: "devicon-scikitlearn-plain colored",
  pytorch: "devicon-pytorch-plain colored",
  git: "devicon-git-plain colored",
  github: "devicon-github-original",
  docker: "devicon-docker-plain colored",
  supabase: "devicon-supabase-plain colored",
  postgresql: "devicon-postgresql-plain colored",
  amazonwebservices: "devicon-amazonwebservices-plain-wordmark colored",
  azure: "devicon-azure-plain colored",
  googlecloud: "devicon-googlecloud-plain colored",
  vercel: "devicon-vercel-original",
  linux: "devicon-linux-plain colored",
  bash: "devicon-bash-plain colored",
};

// Each card gets a unique float animation with different duration/delay
// so they bob independently, creating an organic floating feel
function getFloatAnimation(index: number) {
  const duration = 3 + (index % 5) * 0.4; // 3s to 4.6s
  const delay = (index % 7) * 0.3; // stagger the start
  return {
    y: [0, -8, 0],
    transition: {
      y: {
        duration,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay,
      },
    },
  };
}

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4">
            <Image
              src="/memoji/skills.png"
              alt="Memoji with laptop"
              width={320}
              height={320}
              className="w-14 h-14"
              unoptimized
            />
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Skills<span className="text-accent">.</span>
              </h2>
              <p className="text-muted mt-1">Technologies I work with</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4"
        >
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              animate={getFloatAnimation(i)}
              whileHover={{
                scale: 1.1,
                y: -12,
                transition: { duration: 0.2 },
              }}
              className="group flex flex-col items-center gap-2 p-4 bg-card border border-card-border rounded-xl hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-[border-color,box-shadow] cursor-default"
            >
              <i
                className={`${iconMap[skill.icon] || "devicon-devicon-plain"} text-3xl transition-transform duration-200 group-hover:scale-110`}
                title={skill.name}
                aria-hidden="true"
              />
              <span className="text-xs text-muted group-hover:text-foreground transition-colors text-center leading-tight">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
