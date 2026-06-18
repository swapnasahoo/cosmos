import Starfield from "@/components/Starfield";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Starfield />
      <Header />
      <main className="relative z-10 flex flex-col min-h-screen">
        <Hero />
        {/* Placeholder for future sections to allow scrolling */}
        <section id="timeline" className="min-h-screen border-t border-white/5 bg-black/30 flex items-center justify-center">
          <h2 className="text-2xl font-bold font-heading text-neutral-400">Timeline Section (Loading...)</h2>
        </section>
        <section id="cmb" className="min-h-screen border-t border-white/5 bg-black/20 flex items-center justify-center">
          <h2 className="text-2xl font-bold font-heading text-neutral-400">CMB Echo Section (Loading...)</h2>
        </section>
        <section id="evidence" className="min-h-screen border-t border-white/5 bg-black/30 flex items-center justify-center">
          <h2 className="text-2xl font-bold font-heading text-neutral-400">Evidence Section (Loading...)</h2>
        </section>
        <section id="sandbox" className="min-h-screen border-t border-white/5 bg-black/20 flex items-center justify-center">
          <h2 className="text-2xl font-bold font-heading text-neutral-400">Simulator Section (Loading...)</h2>
        </section>
        <section id="faq" className="min-h-screen border-t border-white/5 bg-black/30 flex items-center justify-center">
          <h2 className="text-2xl font-bold font-heading text-neutral-400">Cosmic Q&A Section (Loading...)</h2>
        </section>
      </main>
    </>
  );
}
