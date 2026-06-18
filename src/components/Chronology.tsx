"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Epoch {
  id: string;
  index: number;
  title: string;
  time: string;
  temp: string;
  image: string;
  text: string;
  highlight: string;
}

const stats = [
  { value: "13.8B", label: "Years Since Genesis" },
  { value: "10³² K", label: "Initial Temperature" },
  { value: "Infinite", label: "Current Expansion" },
  { value: "98%", label: "H & He Atoms" },
];

const epochs: Epoch[] = [
  {
    id: "planck",
    index: 1,
    title: "Planck Epoch",
    time: "0 to 10⁻⁴³ seconds",
    temp: "10³² Kelvin",
    image: "/images/hero.jpg",
    text: "The earliest possible period of the universe. At this scale, the fabric of space and time is a foam-like quantum structure. All four fundamental forces of nature—Gravity, Electromagnetism, Strong Nuclear, and Weak Nuclear—are unified into a single, super-force.",
    highlight: "Current physical theories (like general relativity and quantum mechanics) break down. We require a yet-unproved theory of \"Quantum Gravity\" to fully understand this epoch.",
  },
  {
    id: "inflation",
    index: 2,
    title: "Cosmic Inflation",
    time: "10⁻³⁶ to 10⁻³² seconds",
    temp: "10²⁸ Kelvin",
    image: "/images/hero.jpg",
    text: "A mysterious field triggers a super-exponential expansion of space. The universe expands by a factor of 10²⁶ in a fraction of a second, going from smaller than a proton to about the size of a grapefruit. This smoothens space out and seeds quantum fluctuations that will become galaxies.",
    highlight: "Inflation solves major cosmological problems, explaining why the universe is so flat and uniform in all directions (the Horizon Problem).",
  },
  {
    id: "quark",
    index: 3,
    title: "Quark Epoch",
    time: "10⁻¹² to 10⁻⁶ seconds",
    temp: "10¹⁵ Kelvin",
    image: "/images/hero.jpg",
    text: "The four fundamental forces separate into their modern forms. The universe is filled with a dense, hot plasma of elementary particles including quarks, leptons (like electrons), and gluons. It is too hot for quarks to bind together into protons and neutrons.",
    highlight: "Quark-Gluon Plasma (QGP) is recreated today in high-energy particle accelerators like the Large Hadron Collider (LHC) at CERN.",
  },
  {
    id: "nucleo",
    index: 4,
    title: "Nucleosynthesis",
    time: "1 second to 3 minutes",
    temp: "10⁹ Kelvin",
    image: "/images/hero.jpg",
    text: "The universe has cooled enough for quarks to form protons and neutrons. Now, nuclear fusion takes place on a cosmic scale. Protons and neutrons fuse to create the first atomic nuclei: Hydrogen, Deuterium, Helium, and traces of Lithium.",
    highlight: "After 20 minutes, the universe cools too much for fusion to continue. The ratio of Hydrogen (75%) and Helium (25%) is locked in, matching today's observations.",
  },
  {
    id: "cmb",
    index: 5,
    title: "Recombination (CMB)",
    time: "380,000 years",
    temp: "3,000 Kelvin",
    image: "/images/cmb.jpg",
    text: "The universe has cooled sufficiently for electrons to bind to nuclei, forming the first stable atoms (neutral Hydrogen). Up to this point, the universe was an opaque plasma scattering light. Now, space becomes transparent, and the first light escapes, traveling freely.",
    highlight: "This \"first light\" is observed today as the Cosmic Microwave Background (CMB)—the oldest radiation we can detect.",
  },
  {
    id: "darkages",
    index: 6,
    title: "The Cosmic Dark Ages",
    time: "380k to 150 million years",
    temp: "3,000 to 60 Kelvin",
    image: "/images/hero.jpg",
    text: "After recombination, the universe is filled with neutral hydrogen gas, but no stars have ignited yet. There are no sources of light besides the gradually fading CMB. The universe is completely dark, but gravity is quietly pulling gas clouds together.",
    highlight: "During this quiet era, clumps of dark matter grow larger, acting as gravitational anchors for the baryonic gas that will form the first galaxies.",
  },
  {
    id: "stars",
    index: 7,
    title: "First Stars & Galaxies",
    time: "150M to 1 billion years",
    temp: "60 to 10 Kelvin",
    image: "/images/galaxy.jpg",
    text: "Gravity succeeds in compressing hydrogen gas clouds until their cores reach critical fusion temperatures. The first generation of massive stars (Population III stars) ignite, ending the Dark Ages. Their intense ultraviolet radiation ionizes the surrounding hydrogen gas (Reionization).",
    highlight: "These stars cluster together to form the very first proto-galaxies, visible today in deep-field images from the James Webb Space Telescope (JWST).",
  },
  {
    id: "modern",
    index: 8,
    title: "The Modern Era",
    time: "1 billion years to Present",
    temp: "2.7 Kelvin",
    image: "/images/galaxy.jpg",
    text: "Galaxies merge and grow. Generations of stars live and die, enriching the cosmos with heavy elements (carbon, oxygen, iron) through supernovas. Around 9 billion years after the Big Bang (4.6 billion years ago), our Sun and Solar System form from a recycled nebula.",
    highlight: "Today, the universe is 13.8 billion years old, containing trillions of galaxies. Cosmic expansion is accelerating due to Dark Energy.",
  },
];

export default function Chronology() {
  const [activeEpoch, setActiveEpoch] = useState<Epoch>(epochs[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleEpochChange = (epoch: Epoch) => {
    if (epoch.id === activeEpoch.id) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveEpoch(epoch);
      setIsTransitioning(false);
    }, 250);
  };

  return (
    <div className="w-full">
      {/* Stats Banner Section */}
      <section id="cosmic-stats" className="relative py-12 border-t border-b border-white/5 bg-black/40">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center text-center p-4 glass-panel border-white/5"
              >
                <span className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 select-none animate-pulse-slow">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase mt-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Timeline Section */}
      <section id="timeline" className="py-24 max-w-[1200px] mx-auto px-6 scroll-mt-12">
        <div className="text-center flex flex-col items-center gap-4 mb-16">
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-cyan-400 font-heading bg-cyan-400/10 px-4 py-1.5 rounded-full border border-cyan-400/20 shadow-[0_0_15px_rgba(0,242,254,0.1)]">
            COSMIC CHRONOLOGY
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white tracking-tight uppercase">
            Timeline of the Universe
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 max-w-[600px] font-light">
            Trace the stages of the cosmos from the subatomic fury of the first microsecond to the formation of galaxies, stars, and life.
          </p>
        </div>

        {/* Timeline Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Buttons Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {epochs.map((epoch) => (
              <button
                key={epoch.id}
                onClick={() => handleEpochChange(epoch)}
                className={`w-full text-left px-5 py-4 rounded-xl border flex items-center justify-between transition-all duration-300 group cursor-pointer ${
                  activeEpoch.id === epoch.id
                    ? "bg-cyan-500/5 border-cyan-500 shadow-[0_0_15px_rgba(0,242,254,0.1)] text-cyan-400 font-bold"
                    : "bg-[#0b071e]/50 border-white/5 text-neutral-400 hover:text-white hover:border-white/10 hover:bg-[#150f35]/30"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] tracking-widest font-heading font-bold uppercase text-neutral-500 group-hover:text-neutral-400 transition-colors">
                    Epoch {epoch.index} of 8
                  </span>
                  <span className={`text-base font-heading ${activeEpoch.id === epoch.id ? "text-cyan-400" : "text-white"}`}>
                    {epoch.title}
                  </span>
                </div>
                <span className="text-xs font-heading tracking-widest opacity-60 text-right shrink-0">
                  {epoch.time.replace(" seconds", "s")}
                </span>
              </button>
            ))}
          </div>

          {/* Right Display Card */}
          <div className="lg:col-span-8 glass-panel border-white/5 shadow-2xl relative overflow-hidden min-h-[440px] flex items-center p-8 sm:p-10">
            {/* Ambient Backlight Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />

            <div
              className={`w-full grid grid-cols-1 md:grid-cols-12 gap-8 transition-all duration-300 ${
                isTransitioning ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
              }`}
            >
              {/* Card Copy Data */}
              <div className="md:col-span-7 flex flex-col justify-between gap-6">
                <div>
                  <span className="text-[10px] font-semibold tracking-widest text-cyan-400 font-heading bg-cyan-400/15 px-3 py-1 rounded-md border border-cyan-400/10">
                    STAGE {activeEpoch.index}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white mt-4 tracking-wide uppercase">
                    {activeEpoch.title}
                  </h3>

                  {/* Metadata Indicators */}
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-neutral-400 font-light border-b border-white/5 pb-4">
                    <div>
                      <span className="font-semibold text-neutral-300">Time: </span>
                      <span>{activeEpoch.time}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-300">Temp: </span>
                      <span>{activeEpoch.temp}</span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light mt-4">
                    {activeEpoch.text}
                  </p>
                </div>

                {/* Physics Milestone Highlight box */}
                <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20 text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                  <span className="font-semibold text-indigo-300 font-heading tracking-wide block mb-1">
                    PHYSICS MILESTONE
                  </span>
                  {activeEpoch.highlight}
                </div>
              </div>

              {/* Card Image Panel */}
              <div className="md:col-span-5 flex items-center justify-center">
                <div className="relative w-full aspect-square md:h-full md:aspect-auto min-h-[240px] md:min-h-[300px] rounded-xl overflow-hidden border border-white/10 group shadow-lg">
                  <Image
                    src={activeEpoch.image}
                    alt={`Visual depiction of ${activeEpoch.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                  />
                  {/* Subtle hover gradient grid */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
