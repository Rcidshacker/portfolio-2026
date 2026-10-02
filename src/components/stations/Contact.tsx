"use client";
import { personalInfo } from "@/lib/data";
import { stationById } from "@/lib/stations";
import { At, wy } from "./At";

export default function Contact() {
  return (
    <At x={stationById("contact").x} y={wy(70)} focus="contact" w="min(720px, 90vw)" className="contact">
      <p className="eyebrow">05 — 結 Contact</p>
      <h2 className="h2">Let&rsquo;s build something that ships.</h2>
      <p className="lede">Open to AI engineer roles at teams building with LLMs in production.</p>
      <a className="mail" href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
      <ul className="links mono">
        <li><a href={personalInfo.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a></li>
        <li><a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></li>
        <li><span>{personalInfo.location}</span></li>
      </ul>
      <div className="stamp" aria-hidden><span>完</span></div>
    </At>
  );
}

export function Credit() {
  return (
    <At x={stationById("contact").x} y="calc(100% - 5.6rem)" focus="contact" w="min(640px, 90vw)" className="credit-at">
      <p className="credit mono">
        Painting engine: <a href="https://github.com/LingDong-/shan-shui-inf" target="_blank" rel="noopener noreferrer">{"{Shan, Shui}*"}</a> by Lingdong Huang (MIT). © 2026 {personalInfo.name}.
      </p>
    </At>
  );
}
