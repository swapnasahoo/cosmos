"use client";

import React from "react";

export default function Hero() {
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-24"
    >
      {/* Background Graphic Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35 z-[-1] mix-blend-screen scale-105 select-none pointer-events-none"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#04020a] via-transparent to-[#04020a]/80 z-[-1] pointer-events-none" />

      <div className="max-w-[800px] text-center flex flex-col items-center gap-6">
        <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-cyan-400 font-heading bg-cyan-400/10 px-4 py-1.5 rounded-full border border-cyan-400/20 shadow-[0_0_15px_rgba(0,242,254,0.1)]">
          THE ORIGIN OF SPACE & TIME
        </span>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black font-heading text-white tracking-tighter leading-none select-none uppercase text-neon-cyan animate-pulse-slow">
          THE BIG BANG
        </h1>

        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-[620px] font-light">
          13.8 billion years ago, the universe exploded from an infinitely dense, hot point. Not an explosion in space, but an expansion of space itself.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <button
            onClick={() => handleScrollTo("timeline")}
            className="px-8 py-3.5 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 transition-all duration-300 font-heading font-semibold shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            Begin the Journey
          </button>
          <button
            onClick={() => handleScrollTo("sandbox")}
            className="px-8 py-3.5 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all duration-300 font-heading font-medium hover:scale-105 active:scale-95 cursor-pointer hover:border-white/25"
          >
            Run Simulation
          </button>
        </div>
      </div>

      {/* Mouse Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300 pointer-events-none select-none">
        <div className="w-5 h-8 rounded-full border border-neutral-400 flex justify-center p-1">
          <div className="w-1 h-2 bg-neutral-400 rounded-full animate-bounce mt-1" />
        </div>
        <span className="text-[10px] tracking-widest font-heading text-neutral-400 uppercase">
          Scroll to explore
        </span>
      </div>
    </section>
  );
}
