"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Mic, MicOff } from "lucide-react";

interface CosmicParticleType {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  color: string;
}

interface DustParticle {
  radius: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
  active: boolean;
}

interface PlanetType {
  name: string;
  r: number;
  angle: number;
  speed: number;
  size: number;
  baseSize: number;
  color: string;
  dustEaten: number;
  rings?: boolean;
  history: { x: number; y: number }[];
}

interface Firefly {
  x: number;
  y: number;
  speedY: number;
  radius: number;
  angle: number;
  pulseSpeed: number;
}

export default function Simulator() {
  // Simulator State
  const [isRunning, setIsRunning] = useState(false);
  const [cosmicTime, setCosmicTime] = useState(0);
  const [darkEnergy, setDarkEnergy] = useState(1.1);
  const [gravity, setGravity] = useState(1.2);
  const [maxParticles, setMaxParticles] = useState(150);
  const [simSpeed, setSimSpeed] = useState(1.0);
  const [hudState, setHudState] = useState("Idle");
  const [hudDensity, setHudDensity] = useState("0%");
  
  // Audio state hooks
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState("auto");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // DOM Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const worldMapImgRef = useRef<HTMLImageElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const spokenPhasesRef = useRef({ phase1: false, phase2: false, phase3: false, phase4: false });

  // Physics Data Refs
  const cosmicWebParticlesRef = useRef<CosmicParticleType[]>([]);
  const accretionDustRef = useRef<DustParticle[]>([]);
  const planetsRef = useRef<PlanetType[]>([]);
  const firefliesRef = useRef<Firefly[]>([]);
  const moonAngleRef = useRef(0);
  const earthRotationRef = useRef(0);

  // Audio nodes Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthVolumeRef = useRef<GainNode | null>(null);
  const ambientOsc1Ref = useRef<OscillatorNode | null>(null);
  const ambientOsc2Ref = useRef<OscillatorNode | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Preload Earth Map
  useEffect(() => {
    const img = new Image();
    img.src = "/images/world_map.jpg";
    worldMapImgRef.current = img;
  }, []);

  // Populate Speech Synthesis Voices
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.speechSynthesis === "undefined") return;

    const populateVoices = () => {
      const voicesList = window.speechSynthesis.getVoices();
      setAvailableVoices(voicesList);
    };

    populateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoices;
    }
  }, []);

  // Audio system implementations
  const initAudio = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0, ctx.currentTime);
      gain.connect(ctx.destination);
      synthVolumeRef.current = gain;

      // Start background hum
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();

      osc1.type = "sawtooth";
      osc2.type = "sine";

      osc1.frequency.setValueAtTime(55, ctx.currentTime);
      osc2.frequency.setValueAtTime(55.3, ctx.currentTime);

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(90, ctx.currentTime);

      osc1.connect(lowpass);
      osc2.connect(lowpass);
      lowpass.connect(gain);

      osc1.start();
      osc2.start();

      ambientOsc1Ref.current = osc1;
      ambientOsc2Ref.current = osc2;
    } catch (err) {
      console.warn("Failed to initialize Web Audio API:", err);
    }
  };

  const playBoom = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || !isSoundEnabled) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(15, ctx.currentTime + 2.0);

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(140, ctx.currentTime);
    lp.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.8);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);

    osc.connect(lp);
    lp.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 2.3);
  };

  const playPing = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || !isSoundEnabled) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  };

  const playSwoosh = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || !isSoundEnabled) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.55);
  };

  const playAmbient = () => {
    const ctx = audioCtxRef.current;
    const volume = synthVolumeRef.current;
    if (!ctx || !volume) return;
    if (isSoundEnabled) {
      volume.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.5);
    } else {
      volume.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.5);
    }
  };

  const speakExplanation = (text: string) => {
    if (!isVoiceEnabled || typeof window === "undefined" || typeof window.speechSynthesis === "undefined") return;
    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtteranceRef.current = utterance;

    const voices = window.speechSynthesis.getVoices();
    let voiceToUse = null;

    if (selectedVoice !== "auto") {
      voiceToUse = voices.find((v) => v.name === selectedVoice) || null;
    }

    if (!voiceToUse) {
      // Find the best Indian voice
      voiceToUse = voices.find(isIndianVoice) || null;
    }

    if (!voiceToUse) {
      // Fallback 1: Google US English
      voiceToUse = voices.find((v) => v.name.includes("Google US English") || v.name.includes("Natural") || v.lang === "en-US") || null;
    }

    if (!voiceToUse && voices.length > 0) {
      // Fallback 2: Any English voice
      voiceToUse = voices.find((v) => v.lang.startsWith("en")) || null;
    }

    if (voiceToUse) {
      utterance.voice = voiceToUse;
      console.log(`Speech Synthesis using Voice: ${voiceToUse.name} (${voiceToUse.lang})`);
    }

    utterance.rate = 0.88;
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (typeof window !== "undefined" && typeof window.speechSynthesis !== "undefined") {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    }
  };

  // Helper matching Indian English accents
  const isIndianVoice = (v: SpeechSynthesisVoice) =>
    v.lang === "en-IN" ||
    v.lang === "en_IN" ||
    v.name.toLowerCase().includes("india") ||
    v.name.toLowerCase().includes("indian") ||
    v.name.toLowerCase().includes("heera") ||
    v.name.toLowerCase().includes("veena") ||
    v.name.toLowerCase().includes("rishi") ||
    v.name.toLowerCase().includes("priya") ||
    v.name.toLowerCase().includes("neerja") ||
    v.name.toLowerCase().includes("ravi");

  // React audio hooks bindings
  useEffect(() => {
    playAmbient();
  }, [isSoundEnabled]);

  useEffect(() => {
    if (!isVoiceEnabled) {
      stopSpeech();
    }
  }, [isVoiceEnabled]);

  useEffect(() => {
    return () => {
      stopSpeech();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Resize canvas handler
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.parentElement?.getBoundingClientRect();
    if (!bounds) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = bounds.width * dpr;
    canvas.height = bounds.width * 0.75 * dpr;
    canvas.style.width = `${bounds.width}px`;
    canvas.style.height = `${bounds.width * 0.75}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.restore();
      ctx.save();
      ctx.scale(dpr, dpr);
    }
  };

  // --- PHYSICS SETUP LOOPS ---
  const setupCosmicWeb = (canvasWidth: number, canvasHeight: number) => {
    const particles: CosmicParticleType[] = [];
    const colors = [
      "rgba(0, 242, 254, 0.75)",
      "rgba(127, 0, 255, 0.75)",
      "rgba(255, 0, 127, 0.75)",
      "rgba(79, 172, 254, 0.75)",
      "rgba(255, 255, 255, 0.85)",
    ];

    for (let i = 0; i < maxParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 4 + 1.2;
      particles.push({
        x: canvasWidth / 2,
        y: canvasHeight / 2,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        mass: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    cosmicWebParticlesRef.current = particles;
  };

  const setupSolarSystem = (canvasWidth: number, canvasHeight: number) => {
    const dust: DustParticle[] = [];
    for (let i = 0; i < maxParticles; i++) {
      const r = 45 + Math.random() * 230;
      const angle = Math.random() * Math.PI * 2;
      dust.push({
        radius: r,
        angle: angle,
        speed: (0.02 / Math.sqrt(r)) * (Math.random() * 0.3 + 0.85) * (gravity * 0.8),
        size: Math.random() * 1.5 + 0.5,
        color: Math.random() > 0.4 ? "rgba(166, 162, 191, 0.45)" : "rgba(216, 202, 157, 0.4)",
        active: true,
      });
    }
    accretionDustRef.current = dust;

    planetsRef.current = [
      { name: "Mercury", r: 50, angle: Math.random() * Math.PI * 2, speed: 0.035, size: 3, baseSize: 3, color: "#888888", dustEaten: 0, history: [] },
      { name: "Venus", r: 75, angle: Math.random() * Math.PI * 2, speed: 0.026, size: 5, baseSize: 5, color: "#dfb06c", dustEaten: 0, history: [] },
      { name: "Earth", r: 105, angle: Math.random() * Math.PI * 2, speed: 0.02, size: 5.5, baseSize: 5.5, color: "#2b82c9", dustEaten: 0, history: [] },
      { name: "Mars", r: 135, angle: Math.random() * Math.PI * 2, speed: 0.016, size: 4, baseSize: 4, color: "#c1440e", dustEaten: 0, history: [] },
      { name: "Jupiter", r: 175, angle: Math.random() * Math.PI * 2, speed: 0.01, size: 11, baseSize: 11, color: "#d3c299", dustEaten: 0, history: [] },
      { name: "Saturn", r: 215, angle: Math.random() * Math.PI * 2, speed: 0.007, size: 9, baseSize: 9, color: "#ebd09e", dustEaten: 0, rings: true, history: [] },
      { name: "Uranus", r: 250, angle: Math.random() * Math.PI * 2, speed: 0.005, size: 6.5, baseSize: 6.5, color: "#9bc8c8", dustEaten: 0, history: [] },
      { name: "Neptune", r: 280, angle: Math.random() * Math.PI * 2, speed: 0.004, size: 6, baseSize: 6, color: "#274687", dustEaten: 0, history: [] },
    ];
  };

  const setupBiosphere = (canvasWidth: number, canvasHeight: number) => {
    const bugs: Firefly[] = [];
    for (let i = 0; i < 40; i++) {
      bugs.push({
        x: Math.random() * canvasWidth,
        y: canvasHeight - 30 - Math.random() * 150,
        speedY: Math.random() * 0.4 + 0.1,
        radius: Math.random() * 1.5 + 0.5,
        angle: Math.random() * Math.PI,
        pulseSpeed: Math.random() * 0.05 + 0.02,
      });
    }
    firefliesRef.current = bugs;
  };

  // --- DRAW LOOPS ---
  const drawCosmicWeb = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const particles = cosmicWebParticlesRef.current;

    // N-body gravity attraction
    if (gravity > 0.05) {
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distanceSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distanceSq);
          if (dist < 100 && dist > 4) {
            const force = (gravity * 0.03 * p1.mass * p2.mass) / (distanceSq + 20);
            p1.vx += (dx / dist) * force;
            p1.vy += (dy / dist) * force;
            p2.vx -= (dx / dist) * force;
            p2.vy -= (dy / dist) * force;
          }
        }
      }
    }

    // Draw filaments
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        if (dist < 40) {
          ctx.strokeStyle = `rgba(0, 242, 254, ${0.04 * (1 - dist / 40)})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Update particle position
      p1.x += p1.vx;
      p1.y += p1.vy;
      const dx = p1.x - width / 2;
      const dy = p1.y - height / 2;
      p1.x += dx * (darkEnergy * 0.0035);
      p1.y += dy * (darkEnergy * 0.0035);
      p1.vx *= 0.985;
      p1.vy *= 0.985;

      // Draw particle body
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, p1.mass * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = p1.color;
      ctx.fill();
    }

    // Calculate clumping
    let clustered = 0;
    particles.forEach((p) => {
      let neighborCount = 0;
      particles.forEach((other) => {
        if (p === other) return;
        if (Math.hypot(p.x - other.x, p.y - other.y) < 25) neighborCount++;
      });
      if (neighborCount >= 3) clustered++;
    });

    const pct = (clustered / particles.length) * 100;
    setHudDensity(`Cluster Formation: ${pct.toFixed(0)}%`);
    setHudState("Cosmic Filament Expansion");
  };

  const drawSolarSystem = (ctx: CanvasRenderingContext2D, width: number, height: number, timeVal: number) => {
    const cx = width / 2;
    const cy = height / 2;

    // Draw Sun
    const sunGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 25);
    sunGlow.addColorStop(0, "#ffffff");
    sunGlow.addColorStop(0.3, "#ffea4a");
    sunGlow.addColorStop(0.8, "rgba(255, 90, 0, 0.4)");
    sunGlow.addColorStop(1, "rgba(255, 90, 0, 0)");
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, 25, 0, Math.PI * 2);
    ctx.fill();

    // Draw Orbit paths
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    planetsRef.current.forEach((p) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, p.r, p.r * 0.75, 0, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Draw and eat protoplanetary dust
    let activeDustCount = 0;
    accretionDustRef.current.forEach((dust) => {
      if (!dust.active) return;
      activeDustCount++;

      dust.angle += dust.speed * simSpeed;
      const x = cx + Math.cos(dust.angle) * dust.radius;
      const y = cy + Math.sin(dust.angle) * dust.radius * 0.75;

      ctx.fillStyle = dust.color;
      ctx.beginPath();
      ctx.arc(x, y, dust.size, 0, Math.PI * 2);
      ctx.fill();

      // Accretion sweeping logic
      planetsRef.current.forEach((p) => {
        const px = cx + Math.cos(p.angle) * p.r;
        const py = cy + Math.sin(p.angle) * p.r * 0.75;
        if (Math.hypot(x - px, y - py) < p.size + 4) {
          dust.active = false;
          p.dustEaten++;
          playPing();
          p.size = p.baseSize + Math.min(p.dustEaten * 0.08, 6);
        }
      });
    });

    // Update and draw planets
    planetsRef.current.forEach((p) => {
      p.angle += p.speed * (gravity * 0.8) * simSpeed;
      const px = cx + Math.cos(p.angle) * p.r;
      const py = cy + Math.sin(p.angle) * p.r * 0.75;

      p.history.push({ x: px, y: py });
      if (p.history.length > 20) p.history.shift();

      // Fading trail path
      if (p.history.length > 1) {
        ctx.beginPath();
        p.history.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.strokeStyle = p.color + "44";
        ctx.lineWidth = p.size / 3.5;
        ctx.stroke();
      }

      // Rings for Saturn
      if (p.rings) {
        ctx.strokeStyle = "rgba(195, 172, 129, 0.4)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(px, py, p.size * 1.8, p.size * 0.6, Math.PI / 12, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Planet body
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Label text
      ctx.save();
      ctx.fillStyle = p.name === "Earth" ? "#00f2fe" : "#ffffff";
      ctx.font = "bold 10px var(--font-space-grotesk)";
      ctx.textAlign = "center";
      ctx.fillText(p.name, px, py - p.size - 6);

      // Orbital moon during accretion
      if (p.name === "Earth") {
        const mx = px + Math.cos(timeVal * 8) * (p.size + 6);
        const my = py + Math.sin(timeVal * 8) * (p.size + 6) * 0.6;
        ctx.fillStyle = "#a1a1a1";
        ctx.beginPath();
        ctx.arc(mx, my, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    const sweepProgress = ((maxParticles - activeDustCount) / maxParticles) * 100;
    setHudDensity(`Accretion Swept: ${sweepProgress.toFixed(0)}%`);
    setHudState("Accretion Disk Orbiting Sun");
  };

  const drawSphericalMap = (ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, cx: number, cy: number, r: number, rotation: number) => {
    if (!img || !img.complete) {
      ctx.fillStyle = "#0f4d8c";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = "#093a6d";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    const N = 50; // Slices
    const sw = img.width / N;

    for (let i = 0; i < N; i++) {
      const theta = -Math.PI / 2 + (i / N) * Math.PI;
      const dx = r * Math.sin(theta);
      const dw = r * Math.cos(theta) * (Math.PI / N) * 1.05;

      const lon = (theta - rotation) % (2 * Math.PI);
      let sx = ((lon + Math.PI) / (2 * Math.PI)) * img.width;
      sx = ((sx % img.width) + img.width) % img.width;

      if (sx + sw > img.width) {
        const w1 = img.width - sx;
        const w2 = sw - w1;
        const dw1 = dw * (w1 / sw);
        const dw2 = dw * (w2 / sw);

        ctx.drawImage(img, sx, 0, w1, img.height, cx + dx - dw / 2, cy - r, dw1, r * 2);
        ctx.drawImage(img, 0, 0, w2, img.height, cx + dx - dw / 2 + dw1, cy - r, dw2, r * 2);
      } else {
        ctx.drawImage(img, sx, 0, sw, img.height, cx + dx - dw / 2, cy - r, dw, r * 2);
      }
    }
    ctx.restore();
  };

  const drawEarthMoon = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cx = width / 2;
    const cy = height / 2;
    const r = 85;

    moonAngleRef.current += 0.025 * simSpeed;
    earthRotationRef.current += 0.08 * simSpeed;

    const moonX = cx + Math.cos(moonAngleRef.current) * 200;
    const moonY = cy + Math.sin(moonAngleRef.current) * 55;
    const moonIsBehind = Math.sin(moonAngleRef.current) < 0;

    // Draw Orbit track
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 200, 55, 0, 0, Math.PI * 2);
    ctx.stroke();

    const drawMoon = () => {
      ctx.save();
      ctx.fillStyle = "#a8a5a5";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(255,255,255,0.1)";
      ctx.beginPath();
      ctx.arc(moonX, moonY, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.beginPath();
      ctx.arc(moonX + 4, moonY, 18, -Math.PI / 2, Math.PI / 2);
      ctx.fill();
      ctx.restore();
    };

    if (moonIsBehind) drawMoon();

    // Atmosphere halo
    const atmosGlow = ctx.createRadialGradient(cx, cy, r, cx, cy, r + 15);
    atmosGlow.addColorStop(0, "rgba(0, 242, 254, 0.35)");
    atmosGlow.addColorStop(0.5, "rgba(0, 127, 255, 0.15)");
    atmosGlow.addColorStop(1, "rgba(0, 0, 255, 0)");
    ctx.fillStyle = atmosGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 15, 0, Math.PI * 2);
    ctx.fill();

    // Earth Sphere
    drawSphericalMap(ctx, worldMapImgRef.current, cx, cy, r, earthRotationRef.current);

    // Day/Night shadow filter
    const shadowGrad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
    shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
    shadowGrad.addColorStop(0.3, "rgba(0, 0, 0, 0.05)");
    shadowGrad.addColorStop(0.7, "rgba(0, 0, 0, 0.7)");
    shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0.95)");
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 1, 0, Math.PI * 2);
    ctx.fill();

    // Blue atmospheric rim stroke
    ctx.strokeStyle = "rgba(0, 242, 254, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    if (!moonIsBehind) drawMoon();

    setHudDensity("Atmosphere: Stable (1.0 atm)");
    setHudState("Active Earth & Moon Orbit");
  };

  const drawBiosphere = (ctx: CanvasRenderingContext2D, width: number, height: number, timeVal: number) => {
    // Background gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, "#020005");
    skyGrad.addColorStop(0.4, "#080518");
    skyGrad.addColorStop(0.85, "#190a2a");
    skyGrad.addColorStop(1, "#0e0413");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Cosmic Milky Way cloud
    const mwGrad = ctx.createRadialGradient(width / 2, height - 20, 10, width / 2, height - 20, height);
    mwGrad.addColorStop(0, "rgba(127, 0, 255, 0.15)");
    mwGrad.addColorStop(0.3, "rgba(0, 242, 254, 0.08)");
    mwGrad.addColorStop(0.6, "rgba(255, 0, 127, 0.03)");
    mwGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = mwGrad;
    ctx.fillRect(0, 0, width, height);

    // Stars twinkling
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 80; i++) {
      const starX = (Math.sin(i * 99) * 0.5 + 0.5) * width;
      const starY = (Math.cos(i * 77) * 0.5 + 0.5) * (height - 100);
      const size = (Math.sin(timeVal * 2 + i) * 0.5 + 0.5) * 1.2;
      ctx.fillRect(starX, starY, size, size);
    }

    // Fireflies rising
    firefliesRef.current.forEach((f) => {
      f.y -= f.speedY * simSpeed;
      f.angle += f.pulseSpeed * simSpeed;
      f.x += Math.sin(f.angle) * 0.3;

      if (f.y < height - 220) {
        f.y = height - 20;
        f.x = Math.random() * width;
      }

      const opacity = Math.abs(Math.sin(f.angle)) * 0.8;
      ctx.save();
      ctx.fillStyle = `rgba(0, 242, 254, ${opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#00f2fe";
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Landscapes
    ctx.fillStyle = "#030206";
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.quadraticCurveTo(width * 0.35, height - 65, width * 0.7, height - 35);
    ctx.quadraticCurveTo(width * 0.88, height - 20, width, height - 45);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.fill();

    // Tree silhouette
    ctx.beginPath();
    ctx.moveTo(width - 60, height - 30);
    ctx.quadraticCurveTo(width - 75, height - 90, width - 85, height - 140);
    ctx.quadraticCurveTo(width - 80, height - 145, width - 70, height - 140);
    ctx.quadraticCurveTo(width - 55, height - 90, width - 40, height - 30);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(width - 95, height - 150, 35, 0, Math.PI * 2);
    ctx.arc(width - 75, height - 180, 45, 0, Math.PI * 2);
    ctx.arc(width - 50, height - 155, 30, 0, Math.PI * 2);
    ctx.fill();

    // Observers silhouettes
    const hx = width * 0.32;
    const hy = height - 55;

    // Person sitting
    ctx.fillStyle = "#030206";
    ctx.beginPath();
    ctx.arc(hx, hy, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#030206";
    ctx.beginPath();
    ctx.moveTo(hx, hy + 5);
    ctx.lineTo(hx - 2, hy + 22);
    ctx.moveTo(hx - 2, hy + 22);
    ctx.lineTo(hx + 12, hy + 24);
    ctx.stroke();

    // Person standing
    const hx2 = hx + 25;
    const hy2 = height - 60;
    ctx.beginPath();
    ctx.arc(hx2, hy2, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(hx2, hy2 + 5);
    ctx.lineTo(hx2 + 1, hy2 + 25);
    ctx.moveTo(hx2 + 1, hy2 + 25);
    ctx.lineTo(hx2 - 2, hy2 + 45);
    ctx.moveTo(hx2 + 1, hy2 + 25);
    ctx.lineTo(hx2 + 5, hy2 + 45);
    ctx.moveTo(hx2, hy2 + 9);
    ctx.lineTo(hx2 - 12, hy2 - 4);
    ctx.stroke();

    // Telescope
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(hx - 12, hy + 18);
    ctx.lineTo(hx - 18, hy + 32);
    ctx.moveTo(hx - 12, hy + 18);
    ctx.lineTo(hx - 8, hy + 32);
    ctx.lineWidth = 4;
    ctx.moveTo(hx - 18, hy + 10);
    ctx.lineTo(hx - 6, hy + 20);
    ctx.stroke();

    // Carl Sagan Quote Fading
    let textOpacity = 0;
    if (timeVal > 13.0) {
      textOpacity = Math.min((timeVal - 13.0) / 0.6, 1);
    }
    ctx.fillStyle = `rgba(255, 255, 255, ${textOpacity})`;
    ctx.font = "italic 600 14px var(--font-space-grotesk)";
    ctx.textAlign = "center";
    ctx.fillText('"We are made of starstuff. We are a way for the cosmos to know itself."', width / 2, 55);
    ctx.font = "600 12px var(--font-space-grotesk)";
    ctx.fillStyle = `rgba(0, 242, 254, ${textOpacity})`;
    ctx.fillText("— Carl Sagan", width / 2, 80);

    setHudDensity("Observation Phase: Active");
    setHudState("Humanity Observing Universe");
  };

  // --- CORE ANIMATION LOOP ---
  const runLoop = (timeVal: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // Smear or clear canvas depending on phase
    if (timeVal < 6.5) {
      ctx.fillStyle = "rgba(2, 1, 4, 0.22)";
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = "#020104";
      ctx.fillRect(0, 0, width, height);
    }

    // Phase multiplexer
    if (timeVal < 6.5) {
      if (!spokenPhasesRef.current.phase1) {
        speakExplanation("The Big Bang. Thirteen point eight billion years ago, space and time erupted from a singularity. Energy expanded rapidly, cooling to form the first atoms and the grand cosmic web filaments.");
        spokenPhasesRef.current.phase1 = true;
      }
      drawCosmicWeb(ctx, width, height);
    } else if (timeVal >= 6.5 && timeVal < 10.0) {
      if (!spokenPhasesRef.current.phase2) {
        playSwoosh();
        speakExplanation("Eight billion years later, a stellar nebula collapsed to form our Sun. Protoplanetary dust spun in Keplerian orbits, accreting to build the eight planets of our Solar System.");
        spokenPhasesRef.current.phase2 = true;
      }
      drawSolarSystem(ctx, width, height, timeVal);
    } else if (timeVal >= 10.0 && timeVal < 12.8) {
      if (!spokenPhasesRef.current.phase3) {
        playSwoosh();
        speakExplanation("Deep in the habitable zone, planet Earth cooled, forming blue oceans and a stable atmosphere. The Moon locked into orbit, stabilizing the tilt of our world.");
        spokenPhasesRef.current.phase3 = true;
      }
      drawEarthMoon(ctx, width, height);
    } else {
      if (!spokenPhasesRef.current.phase4) {
        playSwoosh();
        speakExplanation("Present day. In a tiny corner of the cosmos, life flourished. Humanity arose, looking back up at the stars. As Carl Sagan said, we are a way for the cosmos to know itself.");
        spokenPhasesRef.current.phase4 = true;
      }
      drawBiosphere(ctx, width, height, timeVal);
    }

    // Cinematic flashes
    let flashOpacity = 0;
    if (timeVal > 6.4 && timeVal < 6.7) {
      flashOpacity = 1 - Math.abs(timeVal - 6.55) / 0.15;
    } else if (timeVal > 9.9 && timeVal < 10.2) {
      flashOpacity = 1 - Math.abs(timeVal - 10.05) / 0.15;
    } else if (timeVal > 12.7 && timeVal < 12.95) {
      flashOpacity = 1 - Math.abs(timeVal - 12.82) / 0.12;
    }

    if (flashOpacity > 0.01) {
      ctx.fillStyle = `rgba(255, 255, 255, ${flashOpacity * 0.9})`;
      ctx.fillRect(0, 0, width, height);
    }

    // Tick clock
    let nextTime = timeVal + 0.025 * simSpeed;
    if (nextTime > 13.8) {
      nextTime = 13.8;
      setCosmicTime(13.8);
      drawBiosphere(ctx, width, height, 13.8);
      animationFrameIdRef.current = requestAnimationFrame(() => runLoop(13.8));
      return;
    }

    setCosmicTime(nextTime);
    animationFrameIdRef.current = requestAnimationFrame(() => runLoop(nextTime));
  };

  const startSimulation = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    
    setIsRunning(true);
    resizeCanvas();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // Run set-up
    setupCosmicWeb(width, height);
    setupSolarSystem(width, height);
    setupBiosphere(width, height);

    moonAngleRef.current = 0;
    earthRotationRef.current = 0;
    spokenPhasesRef.current = { phase1: false, phase2: false, phase3: false, phase4: false };

    // Initial setups
    initAudio();
    playBoom();
    playAmbient();
    stopSpeech();

    // Initial Flash
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }

    runLoop(0);
  };

  const handleRestart = () => {
    startSimulation();
  };

  const applyPreset = (mode: "crunch" | "freeze" | "balanced") => {
    if (mode === "crunch") {
      setDarkEnergy(0.2);
      setGravity(2.8);
    } else if (mode === "freeze") {
      setDarkEnergy(2.8);
      setGravity(0.2);
    } else {
      setDarkEnergy(1.1);
      setGravity(1.2);
    }
    // Simulation restarts with new parameters
    setTimeout(startSimulation, 50);
  };

  // Canvas context resize listener
  useEffect(() => {
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [maxParticles, darkEnergy, gravity]);

  return (
    <section id="sandbox" className="py-24 max-w-[1200px] mx-auto px-6 scroll-mt-12">
      <div className="text-center flex flex-col items-center gap-4 mb-16">
        <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-cyan-400 font-heading bg-cyan-400/10 px-4 py-1.5 rounded-full border border-cyan-400/20 shadow-[0_0_15px_rgba(0,242,254,0.1)]">
          PHYSICS SANDBOX
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight uppercase">
          Cosmological Simulator
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 max-w-[600px] font-light">
          Manipulate fundamental physical forces of gravity and dark energy to observe how they influence cosmic expansion and orbital planetary accretion.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Canvas Area */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#020104]">
            
            {/* STUB: Floating Sound & Audio Accent Controls Overlay */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <button
                onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-heading text-xs font-semibold backdrop-blur-md transition-all cursor-pointer ${
                  isSoundEnabled
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_10px_rgba(0,242,254,0.1)]"
                    : "bg-black/60 border-white/10 text-neutral-400 hover:text-white"
                }`}
              >
                {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                {isSoundEnabled ? "Ambient On" : "Ambient Off"}
              </button>
              
              <button
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-heading text-xs font-semibold backdrop-blur-md transition-all cursor-pointer ${
                  isVoiceEnabled
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_10px_rgba(0,242,254,0.1)]"
                    : "bg-black/60 border-white/10 text-neutral-400 hover:text-white"
                }`}
              >
                {isVoiceEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                {isVoiceEnabled ? "Narration On" : "Narration Off"}
              </button>

              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="voice-select bg-black/60 border border-white/10 text-neutral-400 hover:text-white rounded-lg text-xs font-heading font-semibold py-1 px-2.5 backdrop-blur-md focus:outline-none cursor-pointer"
              >
                <option value="auto">Accent: Indian (Auto) 🇮🇳</option>
                {(() => {
                  const englishVoices = availableVoices.filter((v) => v.lang.startsWith("en") || isIndianVoice(v));
                  const sortedVoices = [...englishVoices].sort((a, b) => {
                    const aInd = isIndianVoice(a);
                    const bInd = isIndianVoice(b);
                    if (aInd && !bInd) return -1;
                    if (!aInd && bInd) return 1;
                    return a.name.localeCompare(b.name);
                  });
                  return sortedVoices.map((voice) => {
                    const isInd = isIndianVoice(voice);
                    return (
                      <option key={voice.name} value={voice.name} className="bg-[#0b071e] text-white">
                        {voice.name.replace(/Microsoft |Google |Apple /g, "")} ({voice.lang}){isInd ? " 🇮🇳" : ""}
                      </option>
                    );
                  });
                })()}
              </select>
            </div>

            {/* Canvas */}
            <canvas ref={canvasRef} id="sandbox-canvas" className="block w-full h-auto aspect-[1.333]"></canvas>

            {/* Overlay cover when simulation is idle */}
            {!isRunning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/85 backdrop-blur-sm transition-opacity duration-500">
                <Play
                  onClick={startSimulation}
                  className="w-16 h-16 text-cyan-400 hover:text-cyan-300 transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer drop-shadow-[0_0_10px_rgba(0,242,254,0.3)] mb-4"
                />
                <h3 className="text-xl font-bold font-heading text-white tracking-wide uppercase">
                  Cosmic Simulator
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-[380px] font-light mt-2 leading-relaxed">
                  Click to trigger the Big Bang explosion and simulate gravity clumping and planet accretion.
                </p>
                <button
                  onClick={startSimulation}
                  className="mt-6 px-6 py-2.5 rounded-lg bg-cyan-500 text-black font-heading font-bold text-xs hover:bg-cyan-400 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,242,254,0.2)]"
                >
                  Trigger Big Bang
                </button>
              </div>
            )}

            {/* HUD Status Bar footer */}
            <div className="absolute bottom-0 left-0 w-full px-6 py-3 border-t border-white/5 bg-[#04020a]/80 backdrop-blur-md flex flex-wrap gap-4 items-center justify-between text-[11px] font-heading font-semibold text-neutral-300">
              <span className="text-cyan-400 uppercase tracking-wider">{hudState}</span>
              <span className="text-white font-mono uppercase tracking-wider">
                Cosmic Time: {cosmicTime === 13.8 ? "13.8B yrs (Present)" : `${cosmicTime.toFixed(2)}B yrs`}
              </span>
              <span className="text-neutral-400 uppercase tracking-wider">{hudDensity}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Simulation Tuning Panels */}
        <div className="lg:col-span-4 glass-panel border-white/5 p-8 flex flex-col justify-between">
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold font-heading text-white uppercase tracking-wider border-b border-white/5 pb-3">
              Tuning Parameters
            </h3>

            {/* Dark Energy Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-neutral-400">Dark Energy (Expansion):</span>
                <span className="text-cyan-400 font-heading">{darkEnergy.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={darkEnergy}
                onChange={(e) => setDarkEnergy(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-neutral-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            {/* Gravity Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-neutral-400">Gravity (Filament clumping):</span>
                <span className="text-cyan-400 font-heading">{gravity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={gravity}
                onChange={(e) => setGravity(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-neutral-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            {/* Particles Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-neutral-400">Matter Particles:</span>
                <span className="text-cyan-400 font-heading">{maxParticles}</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={maxParticles}
                onChange={(e) => setMaxParticles(parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-neutral-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            {/* Cosmic speed Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-neutral-400">Simulation Speed:</span>
                <span className="text-cyan-400 font-heading">{simSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={simSpeed}
                onChange={(e) => setSimSpeed(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-neutral-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>
          </div>

          {/* Quick Presets & Restarts */}
          <div className="flex flex-col gap-4 mt-8">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
              Scenario Presets:
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => applyPreset("crunch")}
                className="px-2.5 py-2 rounded-lg border border-white/5 bg-white/5 text-[10px] sm:text-xs font-heading font-bold text-neutral-300 hover:text-white hover:border-white/15 hover:bg-white/10 cursor-pointer"
              >
                Big Crunch
              </button>
              <button
                onClick={() => applyPreset("freeze")}
                className="px-2.5 py-2 rounded-lg border border-white/5 bg-white/5 text-[10px] sm:text-xs font-heading font-bold text-neutral-300 hover:text-white hover:border-white/15 hover:bg-white/10 cursor-pointer"
              >
                Big Freeze
              </button>
              <button
                onClick={() => applyPreset("balanced")}
                className="px-2.5 py-2 rounded-lg border border-white/5 bg-white/5 text-[10px] sm:text-xs font-heading font-bold text-neutral-300 hover:text-white hover:border-white/15 hover:bg-white/10 cursor-pointer"
              >
                Balanced
              </button>
            </div>

            <button
              onClick={handleRestart}
              className="mt-2 w-full py-3 rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all font-heading font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_10px_rgba(0,242,254,0.05)]"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart Simulation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
