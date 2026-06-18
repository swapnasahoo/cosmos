import Starfield from "@/components/Starfield";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Chronology from "@/components/Chronology";
import CmbExplorer from "@/components/CmbExplorer";
import Simulator from "@/components/Simulator";

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
        <section id="faq" className="min-h-screen border-t border-white/5 bg-black/30 flex items-center justify-center">
          <h2 className="text-2xl font-bold font-heading text-neutral-400">Cosmic Q&A Section (Loading...)</h2>
        </section>
      </main>
    </>
  );
}
