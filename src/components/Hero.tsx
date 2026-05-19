"use client";
import { motion, type Variants } from "framer-motion";
import { personalInfo } from "@/lib/data";
import Particles from "./Particles";

const containerV: Variants = { animate: { transition: { staggerChildren: 0.13 } } };
const itemV: Variants = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
};

const name = "Ruchit".split("");
const surname = "Das".split("");
const charV: Variants = {
  initial: { opacity: 0, y: 40, rotateX: -60 },
  animate: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden seigaiha-bg">
      <Particles />
      {/* Vertical kanji strip — far left */}
      <div className="absolute left-6 top-0 bottom-0 flex flex-col items-center justify-center gap-8 pointer-events-none select-none">
        <span className="tategaki text-[11px] tracking-[0.4em] opacity-10" style={{ color: "var(--paper)" }}>
          人工知能
        </span>
        <span className="tategaki text-[10px] tracking-[0.35em] opacity-[0.07]" style={{ color: "var(--paper)" }}>
          創造と革新
        </span>
      </div>

      {/* Vertical kanji strip — far right */}
      <div className="absolute right-6 top-0 bottom-0 flex flex-col items-center justify-center pointer-events-none select-none">
        <span className="tategaki text-[11px] tracking-[0.4em] opacity-[0.08]" style={{ color: "var(--crimson)" }}>
          武士道
        </span>
      </div>

      {/* Red vertical line — left accent */}
      <div className="absolute left-16 top-24 bottom-24 w-px" style={{ background: "linear-gradient(to bottom, transparent, var(--crimson-border) 30%, var(--crimson-border) 70%, transparent)" }} />

      {/* Main content */}
      <motion.div
        variants={containerV}
        initial="initial"
        animate="animate"
        className="relative z-10 max-w-5xl mx-auto px-10 md:px-20 pt-32 pb-24 w-full"
      >
        {/* Status tag */}
        <motion.div variants={itemV} className="flex items-center gap-3 mb-10">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--crimson)", boxShadow: "0 0 6px var(--crimson)" }} />
          <span className="mono text-[10px] tracking-[0.25em] uppercase" style={{ color: "var(--crimson)" }}>
            AI Engineer · Vibe Coder · Open to roles
          </span>
        </motion.div>

        {/* Name block — letter stagger */}
        <motion.div variants={itemV} className="mb-8">
          <p className="mono text-xs tracking-[0.15em] mb-3 opacity-30" style={{ color: "var(--paper)" }}>
            ルーチット・ダス
          </p>
          <h1
            className="text-7xl md:text-[96px] font-bold leading-[0.9] tracking-tight"
            style={{ fontFamily: "'Shippori Mincho B1', serif", perspective: "600px" }}
          >
            <motion.span
              className="inline-flex overflow-hidden"
              variants={{ animate: { transition: { staggerChildren: 0.07, delayChildren: 0.5 } } }}
              initial="initial" animate="animate"
            >
              {name.map((ch, i) => (
                <motion.span key={i} variants={charV} style={{ color: "var(--paper)", display: "inline-block" }}>{ch}</motion.span>
              ))}
            </motion.span>
            <br />
            <motion.span
              className="inline-flex overflow-hidden"
              variants={{ animate: { transition: { staggerChildren: 0.07, delayChildren: 0.85 } } }}
              initial="initial" animate="animate"
            >
              {surname.map((ch, i) => (
                <motion.span key={i} variants={charV} style={{ color: "var(--crimson)", display: "inline-block" }}>{ch}</motion.span>
              ))}
              <motion.span variants={charV} style={{ color: "var(--crimson)", display: "inline-block" }}>.</motion.span>
            </motion.span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={itemV}
          className="text-base md:text-lg max-w-xl mb-4 leading-relaxed font-light"
          style={{ color: "var(--paper-dim)" }}
        >
          {personalInfo.tagline}
        </motion.p>

        {/* Stack line */}
        <motion.p variants={itemV} className="mono text-[11px] tracking-[0.15em] mb-12 opacity-30" style={{ color: "var(--paper)" }}>
          MCP · LangGraph · RAG · FastAPI · Next.js · pgvector
        </motion.p>

        {/* Metric seals */}
        <motion.div variants={itemV} className="flex flex-wrap gap-2 mb-14">
          {[
            { jp: "頂点三", en: "Top 3 IIT Bombay" },
            { jp: "六診療所", en: "6 Clinics" },
            { jp: "特許", en: "Patent Filed" },
            { jp: "四十八時間", en: "48h Sprints" },
          ].map((m) => (
            <div
              key={m.en}
              className="seal px-3 py-1.5 rounded-sm flex flex-col items-center gap-0.5"
            >
              <span className="text-[9px] tracking-widest opacity-60" style={{ fontFamily: "'Shippori Mincho B1', serif" }}>{m.jp}</span>
              <span className="text-[10px] tracking-[0.1em]">{m.en}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div variants={itemV} className="flex items-center gap-6">
          <a
            href="#projects"
            className="px-8 py-3 text-sm tracking-widest mono transition-all duration-300 hover:opacity-80"
            style={{
              background: "var(--crimson)",
              color: "var(--paper)",
              clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
            }}
          >
            VIEW WORK
          </a>
          <a
            href="#contact"
            className="px-8 py-3 text-sm tracking-widest mono border transition-all duration-300 hover:border-crimson"
            style={{ borderColor: "var(--line-strong)", color: "var(--paper-dim)" }}
          >
            CONTACT
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ opacity: 0.2 }}>
        <span className="mono text-[9px] tracking-[0.3em] uppercase" style={{ color: "var(--paper)" }}>scroll</span>
        <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, var(--paper), transparent)" }} />
      </div>
    </section>
  );
}
