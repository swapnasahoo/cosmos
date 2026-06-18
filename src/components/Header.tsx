"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { id: "hero", label: "Genesis" },
  { id: "timeline", label: "Timeline" },
  { id: "cmb", label: "CMB Echo" },
  { id: "evidence", label: "Evidence" },
  { id: "sandbox", label: "Simulator" },
  { id: "faq", label: "Cosmic Q&A" },
];

export default function Header() {
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -50% 0px", // triggers when section is in the middle of viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    navLinks.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#04020a]/85 border-b border-white/8 backdrop-blur-md py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, "hero")}
          className="flex items-center gap-2 font-heading font-bold tracking-wider text-white group"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform duration-300 shadow-[0_0_8px_#00f2fe]" />
          <span className="text-lg tracking-widest font-heading font-black">COSMOS</span>
        </a>

        {/* Desktop Navbar */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className={`font-heading text-xs font-semibold tracking-widest uppercase transition-all duration-300 border-b-2 ${
                activeSection === link.id
                  ? "text-cyan-400 border-cyan-400 pb-1"
                  : "text-neutral-400 hover:text-white border-transparent pb-1"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-neutral-400 hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`fixed top-[73px] left-0 w-full h-[calc(100vh-73px)] bg-[#04020a]/95 backdrop-blur-xl border-t border-white/5 flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden z-40 ${
          mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(e) => handleNavClick(e, link.id)}
            className={`font-heading text-xl font-bold tracking-widest uppercase transition-colors duration-300 ${
              activeSection === link.id ? "text-cyan-400" : "text-neutral-300 hover:text-white"
            }`}
          >
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
}
