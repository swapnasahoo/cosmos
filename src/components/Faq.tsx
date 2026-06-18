"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Globe } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What existed before the Big Bang?",
    answer: "According to general relativity, the Big Bang was the origin of space and time themselves. Therefore, asking what happened \"before\" the Big Bang is like asking \"what is north of the North Pole?\" Time did not exist as a physical dimension before this event. However, advanced theoretical physics models, such as String Theory and Loop Quantum Cosmology, suggest our universe might have emerged from a pre-existing \"multiverse\" or collapsed from a prior universe in a \"Big Bounce.\"",
  },
  {
    key: "faq-q-2",
    question: "Where did the Big Bang take place? Did it expand from a point in space?",
    answer: "The Big Bang did not happen at a single point in space. It happened everywhere at once. The Big Bang was not an explosion of matter in pre-existing space, but rather the rapid expansion of space itself. Every point in the universe today was once compressed into the initial singularity. Therefore, the Big Bang occurred at every location in the universe simultaneously.",
  } as any,
  {
    question: "What is the universe expanding into?",
    answer: "The universe is not expanding \"into\" anything. It does not require a surrounding space to expand into. The universe is self-contained. When cosmologists say the universe is expanding, they mean that the distance between galaxies (or coordinates of space) is increasing over time. The fabric of space itself is stretching, but it isn't pushing into empty external space.",
  },
  {
    question: "How do we know the exact age of the universe is 13.8 billion years?",
    answer: "We determine the age of the universe through two main methods. First, by measuring the rate of expansion (the Hubble Constant) and the density of matter and dark energy using spacecraft like the ESA Planck mission, we can run the mathematical equations of general relativity backward to find when size was zero. This yields 13.787 ± 0.020 billion years. Second, we can verify this by estimating the ages of the oldest stars (in globular clusters) and radioactive element decay, which are consistently slightly younger than 13.8 billion years.",
  },
  {
    question: "What will be the ultimate fate of the universe?",
    answer: "The ultimate fate depends on the amount of dark energy and matter in the cosmos. Currently, measurements suggest that dark energy dominates, causing the expansion of the universe to accelerate. If this continues, the universe faces a \"Big Freeze\" (or Heat Death), where stars run out of fuel, galaxies drift too far apart to interact, and the universe becomes a cold, dark, maximum-entropy state. Other possibilities include a \"Big Rip\" (where dark energy tears atoms apart) or a \"Big Crunch\" (if gravity eventually reverses expansion).",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full">
      {/* FAQ Accordion Section */}
      <section id="faq" className="py-24 max-w-[800px] mx-auto px-6 scroll-mt-12">
        <div className="text-center flex flex-col items-center gap-4 mb-16">
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-cyan-400 font-heading bg-cyan-400/10 px-4 py-1.5 rounded-full border border-cyan-400/20 shadow-[0_0_15px_rgba(0,242,254,0.1)]">
            COSMOLOGICAL MYSTERIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight uppercase">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 max-w-[600px] font-light">
            Cosmology can be mind-bending. Here are answers to some of the most common questions about the Big Bang.
          </p>
        </div>

        {/* Accordions */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-[#0c0724] border-cyan-500/30 shadow-[0_0_15px_rgba(0,242,254,0.05)]"
                    : "bg-[#0b071e]/50 border-white/5 hover:border-white/10 hover:bg-[#150f35]/25"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left font-heading text-sm sm:text-base font-semibold text-white tracking-wide transition-colors group cursor-pointer"
                >
                  <span className="group-hover:text-cyan-400 transition-colors">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0 ml-4 group-hover:text-white transition-colors" />
                  )}
                </button>
                <div
                  className={`transition-all duration-350 ease-in-out ${
                    isOpen ? "max-h-[300px] border-t border-white/5 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-6 py-5 text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full border-t border-white/5 bg-[#030107] py-16 mt-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-12">
          {/* Top Panel */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex flex-col gap-4 max-w-[320px]">
              <a
                href="#hero"
                onClick={(e) => handleScrollTo(e, "hero")}
                className="flex items-center gap-2 font-heading font-black tracking-wider text-white select-none self-start"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2fe]" />
                <span className="text-lg tracking-widest font-heading font-black">COSMOS</span>
              </a>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                An interactive exploration of the Big Bang and physical cosmology. Designed to illuminate the origins of the space-time continuum.
              </p>
            </div>

            {/* Navigation links */}
            <div className="flex flex-wrap gap-x-16 gap-y-8">
              <div className="flex flex-col gap-3">
                <h4 className="font-heading text-xs font-semibold text-white tracking-widest uppercase">
                  Sections
                </h4>
                <ul className="flex flex-col gap-2 text-xs sm:text-sm text-neutral-400 font-light">
                  {["hero", "timeline", "cmb", "evidence", "sandbox"].map((sec) => (
                    <li key={sec}>
                      <a
                        href={`#${sec}`}
                        onClick={(e) => handleScrollTo(e, sec)}
                        className="hover:text-cyan-400 transition-colors"
                      >
                        {sec === "hero" && "Genesis"}
                        {sec === "timeline" && "Chronology"}
                        {sec === "cmb" && "CMB Echo"}
                        {sec === "evidence" && "Evidence"}
                        {sec === "sandbox" && "Simulator"}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="font-heading text-xs font-semibold text-white tracking-widest uppercase">
                  Scientific Resources
                </h4>
                <ul className="flex flex-col gap-2 text-xs sm:text-sm text-neutral-400 font-light">
                  <li>
                    <a
                      href="https://www.nasa.gov"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cyan-400 transition-colors"
                    >
                      NASA Cosmology
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.esa.int"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cyan-400 transition-colors"
                    >
                      ESA Planck Mission
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://arxiv.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cyan-400 transition-colors"
                    >
                      arXiv Physics Papers
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Panel */}
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500 font-heading">
            <p className="font-light">
              &copy; 2026 Cosmos Explorations. Built with passion for astrophysics and web design.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-white/5 hover:border-cyan-500/20 bg-white/5 flex items-center justify-center text-neutral-400 hover:text-cyan-400 transition-all duration-300"
                aria-label="Twitter"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-white/5 hover:border-cyan-500/20 bg-white/5 flex items-center justify-center text-neutral-400 hover:text-cyan-400 transition-all duration-300"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-white/5 hover:border-cyan-500/20 bg-white/5 flex items-center justify-center text-neutral-400 hover:text-cyan-400 transition-all duration-300"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
