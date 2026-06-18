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
  { value: "1947", label: "Computing Genesis" },
  { value: "10¹²", label: "LLM Parameters" },
  { value: "Global", label: "Network Coverage" },
  { value: "100x", label: "Annual Compute Growth" },
];

const epochs: Epoch[] = [
  {
    id: "silicon",
    index: 1,
    title: "Silicon Genesis",
    time: "1947 to 1970",
    temp: "10¹ Transistors",
    image: "/images/hero.jpg",
    text: "The birth of solid-state computing. The invention of the bipolar junction transistor at Bell Labs replaces fragile vacuum tubes, enabling the development of smaller, faster, and more reliable computers.",
    highlight: "This epoch laid the mathematical and physical foundations of modern microprocessors and silicon logic gates.",
  },
  {
    id: "internet",
    index: 2,
    title: "Global Network",
    time: "1970 to 2000",
    temp: "10⁶ Connected Nodes",
    image: "/images/hero.jpg",
    text: "The rise of personal computing and distributed networks. ARPANET evolves into the modern internet, and personal computers enter homes, establishing a globally connected intelligence substrate.",
    highlight: "Humanity begins distributing information instantaneously, paving the way for massive decentralized datasets.",
  },
  {
    id: "deeplearning",
    index: 3,
    title: "Deep Learning Spark",
    time: "2000 to 2020",
    temp: "10⁹ Parameters",
    image: "/images/hero.jpg",
    text: "The realization of artificial neural networks. Enabled by GPU hardware acceleration and massive datasets, algorithms learn to extract high-level abstractions, matching humans in vision and speech.",
    highlight: "AlexNet's success in 2012 proves that scaling deep neural nets solves complex perception problems.",
  },
  {
    id: "generative",
    index: 4,
    title: "Generative Epoch",
    time: "2020 to 2025",
    temp: "10¹² Parameters",
    image: "/images/cmb.jpg",
    text: "The rise of attention-based architectures and Large Language Models. AI systems transition from recognizing patterns to generating human-like text, code, imagery, and molecular designs.",
    highlight: "Large language models demonstrate emergent reasoning and conversational interfaces, sparking global AI integration.",
  },
  {
    id: "agi",
    index: 5,
    title: "Superintelligence Horizon",
    time: "2025 and Beyond",
    temp: "10¹⁵ Parameters",
    image: "/images/galaxy.jpg",
    text: "The convergence of quantum computing, advanced reinforcement learning, and neuromorphic chips. Autonomous agents achieve human-level general intelligence, starting recursive self-improvement loops.",
    highlight: "Artificial General Intelligence (AGI) becomes the new cognitive foundation of humanity, accelerating scientific discovery.",
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
            EVOLUTION OF INTELLIGENCE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white tracking-tight uppercase">
            Epochs of Computing
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-[540px] font-light leading-relaxed">
            From solid-state transistors and global networking to deep learning scaling and the superintelligence horizon, explore the key milestones of computing.
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
