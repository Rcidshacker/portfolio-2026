"use client";
import { motion } from "framer-motion";
import { skills } from "@/lib/data";

const jp: Record<string, string> = {
  "AI & LLM":          "人工知能",
  "Frontend & Mobile": "フロント",
  "Backend & Infra":   "基盤",
  "ML & Research":     "研究",
  "Languages":         "言語",
};

export default function Skills() {
  return (
    <section id="skills" className="py-36 px-8 md:px-20 max-w-6xl mx-auto">
      <div className="ink-divider mb-16" />
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="section-tag mb-4">
        03 — Stack
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold mb-16"
        style={{ fontFamily: "'Shippori Mincho B1', serif", color: "var(--paper)" }}
      >
        What I build with.
      </motion.h2>

      <div className="space-y-8">
        {Object.entries(skills).map(([cat, items], ci) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ci * 0.07 }}
            className="grid md:grid-cols-[160px_1fr] gap-6 items-start py-6"
            style={{ borderTop: "0.5px solid var(--line)" }}
          >
            <div className="flex flex-col gap-1">
              <span className="mono text-[9px] tracking-[0.25em] uppercase opacity-40" style={{ color: "var(--paper)" }}>
                {cat}
              </span>
              <span className="text-xs opacity-15" style={{ fontFamily: "'Shippori Mincho B1', serif", color: "var(--crimson)" }}>
                {jp[cat]}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map((s, si) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: ci * 0.07 + si * 0.025 }}
                  className="mono text-[10px] px-3 py-1.5 tracking-wider cursor-default transition-all duration-200"
                  style={{
                    border: "0.5px solid var(--line-strong)",
                    color: "var(--paper)",
                    opacity: 0.45,
                    background: "rgba(240,234,216,0.02)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "var(--crimson-border)";
                    e.currentTarget.style.color = "var(--crimson)";
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.background = "var(--crimson-dim)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--line-strong)";
                    e.currentTarget.style.color = "var(--paper)";
                    e.currentTarget.style.opacity = "0.45";
                    e.currentTarget.style.background = "rgba(240,234,216,0.02)";
                  }}
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
