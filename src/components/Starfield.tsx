"use client";

import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: number;
  direction: number;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    const starCount = 150;

    const getRandomStarColor = () => {
      const colors = [
        "rgba(255, 255, 255, 0.8)",
        "rgba(255, 255, 255, 0.6)",
        "rgba(173, 216, 230, 0.8)", // pale blue
        "rgba(255, 240, 245, 0.8)", // pale lavender
        "rgba(255, 228, 196, 0.7)", // pale yellow
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const createStars = (width: number, height: number) => {
      const newStars: Star[] = [];
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.5,
          color: getRandomStarColor(),
          velocity: Math.random() * 0.05 + 0.01,
          direction: Math.random() * Math.PI * 2,
        });
      }
      stars = newStars;
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createStars(canvas.width, canvas.height);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();

        star.x += Math.cos(star.direction) * star.velocity;
        star.y += Math.sin(star.direction) * star.velocity;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen z-[-2] pointer-events-none bg-[#04020a]"
    />
  );
}
