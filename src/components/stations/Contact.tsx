import { personalInfo } from "@/lib/data";
import { stationById } from "@/lib/stations";
import Icon from "../Icon";
import { At } from "./At";

export default function Contact() {
  return (
    <At x={stationById("contact").x} y="clamp(5rem, 13svh, 9rem)" focus="contact" w="min(640px, 92vw)" className="contact">
      <div className="contact-card">
        <div className="stamp" aria-hidden>
          <span>完</span>
        </div>
        <p className="eyebrow">05 — 結 Contact</p>
        <h2 className="h2">Let&rsquo;s build something that ships.</h2>
        <p className="lede">Open to AI engineer roles at teams building with LLMs in production.</p>
        <a className="mail" href={`mailto:${personalInfo.email}`}>
          <Icon name="mail" size={20} />
          {personalInfo.email}
        </a>
        <ul className="links mono">
          <li>
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
              <Icon name="github" size={16} /> GitHub
            </a>
          </li>
          <li>
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
              <Icon name="linkedin" size={16} /> LinkedIn
            </a>
          </li>
          <li>
            <span>
              <Icon name="pin" size={16} /> {personalInfo.location}
            </span>
          </li>
        </ul>
      </div>
    </At>
  );
}
