"use client";

import React, { useState, useEffect, useRef } from "react";
import { Expand, Radio, Atom } from "lucide-react";

export default function CmbExplorer() {
  const [activeTelescope, setActiveTelescope] = useState<"planck" | "wmap" | "cobe">("planck");
  const [contrast, setContrast] = useState(1.0);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hudData, setHudData] = useState({ coord: "Center Grid Loaded", fluct: "± 0.00018 K" });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const drawGrid = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw horizontal latitude lines
      ctx.strokeStyle = "rgba(0, 242, 254, 0.08)";
      ctx.lineWidth = 1;
      for (let y = 30; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw vertical longitude curved arcs
      for (let x = 40; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.quadraticCurveTo(canvas.width / 2, canvas.height / 2, x, canvas.height);
        ctx.stroke();
      }

      // Draw central crosshairs
      ctx.strokeStyle = "rgba(255, 0, 127, 0.25)";
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    drawGrid();
    window.addEventListener("resize", drawGrid);

    // Initial timeout to ensure container is fully mounted and sized
    const timer = setTimeout(drawGrid, 150);

    return () => {
      window.removeEventListener("resize", drawGrid);
      clearTimeout(timer);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const bounds = container.getBoundingClientRect();
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    setMousePos({ x: mouseX, y: mouseY });
    setIsHovering(true);

    // Calculate RA/Dec coordinates dynamically
    const raHours = Math.floor((mouseX / bounds.width) * 24);
    const raMins = Math.floor(((mouseX / bounds.width) * 1440) % 60);
    const decDegrees = Math.floor((1 - mouseY / bounds.height) * 180 - 90);

    // Calculate temperature variations based on coordinates
    const noise = Math.sin(mouseX * 0.05) * Math.cos(mouseY * 0.05);
    const temperatureVariation = (noise * 0.00027 * contrast).toFixed(5);

    setHudData({
      coord: `RA ${raHours}h ${raMins}m / Dec ${decDegrees}°`,
      fluct: `± ${temperatureVariation} K`,
    });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setHudData({
      coord: "Center Grid Loaded",
      fluct: "± 0.00018 K",
    });
  };

  // Get CSS filter styles representing telescope resolutions
  const getFilterStyles = (scope: typeof activeTelescope, modifier: number = 1) => {
    let blurVal = 0;
    let brightnessVal = 1.0;
    let contrastVal = contrast;

    if (scope === "cobe") {
      blurVal = 8;
      contrastVal = contrast * 0.8;
      brightnessVal = 0.9;
    } else if (scope === "wmap") {
      blurVal = 2.5;
      contrastVal = contrast * 1.1;
      brightnessVal = 1.0;
    } else if (scope === "planck") {
      blurVal = 0;
      contrastVal = contrast * 1.25;
      brightnessVal = 1.05;
    }

    return `blur(${blurVal * modifier}px) contrast(${contrastVal}) brightness(${brightnessVal}) saturate(1.2)`;
  };

  // Magnifier values
  const containerWidth = containerRef.current ? containerRef.current.clientWidth : 400;
  const containerHeight = containerRef.current ? containerRef.current.clientHeight : 250;
  const zoom = 2;
  const bgWidth = containerWidth * zoom;
  const bgHeight = containerHeight * zoom;
  const bgX = -(mousePos.x * zoom - 60);
  const bgY = -(mousePos.y * zoom - 60);

  return (
    <div className="w-full">
      {/* CMB Map Explorer Section */}
      <section id="cmb" className="py-24 max-w-[1200px] mx-auto px-6 scroll-mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Panel: Text & Controls */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-cyan-400 font-heading bg-cyan-400/10 px-4 py-1.5 rounded-full border border-cyan-400/20 shadow-[0_0_15px_rgba(0,242,254,0.1)] self-start">
              THE COSMIC ECHO
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight uppercase">
              Cosmic Microwave Background (CMB)
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
              The CMB is the oldest light in the universe, imprinted onto the sky when the universe was just 380,000 years old. Before this, space was a dense, opaque plasma of electrons and protons trapping all light.
            </p>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
              As the cosmos expanded and cooled below 3,000K, electrons bound to protons to form neutral hydrogen (<strong>Recombination</strong>). Light escaped, traveling freely through space. These photons have been stretched by cosmic expansion into the microwave spectrum today.
            </p>

            {/* Interactive Panels */}
            <div className="p-6 rounded-xl border border-white/5 bg-[#0b071e]/50 flex flex-col gap-4 mt-2">
              <h4 className="font-heading font-semibold text-sm text-white uppercase tracking-wider">
                Explore the CMB Sky Map:
              </h4>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Hover over the sky map on the right. Observe how telescope resolution and anisotropy scales reveal the thermal structure of the early universe.
              </p>

              <div className="flex flex-col gap-3 mt-2">
                <span className="text-xs font-semibold text-neutral-400">Select Telescope Filter:</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["planck", "wmap", "cobe"] as const).map((scope) => (
                    <button
                      key={scope}
                      onClick={() => setActiveTelescope(scope)}
                      className={`px-3 py-2 text-[10px] sm:text-xs font-heading font-bold rounded-lg border transition-all cursor-pointer ${
                        activeTelescope === scope
                          ? "bg-cyan-500 text-black border-cyan-500 shadow-[0_0_10px_rgba(0,242,254,0.2)]"
                          : "bg-white/5 border-white/5 text-neutral-400 hover:text-white hover:border-white/15 hover:bg-white/10"
                      }`}
                    >
                      {scope === "planck" && "ESA Planck (2013)"}
                      {scope === "wmap" && "NASA WMAP (2001)"}
                      {scope === "cobe" && "NASA COBE (1989)"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <label htmlFor="cmb-anisotropy" className="text-neutral-400">Anisotropy Scale (Contrast):</label>
                  <span className="text-cyan-400 font-heading">{contrast.toFixed(1)}x</span>
                </div>
                <input
                  id="cmb-anisotropy"
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={contrast}
                  onChange={(e) => setContrast(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-neutral-800 rounded-lg cursor-pointer h-1.5"
                />
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Canvas Map */}
          <div className="lg:col-span-7">
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full aspect-[1.6] rounded-2xl border border-white/10 bg-[#04020a] overflow-hidden group cursor-crosshair shadow-2xl"
            >
              {/* Main CMB Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/cmb.jpg"
                alt="Cosmic Microwave Background Map"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                style={{ filter: getFilterStyles(activeTelescope) }}
              />

              {/* Coordinates Grid Overlay */}
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

              {/* Magnifying Glass Zoom circular cursor */}
              {isHovering && (
                <div
                  className="absolute w-28 h-28 rounded-full border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.4)] pointer-events-none overflow-hidden bg-no-repeat bg-black"
                  style={{
                    left: `${mousePos.x}px`,
                    top: `${mousePos.y}px`,
                    transform: "translate(-50%, -50%)",
                    backgroundImage: "url('/images/cmb.jpg')",
                    backgroundSize: `${bgWidth}px ${bgHeight}px`,
                    backgroundPosition: `${bgX}px ${bgY}px`,
                    filter: getFilterStyles(activeTelescope, 0.4), // magnifier gets slightly less blur for clarity
                  }}
                />
              )}

              {/* HUD Coordinates Board */}
              <div className="absolute bottom-4 left-4 right-4 py-2.5 px-4 rounded-xl border border-cyan-400/20 bg-[#04020a]/80 backdrop-blur-md flex flex-wrap gap-4 items-center justify-between text-[11px] font-heading font-semibold text-neutral-300">
                <div className="flex gap-2">
                  <span className="text-cyan-400 uppercase tracking-wider">T-Fluct:</span>
                  <span className="text-white font-mono">{hudData.fluct}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-cyan-400 uppercase tracking-wider">Sky Coord:</span>
                  <span className="text-white font-mono">{hudData.coord}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-cyan-400 uppercase tracking-wider">Density:</span>
                  <span className="text-white font-mono">Critical (Ω ≈ 1.002)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Observational Evidence Pillars Section */}
      <section id="evidence" className="py-24 border-t border-white/5 bg-black/30 scroll-mt-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-cyan-400 font-heading bg-cyan-400/10 px-4 py-1.5 rounded-full border border-cyan-400/20 shadow-[0_0_15px_rgba(0,242,254,0.1)]">
              OBSERVATIONAL PROOF
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight uppercase">
              The Three Pillars of Evidence
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-[600px] font-light">
              How do we know the Big Bang actually happened? Cosmology rests on three solid, independent observational pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Expansion */}
            <div className="glass-panel border-white/5 p-8 flex flex-col justify-between min-h-[340px] hover:border-cyan-500/20 transition-all duration-300 group hover:-translate-y-1">
              <div className="flex flex-col gap-5">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_10px_rgba(0,242,254,0.1)]">
                  <Expand className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-heading text-white tracking-wide uppercase">
                  1. Expansion of the Universe
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-light">
                  In 1929, Edwin Hubble observed that light from distant galaxies is shifted toward the red end of the spectrum (redshift). This proves that galaxies are moving away from us. Reversing this cosmic expansion points to a single starting point in the past.
                </p>
              </div>
              <div className="text-[11px] font-heading font-bold text-cyan-400 tracking-wider bg-cyan-500/5 px-3 py-1.5 rounded border border-cyan-500/10 self-start mt-6 select-none uppercase">
                Hubble&apos;s Law: v = H₀d
              </div>
            </div>

            {/* Pillar 2: CMB */}
            <div className="glass-panel border-white/5 p-8 flex flex-col justify-between min-h-[340px] hover:border-violet-500/20 transition-all duration-300 group hover:-translate-y-1">
              <div className="flex flex-col gap-5">
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_10px_rgba(127,0,255,0.1)]">
                  <Radio className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-heading text-white tracking-wide uppercase">
                  2. Cosmic Microwave Background
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-light">
                  Predicted in the 1940s and discovered in 1964, the CMB is the relic heat of the baby universe. It consists of the first photons that escaped plasma traps during recombination. No other cosmic theory can explain its perfect blackbody spectrum.
                </p>
              </div>
              <div className="text-[11px] font-heading font-bold text-violet-400 tracking-wider bg-violet-500/5 px-3 py-1.5 rounded border border-violet-500/10 self-start mt-6 select-none uppercase">
                Temperature: 2.725 Kelvin
              </div>
            </div>

            {/* Pillar 3: Elements */}
            <div className="glass-panel border-white/5 p-8 flex flex-col justify-between min-h-[340px] hover:border-pink-500/20 transition-all duration-300 group hover:-translate-y-1">
              <div className="flex flex-col gap-5">
                <div className="w-12 h-12 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_10px_rgba(255,0,127,0.1)]">
                  <Atom className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-heading text-white tracking-wide uppercase">
                  3. Light Element Abundance
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-light">
                  The early hot cosmos acted as a massive fusion reactor. Mathematical nucleosynthesis models calculate the universe should contain 75% Hydrogen, 25% Helium, and trace Lithium. Observational measurements of pristine gas clouds match this model exactly.
                </p>
              </div>
              <div className="text-[11px] font-heading font-bold text-pink-400 tracking-wider bg-pink-500/5 px-3 py-1.5 rounded border border-pink-500/10 self-start mt-6 select-none uppercase">
                Fusing period: First 20 Minutes
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
