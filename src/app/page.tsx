import Starfield from "@/components/Starfield";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Chronology from "@/components/Chronology";
import CmbExplorer from "@/components/CmbExplorer";
import Simulator from "@/components/Simulator";
import Faq from "@/components/Faq";

export default function Home() {
  return (
    <>
      <Starfield />
      <Header />
      <main className="relative z-10 flex flex-col min-h-screen">
        <Hero />
        <Chronology />
        <CmbExplorer />
        <Simulator />
        <Faq />
      </main>
    </>
  );
}
