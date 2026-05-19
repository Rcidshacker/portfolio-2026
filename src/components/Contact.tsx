"use client";
import { motion } from "framer-motion";
import { personalInfo } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="py-36 px-8 md:px-20 max-w-6xl mx-auto">
      <div className="ink-divider mb-16" />

      {/* Big CTA block */}
      <div className="grid md:grid-cols-[1fr_auto] gap-16 items-end mb-20">
        <div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="section-tag mb-4">
            05 — Contact
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold leading-tight"
            style={{ fontFamily: "'Shippori Mincho B1', serif", color: "var(--paper)" }}
          >
            Let&apos;s build<br />
            something <span style={{ color: "var(--crimson)" }}>real.</span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-3"
        >
          {/* Vertical kanji */}
          <div className="tategaki text-[10px] tracking-[0.5em] opacity-[0.08] mb-4 self-center hidden md:block"
            style={{ color: "var(--crimson)", fontFamily: "'Shippori Mincho B1', serif" }}>
            連絡先
          </div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="text-sm font-light max-w-lg mb-12 leading-relaxed"
        style={{ color: "var(--paper-dim)", opacity: 0.6 }}
      >
        If you&apos;re building with LLMs in production — or need custom MCP integrations
        that eliminate boilerplate from your dev loop — reach out.
      </motion.p>

      {/* CTA links */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="flex flex-col sm:flex-row gap-4 mb-20"
      >
        <a
          href={`mailto:${personalInfo.email}`}
          className="px-8 py-3 text-sm mono tracking-widest transition-all duration-200 hover:opacity-80 text-center"
          style={{
            background: "var(--crimson)",
            color: "var(--paper)",
            clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
          }}
        >
          {personalInfo.email}
        </a>
        <a
          href={personalInfo.github}
          target="_blank" rel="noopener noreferrer"
          className="px-8 py-3 text-sm mono tracking-widest border transition-all duration-200 text-center"
          style={{ borderColor: "var(--line-strong)", color: "var(--paper)", opacity: 0.5 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--crimson-border)"; e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = "var(--crimson)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line-strong)"; e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.color = "var(--paper)"; }}
        >
          GITHUB ↗
        </a>
        <a
          href={personalInfo.linkedin}
          target="_blank" rel="noopener noreferrer"
          className="px-8 py-3 text-sm mono tracking-widest border transition-all duration-200 text-center"
          style={{ borderColor: "var(--line-strong)", color: "var(--paper)", opacity: 0.5 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--crimson-border)"; e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = "var(--crimson)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line-strong)"; e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.color = "var(--paper)"; }}
        >
          LINKEDIN ↗
        </a>
      </motion.div>

      {/* Footer */}
      <div className="ink-divider mb-8" />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <span className="mono text-[9px] tracking-[0.2em] opacity-20" style={{ color: "var(--paper)" }}>
          © 2026 RUCHIT DAS · AI ENGINEER · THANE, MAHARASHTRA
        </span>
        <span className="text-[10px] opacity-10" style={{ fontFamily: "'Shippori Mincho B1', serif", color: "var(--crimson)" }}>
          武士道
        </span>
      </div>
    </section>
  );
}
