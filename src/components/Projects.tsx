"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";

const categories = ["All", "AI/ML", "SaaS", "Tooling", "CV", "Full-Stack"] as const;

export default function Projects() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter(p => p.category === active);

  return (
    <section id="projects" className="py-36 px-8 md:px-20 max-w-6xl mx-auto">
      <div className="ink-divider mb-16" />

      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="section-tag mb-4">
        02 — Projects
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold mb-12"
        style={{ fontFamily: "'Shippori Mincho B1', serif", color: "var(--paper)" }}
      >
        Things I&apos;ve shipped.
      </motion.h2>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className="mono text-[10px] tracking-[0.18em] px-3 py-1.5 border transition-all duration-200"
            style={{
              borderColor: active === cat ? "var(--crimson)" : "var(--line-strong)",
              color: active === cat ? "var(--crimson)" : "var(--paper)",
              background: active === cat ? "var(--crimson-dim)" : "transparent",
              opacity: active === cat ? 1 : 0.45,
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="ink-card p-6 flex flex-col gap-4 group"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div>
                {p.featured && (
                  <span className="seal text-[8px] px-2 py-0.5 mb-2 inline-block tracking-widest" style={{ borderRadius: "1px" }}>
                    精選
                  </span>
                )}
                <h3
                  className="text-base font-bold transition-colors duration-200 group-hover:text-red-400"
                  style={{ fontFamily: "'Shippori Mincho B1', serif", color: "var(--paper)" }}
                >
                  {p.title}
                </h3>
                <p className="mono text-[10px] tracking-wider mt-0.5 opacity-35" style={{ color: "var(--paper)" }}>
                  {p.subtitle} · {p.period}
                </p>
              </div>
              {p.github && (
                <a href={p.github} target="_blank" rel="noopener noreferrer"
                  className="mono text-[10px] opacity-20 hover:opacity-70 transition-opacity mt-1 shrink-0"
                  style={{ color: "var(--paper)" }}>
                  ↗
                </a>
              )}
            </div>

            <p className="text-xs leading-relaxed flex-1 font-light" style={{ color: "var(--paper-dim)", opacity: 0.75 }}>
              {p.description}
            </p>

            {/* Metrics */}
            {p.metrics && (
              <div className="flex flex-wrap gap-1.5">
                {p.metrics.map(m => (
                  <span key={m} className="mono text-[9px] px-2 py-1 tracking-wider seal" style={{ borderRadius: "1px", opacity: 0.8 }}>
                    {m}
                  </span>
                ))}
              </div>
            )}

            {/* Stack — bottom divider */}
            <div className="pt-3 flex flex-wrap gap-1.5" style={{ borderTop: "0.5px solid var(--line)" }}>
              {p.stack.map(tech => (
                <span key={tech} className="mono text-[9px] px-2 py-0.5 tracking-wider"
                  style={{ color: "var(--paper)", opacity: 0.25, border: "0.5px solid var(--line-strong)", background: "rgba(240,234,216,0.02)" }}>
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
