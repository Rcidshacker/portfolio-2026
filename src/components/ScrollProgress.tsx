"use client";
import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      if (barRef.current) barRef.current.style.height = `${pct}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed left-0 top-0 bottom-0 z-40 pointer-events-none"
      style={{ width: "2px", background: "rgba(191,10,42,0.08)" }}
    >
      <div
        ref={barRef}
        className="w-full"
        style={{
          background: "linear-gradient(to bottom, var(--crimson), rgba(191,10,42,0.4))",
          height: "0%",
          transition: "height 0.1s linear",
          boxShadow: "1px 0 8px rgba(191,10,42,0.3)",
        }}
      />
    </div>
  );
}
