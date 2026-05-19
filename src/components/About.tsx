"use client";
import { motion, type MotionProps } from "framer-motion";
import { personalInfo } from "@/lib/data";

const fadeUp: MotionProps = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: "easeOut" },
};

export default function About() {
  return (
    <section id="about" className="py-36 px-8 md:px-20 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-[1fr_1.1fr] gap-20 items-start">
        {/* Left */}
        <div>
          <motion.p {...fadeUp} className="section-tag mb-4">01 — About</motion.p>
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold leading-tight mb-10"
            style={{ fontFamily: "'Shippori Mincho B1', serif", color: "var(--paper)" }}
          >
            Building AI<br />
            <span className="underline-red" style={{ color: "var(--crimson)" }}>that ships.</span>
          </motion.h2>

          <div className="space-y-5">
            {personalInfo.about.map((para, i) => (
              <motion.p
                key={i}
                {...fadeUp}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.1 }}
                className="text-sm leading-[1.85] font-light"
                style={{ color: "var(--paper-dim)" }}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </div>

        {/* Right — stat grid */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mt-10 md:mt-16"
        >
          {[
            { kanji: "四十八時間", value: "48h", label: "Full-stack sprint to live" },
            { kanji: "六診療所",   value: "6",   label: "Clinics B2B deployed" },
            { kanji: "頂点三",     value: "Top 3", label: "IIT Bombay national final" },
            { kanji: "最先端",     value: "2026", label: "MCP · LangGraph stack" },
          ].map((s) => (
            <div
              key={s.label}
              className="ink-card p-5 flex flex-col gap-2"
            >
              <span
                className="text-[10px] tracking-widest opacity-25"
                style={{ fontFamily: "'Shippori Mincho B1', serif", color: "var(--paper)" }}
              >
                {s.kanji}
              </span>
              <span
                className="text-3xl font-bold leading-none"
                style={{ fontFamily: "'Shippori Mincho B1', serif", color: "var(--crimson)" }}
              >
                {s.value}
              </span>
              <span className="text-xs leading-snug opacity-40" style={{ color: "var(--paper)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
