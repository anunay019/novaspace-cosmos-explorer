import { useEffect, useRef } from 'react';
import type { PlanetData } from '../data/spaceData';
import { createSeededRng } from '../utils/astronomy';

interface PlanetVisualProps {
  planet: PlanetData;
  size?: number;
  rotate?: boolean;
  className?: string;
}

export function PlanetVisual({
  planet,
  size = 156,
  rotate = false,
  className = '',
}: PlanetVisualProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cx = size / 2;
    const cy = size / 2;
    const radius = planet.visual.hasRings ? size * 0.27 : size * 0.37;
    const seed = planet.order * 137;

    let rafId = 0;
    let phase = 0;
    let lastTick = 0;

    const drawRingHalf = (backHalf: boolean) => {
      if (!planet.visual.hasRings) return;
      ctx.save();
      ctx.translate(cx, cy);
      const tiltRad = planet.id === 'uranus' ? 1.2 : 0.38;
      ctx.rotate(planet.id === 'uranus' ? 1.25 : -0.32);

      const outerRx = radius * 2.15;
      const outerRy = radius * 2.15 * Math.sin(tiltRad);
      const innerRx = radius * 1.32;
      const innerRy = radius * 1.32 * Math.sin(tiltRad);

      ctx.beginPath();
      if (backHalf) {
        ctx.ellipse(0, 0, outerRx, outerRy, 0, Math.PI, Math.PI * 2);
        ctx.ellipse(0, 0, innerRx, innerRy, 0, Math.PI * 2, Math.PI, true);
      } else {
        ctx.ellipse(0, 0, outerRx, outerRy, 0, 0, Math.PI);
        ctx.ellipse(0, 0, innerRx, innerRy, 0, Math.PI, 0, true);
      }
      ctx.closePath();

      const ringGrad = ctx.createRadialGradient(0, 0, innerRx, 0, 0, outerRx);
      if (planet.id === 'saturn') {
        ringGrad.addColorStop(0, 'rgba(214, 190, 147, 0.15)');
        ringGrad.addColorStop(0.25, 'rgba(229, 212, 179, 0.72)');
        ringGrad.addColorStop(0.55, 'rgba(180, 152, 108, 0.48)');
        ringGrad.addColorStop(0.65, 'rgba(20, 20, 30, 0.15)'); // Cassini division
        ringGrad.addColorStop(0.85, 'rgba(235, 220, 190, 0.65)');
        ringGrad.addColorStop(1, 'rgba(214, 190, 147, 0.08)');
      } else {
        ringGrad.addColorStop(0, 'rgba(148, 163, 184, 0.08)');
        ringGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.35)');
        ringGrad.addColorStop(1, 'rgba(148, 163, 184, 0.05)');
      }

      ctx.fillStyle = ringGrad;
      ctx.fill();
      ctx.restore();
    };

    const drawFrame = (spinOffset: number) => {
      ctx.clearRect(0, 0, size, size);

      // Subtle atmospheric outer halo
      const haloGrad = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.45);
      haloGrad.addColorStop(0, `${planet.visual.atmosphereColor}38`);
      haloGrad.addColorStop(1, 'rgba(6, 9, 19, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.45, 0, Math.PI * 2);
      ctx.fill();

      // Back half of planetary rings
      drawRingHalf(true);

      // Clipped sphere rendering
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      // Base sphere gradient
      const baseGrad = ctx.createRadialGradient(
        cx - radius * 0.35,
        cy - radius * 0.35,
        radius * 0.1,
        cx,
        cy,
        radius * 1.15
      );
      baseGrad.addColorStop(0, planet.visual.accentColor);
      baseGrad.addColorStop(0.55, planet.visual.baseColor);
      baseGrad.addColorStop(1, planet.visual.secondaryColor);
      ctx.fillStyle = baseGrad;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      const rand = createSeededRng(seed);
      const { style } = planet.visual;

      if (style === 'jupiter' || style === 'saturn' || style === 'neptune' || style === 'uranus') {
        // Atmospheric zonal bands
        const bandCount = style === 'jupiter' ? 11 : style === 'saturn' ? 8 : 6;
        for (let b = 0; b < bandCount; b++) {
          const yNorm = -0.88 + (b / (bandCount - 1)) * 1.76;
          const by = cy + yNorm * radius;
          const bh = (radius * 2) / (bandCount * 1.4);
          ctx.fillStyle =
            b % 2 === 0 ? `${planet.visual.secondaryColor}55` : `${planet.visual.accentColor}44`;
          ctx.beginPath();
          ctx.ellipse(
            cx + Math.sin(spinOffset + b) * 4,
            by,
            radius * 1.2,
            bh,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        // Great Red Spot on Jupiter
        if (style === 'jupiter') {
          const spotX = cx + Math.sin(spinOffset * 0.8 + 0.5) * radius * 0.45;
          const spotY = cy + radius * 0.26;
          ctx.fillStyle = 'rgba(180, 74, 48, 0.85)';
          ctx.beginPath();
          ctx.ellipse(spotX, spotY, radius * 0.22, radius * 0.13, -0.1, 0, Math.PI * 2);
          ctx.fill();
        }
        // Dark spot on Neptune
        if (style === 'neptune') {
          const spotX = cx + Math.sin(spinOffset * 0.8 + 1.1) * radius * 0.4;
          ctx.fillStyle = 'rgba(15, 23, 82, 0.65)';
          ctx.beginPath();
          ctx.ellipse(spotX, cy + radius * 0.15, radius * 0.18, radius * 0.1, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (style === 'earth') {
        // Stylized continents & polar ice + swirling cloud wisps
        ctx.fillStyle = 'rgba(34, 139, 84, 0.82)';
        for (let c = 0; c < 6; c++) {
          const ang = c * 1.1 + spinOffset;
          const lx = cx + Math.sin(ang) * radius * 0.65;
          const ly = cy + (rand() - 0.5) * radius * 1.1;
          ctx.beginPath();
          ctx.ellipse(lx, ly, radius * (0.22 + rand() * 0.16), radius * (0.14 + rand() * 0.12), rand(), 0, Math.PI * 2);
          ctx.fill();
        }
        // Polar cap
        ctx.fillStyle = 'rgba(241, 245, 249, 0.85)';
        ctx.beginPath();
        ctx.ellipse(cx, cy - radius * 0.92, radius * 0.5, radius * 0.16, 0, 0, Math.PI * 2);
        ctx.fill();
        // Cloud swirls
        ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
        for (let w = 0; w < 8; w++) {
          const ang = w * 0.85 + spinOffset * 1.25;
          const wx = cx + Math.sin(ang) * radius * 0.72;
          const wy = cy + (rand() - 0.5) * radius * 1.3;
          ctx.beginPath();
          ctx.ellipse(wx, wy, radius * 0.32, radius * 0.07, -0.2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (style === 'mars') {
        // Dark basalt regions + polar ice cap
        ctx.fillStyle = 'rgba(92, 30, 14, 0.48)';
        for (let m = 0; m < 5; m++) {
          const ang = m * 1.25 + spinOffset;
          const mx = cx + Math.sin(ang) * radius * 0.6;
          const my = cy + (rand() - 0.5) * radius * 1.1;
          ctx.beginPath();
          ctx.ellipse(mx, my, radius * 0.28, radius * 0.16, rand(), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = 'rgba(248, 250, 252, 0.85)';
        ctx.beginPath();
        ctx.ellipse(cx, cy - radius * 0.94, radius * 0.35, radius * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (style === 'mercury') {
        // Craters
        for (let k = 0; k < 14; k++) {
          const ang = k * 0.75 + spinOffset;
          const kx = cx + Math.sin(ang) * radius * 0.72;
          const ky = cy + (rand() - 0.5) * radius * 1.4;
          const kr = radius * (0.06 + rand() * 0.08);
          ctx.fillStyle = 'rgba(55, 52, 48, 0.45)';
          ctx.beginPath();
          ctx.arc(kx, ky, kr, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(226, 220, 212, 0.25)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      } else if (style === 'venus') {
        // Swirling golden cloud chevrons
        for (let v = 0; v < 7; v++) {
          const vy = cy + (-0.75 + v * 0.25) * radius;
          ctx.fillStyle = v % 2 === 0 ? 'rgba(254, 243, 199, 0.24)' : 'rgba(161, 98, 7, 0.22)';
          ctx.beginPath();
          ctx.ellipse(cx + Math.sin(spinOffset + v) * 8, vy, radius * 1.1, radius * 0.14, 0.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Spherical terminator shadow (sunlight from upper-left)
      const shadowGrad = ctx.createRadialGradient(
        cx - radius * 0.42,
        cy - radius * 0.42,
        radius * 0.25,
        cx + radius * 0.22,
        cy + radius * 0.22,
        radius * 1.25
      );
      shadowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      shadowGrad.addColorStop(0.55, 'rgba(6, 9, 19, 0.12)');
      shadowGrad.addColorStop(0.84, 'rgba(3, 5, 12, 0.72)');
      shadowGrad.addColorStop(1, 'rgba(2, 4, 10, 0.94)');
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // Subtle atmospheric rim light on lit limb
      ctx.strokeStyle = `${planet.visual.atmosphereColor}66`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius - 1, Math.PI * 0.75, Math.PI * 1.75);
      ctx.stroke();

      ctx.restore();

      // Front half of planetary rings
      drawRingHalf(false);
    };

    drawFrame(0);

    if (rotate && !prefersReducedMotion) {
      const loop = (now: number) => {
        if (now - lastTick >= 50) {
          lastTick = now;
          phase += 0.022;
          drawFrame(phase);
        }
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [planet, size, rotate]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`Illustration of ${planet.name}`}
      style={{ width: size, height: size }}
      className={`block shrink-0 ${className}`}
    />
  );
}
