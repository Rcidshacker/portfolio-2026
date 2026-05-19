"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; rotation: number; vr: number;
  type: "dot" | "line";
}

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = 28;
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.25 + 0.03,
      rotation: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.01,
      type: Math.random() > 0.6 ? "line" : "dot",
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.opacity;

        if (p.type === "dot") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = "#bf0a2a";
          ctx.fill();
        } else {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.strokeStyle = "#f0ead8";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(-p.size * 3, 0);
          ctx.lineTo(p.size * 3, 0);
          ctx.stroke();
        }

        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;

        // Wrap
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}
