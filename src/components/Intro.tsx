"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Intro() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "var(--ink)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
        >
          {/* Top curtain */}
          <motion.div
            className="absolute inset-x-0 top-0"
            style={{ background: "var(--ink)", height: "50%", originY: 0 }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 1.3 }}
          />
          {/* Bottom curtain */}
          <motion.div
            className="absolute inset-x-0 bottom-0"
            style={{ background: "var(--ink)", height: "50%", originY: 1 }}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 1.3 }}
          />

          {/* Center stamp */}
          <div className="relative flex flex-col items-center gap-4">
            <motion.div
              initial={{ scale: 1.6, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
              className="relative"
            >
              {/* Red seal box */}
              <div
                className="w-24 h-24 flex items-center justify-center border-2"
                style={{ borderColor: "var(--crimson)", background: "var(--crimson-dim)" }}
              >
                <span
                  className="text-5xl font-bold select-none"
                  style={{
                    fontFamily: "'Shippori Mincho B1', serif",
                    color: "var(--crimson)",
                    textShadow: "0 0 20px rgba(191,10,42,0.5)",
                  }}
                >
                  武
                </span>
              </div>
              {/* Stamp ring ripple */}
              <motion.div
                className="absolute inset-0 border-2"
                style={{ borderColor: "var(--crimson)" }}
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.35, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mono text-[10px] tracking-[0.4em] uppercase"
              style={{ color: "var(--paper)" }}
            >
              Ruchit Das
            </motion.p>
          </div>

          {/* Horizontal lines that sweep in */}
          {[0.4, 0.55, 0.7].map((delay, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0"
              style={{
                top: `${30 + i * 20}%`,
                height: "0.5px",
                background: "var(--line)",
                originX: i % 2 === 0 ? 0 : 1,
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
