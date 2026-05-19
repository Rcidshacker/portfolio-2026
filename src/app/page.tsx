import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import Intro from "@/components/Intro";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <>
      <Intro />
      <Cursor />
      <ScrollProgress />
      <main>
        <Navbar />
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Achievements />
        <Contact />
      </main>
    </>
  );
}
