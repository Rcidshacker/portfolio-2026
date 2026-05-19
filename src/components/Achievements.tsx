"use client";
import { motion } from "framer-motion";
import { achievements, certifications } from "@/lib/data";

export default function Achievements() {
  return (
    <section id="achievements" className="py-36 px-8 md:px-20 max-w-6xl mx-auto">
      <div className="ink-divider mb-16" />
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="section-tag mb-4">
        04 — Recognition
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold mb-16"
        style={{ fontFamily: "'Shippori Mincho B1', serif", color: "var(--paper)" }}
      >
        Validated under<br />
        <span style={{ color: "var(--crimson)" }}>pressure.</span>
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-4 mb-16">
        {achievements.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="ink-card p-6 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm mb-1" style={{ fontFamily: "'Shippori Mincho B1', serif", color: "var(--paper)" }}>
                  {a.title}
                </h3>
                <p className="mono text-[9px] tracking-widest" style={{ color: "var(--crimson)", opacity: 0.8 }}>
                  {a.org} · {a.year}
                </p>
              </div>
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--crimson)", boxShadow: "0 0 5px var(--crimson)" }} />
            </div>
            <p className="text-xs leading-relaxed font-light" style={{ color: "var(--paper-dim)", opacity: 0.65 }}>
              {a.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Certs */}
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="mono text-[9px] tracking-[0.25em] uppercase mb-6" style={{ color: "var(--paper)", opacity: 0.3 }}>
          Certifications · 証明書
        </p>
        <div className="flex flex-wrap gap-3">
          {certifications.map(c => (
            <div key={c.name} className="ink-card px-4 py-3">
              <p className="text-xs font-medium mb-0.5" style={{ color: "var(--paper)", opacity: 0.7 }}>{c.name}</p>
              <p className="mono text-[9px] opacity-30" style={{ color: "var(--paper)" }}>{c.detail}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
