import { useEffect, useRef } from 'react';
import { createSeededRng } from '../utils/astronomy';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  phase: number;
  depth: number;
  tint: string;
}

export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rand = createSeededRng(2026);
    const tints = ['#ffffff', '#e0f2fe', '#c7d2fe', '#bae6fd', '#f5f3ff'];

    const stars: Star[] = Array.from({ length: 140 }, () => ({
      x: rand(),
      y: rand(),
      radius: 0.5 + rand() * 1.35,
      alpha: 0.25 + rand() * 0.65,
      twinkleSpeed: 0.6 + rand() * 1.4,
      phase: rand() * Math.PI * 2,
      depth: 0.08 + rand() * 0.25,
      tint: tints[Math.floor(rand() * tints.length)],
    }));

    let width = 0;
    let height = 0;
    let scrollY = window.scrollY;
    let rafId = 0;
    let lastDraw = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (timeMs: number) => {
      ctx.clearRect(0, 0, width, height);
      const t = timeMs * 0.001;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const parallaxOffset = (scrollY * s.depth) % height;
        let py = s.y * height - parallaxOffset;
        if (py < 0) py += height;

        const twinkle = prefersReducedMotion
          ? 1
          : 0.65 + 0.35 * Math.sin(t * s.twinkleSpeed + s.phase);

        ctx.globalAlpha = s.alpha * twinkle;
        ctx.fillStyle = s.tint;
        ctx.beginPath();
        ctx.arc(s.x * width, py, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
      if (prefersReducedMotion) {
        draw(0);
      }
    };

    resize();
    draw(0);

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    if (!prefersReducedMotion) {
      const loop = (now: number) => {
        if (now - lastDraw >= 85) {
          lastDraw = now;
          draw(now);
        }
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-85"
    />
  );
}
