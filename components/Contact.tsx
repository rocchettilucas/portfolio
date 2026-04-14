"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { personalInfo } from "@/lib/data";
import Image from "next/image";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      formData.append("access_key", "e53a652d-1c8f-4192-812f-fd911c005b67");

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 px-6">
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
              src="/memoji/contact.png"
              alt="Memoji thumbs up"
              width={320}
              height={320}
              className="w-14 h-14"
              unoptimized
            />
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Get In Touch<span className="text-accent">.</span>
              </h2>
              <p className="text-muted mt-1">
                Have a question or want to work together? Drop me a message.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="md:col-span-3 space-y-4"
          >
            <div>
              <label htmlFor="name" className="block text-sm text-muted mb-1.5">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 bg-card border border-card-border rounded-lg text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-muted mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-card border border-card-border rounded-lg text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm text-muted mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full px-4 py-3 bg-card border border-card-border rounded-lg text-foreground text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                placeholder="Your message..."
              />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="flex items-center gap-2 px-6 py-3 bg-accent text-background font-medium rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              <Send size={16} />
              {status === "sending"
                ? "Sending..."
                : status === "sent"
                  ? "Sent!"
                  : "Send Message"}
            </button>
            {status === "error" && (
              <p className="text-red-400 text-sm">
                Something went wrong. Try emailing me directly.
              </p>
            )}
          </motion.form>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-accent/10 rounded-lg text-accent">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs text-muted">Email</p>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="text-sm text-foreground hover:text-accent transition-colors"
                >
                  {personalInfo.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-accent/10 rounded-lg text-accent">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs text-muted">Location</p>
                <p className="text-sm text-foreground">{personalInfo.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-accent/10 rounded-lg text-accent">
                <LinkedinIcon size={18} />
              </div>
              <div>
                <p className="text-xs text-muted">LinkedIn</p>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground hover:text-accent transition-colors"
                >
                  lucasrocchetti
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-accent/10 rounded-lg text-accent">
                <GithubIcon size={18} />
              </div>
              <div>
                <p className="text-xs text-muted">GitHub</p>
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground hover:text-accent transition-colors"
                >
                  lucasrocchetti
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
