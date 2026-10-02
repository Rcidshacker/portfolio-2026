import Stage from "@/components/Stage";
import Stations from "@/components/Stations";
import Navbar from "@/components/Navbar";
import Ruler from "@/components/Ruler";
import FilterBar from "@/components/FilterBar";
import Intro from "@/components/Intro";
import InkTrail from "@/components/InkTrail";
import Petals from "@/components/Petals";
import Panels from "@/components/Panels";

export default function Home() {
  return (
    <>
      <Intro />
      <Navbar />
      <main>
        <Stage>
          <Stations />
        </Stage>
      </main>
      <Panels />
      <FilterBar />
      <Ruler />
      <Petals />
      <InkTrail />
    </>
  );
}
