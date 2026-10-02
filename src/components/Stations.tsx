import Hero from "./stations/Hero";
import About from "./stations/About";
import Contact from "./stations/Contact";

/** In-world content. Projects, skills and recognition are shown in the side panels (Panels.tsx). */
export default function Stations() {
  return (
    <>
      <Hero />
      <About />
      <Contact />
    </>
  );
}
