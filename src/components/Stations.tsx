import Hero from "./stations/Hero";
import About from "./stations/About";
import Projects from "./stations/Projects";
import Skills from "./stations/Skills";
import Recognition from "./stations/Recognition";
import Contact, { Credit } from "./stations/Contact";

export default function Stations() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Recognition />
      <Contact />
      <Credit />
    </>
  );
}
