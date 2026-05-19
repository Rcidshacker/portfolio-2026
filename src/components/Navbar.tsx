"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { personalInfo } from "@/lib/data";

const navLinks = [
  { label: "About",        href: "#about" },
  { label: "Projects",     href: "#projects" },
  { label: "Skills",       href: "#skills" },
  { label: "Recognition",  href: "#achievements" },
  { label: "Contact",      href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
      style={{
        background: scrolled ? "rgba(10,8,6,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "0.5px solid rgba(240,234,216,0.07)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
        {/* Logo mark */}
        <a href="#" className="flex items-center gap-2">
          <span
            className="w-6 h-6 flex items-center justify-center text-xs border"
            style={{
              fontFamily: "'Shippori Mincho B1', serif",
              color: "var(--crimson)",
              borderColor: "var(--crimson-border)",
              background: "var(--crimson-dim)",
            }}
          >
            武
          </span>
          <span className="mono text-xs tracking-[0.15em]" style={{ color: "var(--paper)", opacity: 0.7 }}>
            RD
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="mono text-[10px] tracking-[0.2em] uppercase transition-colors duration-200 hover:opacity-100"
              style={{ color: "var(--paper)", opacity: 0.4 }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--crimson)")}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--paper)"; e.currentTarget.style.opacity = "0.4"; }}
            >
              {l.label}
            </a>
          ))}
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-[10px] tracking-[0.15em] px-4 py-1.5 border transition-all duration-200"
            style={{
              color: "var(--crimson)",
              borderColor: "var(--crimson-border)",
              background: "var(--crimson-dim)",
            }}
          >
            GitHub ↗
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden flex flex-col gap-1.5" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="block w-5 h-px transition-all" style={{ background: menuOpen ? "var(--crimson)" : "var(--paper)", opacity: menuOpen ? 1 : 0.5 }} />
          <span className="block w-3 h-px transition-all" style={{ background: menuOpen ? "var(--crimson)" : "var(--paper)", opacity: menuOpen ? 1 : 0.5 }} />
          <span className="block w-5 h-px transition-all" style={{ background: menuOpen ? "var(--crimson)" : "var(--paper)", opacity: menuOpen ? 1 : 0.5 }} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-8 pb-6 flex flex-col gap-5"
            style={{ background: "rgba(10,8,6,0.97)", borderTop: "0.5px solid var(--line)" }}
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="mono text-[10px] tracking-[0.25em] uppercase"
                style={{ color: "var(--paper)", opacity: 0.5 }}
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
