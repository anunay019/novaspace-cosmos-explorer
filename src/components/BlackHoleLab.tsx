import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Info } from 'lucide-react';
import {
  calculateBlackHolePhysics,
  createAccretionParticles,
  createSeededRng,
} from '../utils/astronomy';

const DEFAULT_PARAMS = {
  solarMasses: 24,
  spin: 0.72,
  particleCount: 220,
  inclination: 28,
};

export function BlackHoleLab() {
  const [solarMasses, setSolarMasses] = useState(DEFAULT_PARAMS.solarMasses);
  const [spin, setSpin] = useState(DEFAULT_PARAMS.spin);
  const [particleCount, setParticleCount] = useState(DEFAULT_PARAMS.particleCount);
  const [inclination, setInclination] = useState(DEFAULT_PARAMS.inclination);
  const [isPlaying, setIsPlaying] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const paramsRef = useRef({ solarMasses, spin, particleCount, inclination, isPlaying });

  useEffect(() => {
    paramsRef.current = { solarMasses, spin, particleCount, inclination, isPlaying };
  }, [solarMasses, spin, particleCount, inclination, isPlaying]);

  const telemetry = useMemo(
    () => calculateBlackHolePhysics(solarMasses, spin, inclination),
    [solarMasses, spin, inclination]
  );

  const particles = useMemo(
    () => createAccretionParticles(particleCount, 9001),
    [particleCount]
  );
  const particlesRef = useRef(particles);
  useEffect(() => {
    particlesRef.current = particles;
  }, [particles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bgStars = Array.from({ length: 85 }, (_, idx) => {
      const rand = createSeededRng(500 + idx * 17);
      return { x: rand(), y: rand(), r: 0.6 + rand() * 1.1, a: 0.25 + rand() * 0.55 };
    });

    let width = 0;
    let height = 0;
    let simTime = 0;
    let lastTime = performance.now();
    let rafId = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(320, rect.width);
      height = Math.max(320, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawScene = (dtSec: number) => {
      const { solarMasses: m, spin: a, inclination: tiltDeg, isPlaying: playing } =
        paramsRef.current;

      if (playing && !prefersReducedMotion) {
        simTime += dtSec * (0.65 + a * 1.35);
      }

      ctx.clearRect(0, 0, width, height);

      // Deep space backdrop gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        20,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.72
      );
      bgGrad.addColorStop(0, '#10122a');
      bgGrad.addColorStop(0.55, '#070a15');
      bgGrad.addColorStop(1, '#04060d');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;
      const baseScale = Math.min(width, height);
      // Event horizon visual radius scales gently with mass
      const horizonR = baseScale * (0.11 + (m / 100) * 0.065);
      const iscoR = horizonR * (1.22 + 0.45 * (1 - a));
      const outerDiskR = horizonR * 3.15;
      const tiltRatio = Math.sin((tiltDeg * Math.PI) / 180);

      // Background starfield with subtle gravitational deflection near horizon
      for (let i = 0; i < bgStars.length; i++) {
        const st = bgStars[i];
        let sx = st.x * width;
        let sy = st.y * height;
        const dx = sx - cx;
        const dy = sy - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < horizonR * 2.4 && dist > 1) {
          const push = (horizonR * 1.25) / dist;
          sx = cx + dx * (1 + push * 0.45);
          sy = cy + dy * (1 + push * 0.45);
        }
        ctx.fillStyle = `rgba(226, 232, 240, ${st.a})`;
        ctx.beginPath();
        ctx.arc(sx, sy, st.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 1. Gravitational lensing Einstein halo (bent light from far side of accretion disk)
      const lensRadius = horizonR * 1.44;
      const lensGrad = ctx.createRadialGradient(
        cx,
        cy,
        horizonR * 0.98,
        cx,
        cy,
        horizonR * 2.25
      );
      lensGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      lensGrad.addColorStop(0.24, 'rgba(251, 191, 36, 0.34)');
      lensGrad.addColorStop(0.42, 'rgba(56, 189, 248, 0.24)');
      lensGrad.addColorStop(0.7, 'rgba(129, 140, 248, 0.12)');
      lensGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = lensGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, horizonR * 2.25, 0, Math.PI * 2);
      ctx.fill();

      // Secondary upper/lower lensed photon arcs
      ctx.save();
      ctx.strokeStyle = 'rgba(253, 186, 116, 0.32)';
      ctx.lineWidth = Math.max(2, horizonR * 0.12);
      ctx.beginPath();
      ctx.arc(cx, cy, lensRadius, Math.PI * 1.08, Math.PI * 1.92);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
      ctx.lineWidth = Math.max(1.5, horizonR * 0.08);
      ctx.beginPath();
      ctx.arc(cx, cy, lensRadius * 0.94, Math.PI * 0.12, Math.PI * 0.88);
      ctx.stroke();
      ctx.restore();

      const currentParticles = particlesRef.current;

      // Helper to render back or front half of accretion disk + particles
      const renderDiskHalf = (backHalf: boolean) => {
        // Continuous fluid accretion disk rings (24 finely blended bands)
        const ringCount = 24;
        for (let rIdx = 0; rIdx < ringCount; rIdx++) {
          const t = rIdx / (ringCount - 1);
          const rx = iscoR + (outerDiskR - iscoR) * t;
          const ry = rx * tiltRatio;

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(-0.14);

          const startAng = backHalf ? Math.PI : 0;
          const endAng = backHalf ? Math.PI * 2 : Math.PI;

          // Smooth plasma falloff from inner ISCO cyan-white through amber to outer violet
          const alpha = Math.pow(1 - t, 1.35) * (0.13 + a * 0.08);
          let strokeColor = `rgba(103, 232, 249, ${alpha * 1.15})`;
          if (t > 0.18 && t <= 0.52) {
            strokeColor = `rgba(251, 191, 36, ${alpha * 1.1})`;
          } else if (t > 0.52) {
            strokeColor = `rgba(129, 140, 248, ${alpha * 0.85})`;
          }

          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = Math.max(2.5, ((outerDiskR - iscoR) / ringCount) * 1.65);
          ctx.beginPath();
          ctx.ellipse(0, 0, rx, ry, 0, startAng, endAng);
          ctx.stroke();
          ctx.restore();
        }

        // Orbiting plasma particles
        for (let i = 0; i < currentParticles.length; i++) {
          const p = currentParticles[i];
          const liveAngle = (p.angle + simTime * p.angularSpeed) % (Math.PI * 2);
          const sinA = Math.sin(liveAngle);
          const isBack = sinA < 0;
          if (isBack !== backHalf) continue;

          const cosA = Math.cos(liveAngle);
          const r = iscoR + (outerDiskR - iscoR) * p.radiusNorm;

          const localX = cosA * r;
          const localY = sinA * r * tiltRatio;
          const rot = -0.14;
          const px = cx + localX * Math.cos(rot) - localY * Math.sin(rot);
          const py = cy + localX * Math.sin(rot) + localY * Math.cos(rot);

          // Relativistic Doppler beaming: approaching side (cosA < 0) appears brighter
          const dopplerBoost = 0.72 + (cosA < 0 ? Math.abs(cosA) * 0.55 : -cosA * 0.2);
          const alpha = Math.min(1, p.brightness * dopplerBoost);

          if (p.hueShift < 0.28) {
            ctx.fillStyle = `rgba(165, 243, 252, ${alpha})`;
          } else if (p.hueShift < 0.65) {
            ctx.fillStyle = `rgba(253, 186, 116, ${alpha})`;
          } else {
            ctx.fillStyle = `rgba(167, 139, 250, ${alpha * 0.85})`;
          }

          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      // 2. Back half of accretion disk
      renderDiskHalf(true);

      // 3. Event horizon dark shadow & razor photon ring
      ctx.fillStyle = '#020308';
      ctx.beginPath();
      ctx.arc(cx, cy, horizonR, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(224, 242, 254, 0.85)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(cx, cy, horizonR * 1.02, 0, Math.PI * 2);
      ctx.stroke();

      // 4. Front half of accretion disk crossing in front of shadow
      renderDiskHalf(false);
    };

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries.some((e) => e.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    resize();
    drawScene(0);
    window.addEventListener('resize', resize);

    const loop = (now: number) => {
      if (isVisible && now - lastTime >= 40) {
        const dt = Math.min(0.06, (now - lastTime) * 0.001);
        lastTime = now;
        drawScene(dt);
      } else if (!isVisible) {
        lastTime = now;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleReset = () => {
    setSolarMasses(DEFAULT_PARAMS.solarMasses);
    setSpin(DEFAULT_PARAMS.spin);
    setParticleCount(DEFAULT_PARAMS.particleCount);
    setInclination(DEFAULT_PARAMS.inclination);
    setIsPlaying(true);
  };

  return (
    <section
      id="black-hole-lab"
      className="relative z-10 border-t border-white/10 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-wide text-cyan-400">
            Interactive Gravity Sandbox
          </p>
          <h2 className="mt-2 font-display text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Black Hole Accretion Visualizer
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-300">
            Adjust mass, relativistic spin, viewing inclination, and plasma density to observe how
            the innermost stable orbit and Doppler-beamed accretion disk respond.
          </p>
        </div>

        {/* Two-Zone Scientific Console */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* Simulation Canvas Stage */}
          <div className="relative flex min-h-[380px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#04060d] lg:col-span-7 lg:min-h-[490px]">
            <canvas
              ref={canvasRef}
              data-testid="black-hole-canvas"
              aria-label="Interactive simulation of a black hole with glowing accretion disk and orbiting plasma particles"
              className="h-full w-full flex-1 cursor-crosshair"
            />

            {/* Minimal HUD Overlay */}
            <div className="pointer-events-none absolute inset-x-4 top-4 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-300">
              <span className="rounded bg-black/60 px-2.5 py-1 border border-white/10">
                {isPlaying ? 'Active Orbit' : 'Paused'}
              </span>
              <span className="rounded bg-black/60 px-2.5 py-1 border border-white/10 tabular-nums">
                R_s = {telemetry.schwarzschildRadiusKm.toLocaleString('en-US')} km · ISCO ={' '}
                {telemetry.iscoRadiusKm.toLocaleString('en-US')} km
              </span>
            </div>

            <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center gap-2 rounded-lg border border-white/10 bg-black/65 px-3 py-2 text-xs text-slate-300 backdrop-blur-sm">
              <Info className="h-3.5 w-3.5 shrink-0 text-cyan-300" aria-hidden="true" />
              <span>
                Illustrative simulation for educational exploration — not a scientifically exact
                general-relativistic raytracer.
              </span>
            </div>
          </div>

          {/* Control & Telemetry Deck */}
          <div className="glass-panel flex flex-col justify-between rounded-2xl p-6 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <h3 className="font-display text-lg font-semibold text-white">
                  Singularity Parameters
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-cyan-400/35 bg-cyan-500/15 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition-colors hover:bg-cyan-400 hover:text-slate-950 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Play</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    aria-label="Reset simulation parameters"
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Parameter Sliders */}
              <div className="mt-5 space-y-5">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="bh-mass-slider" className="font-medium text-slate-200">
                      Black Hole Mass
                    </label>
                    <span className="font-mono text-cyan-300 tabular-nums">
                      {solarMasses} M☉
                    </span>
                  </div>
                  <input
                    id="bh-mass-slider"
                    type="range"
                    min={5}
                    max={100}
                    step={1}
                    value={solarMasses}
                    onChange={(e) => setSolarMasses(Number(e.target.value))}
                    className="space-slider mt-2 w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="bh-spin-slider" className="font-medium text-slate-200">
                      Kerr Spin Parameter (a*)
                    </label>
                    <span className="font-mono text-cyan-300 tabular-nums">
                      {spin.toFixed(2)}
                    </span>
                  </div>
                  <input
                    id="bh-spin-slider"
                    type="range"
                    min={0.1}
                    max={0.98}
                    step={0.02}
                    value={spin}
                    onChange={(e) => setSpin(Number(e.target.value))}
                    className="space-slider mt-2 w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="bh-particles-slider" className="font-medium text-slate-200">
                      Accretion Particle Density
                    </label>
                    <span className="font-mono text-cyan-300 tabular-nums">
                      {particleCount} particles
                    </span>
                  </div>
                  <input
                    id="bh-particles-slider"
                    type="range"
                    min={60}
                    max={360}
                    step={10}
                    value={particleCount}
                    onChange={(e) => setParticleCount(Number(e.target.value))}
                    className="space-slider mt-2 w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="bh-tilt-slider" className="font-medium text-slate-200">
                      Viewing Inclination
                    </label>
                    <span className="font-mono text-cyan-300 tabular-nums">
                      {inclination}°
                    </span>
                  </div>
                  <input
                    id="bh-tilt-slider"
                    type="range"
                    min={12}
                    max={80}
                    step={1}
                    value={inclination}
                    onChange={(e) => setInclination(Number(e.target.value))}
                    className="space-slider mt-2 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Derived Telemetry Grid + Educational Note */}
            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
                  <div className="text-[11px] text-slate-400">Event Horizon (R_s)</div>
                  <div className="mt-0.5 font-mono text-sm font-semibold text-white tabular-nums">
                    {telemetry.schwarzschildRadiusKm.toLocaleString('en-US')} km
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
                  <div className="text-[11px] text-slate-400">ISCO Velocity</div>
                  <div className="mt-0.5 font-mono text-sm font-semibold text-cyan-300 tabular-nums">
                    {telemetry.innerOrbitalVelocityPctC}% c
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
                  <div className="text-[11px] text-slate-400">Peak Disk Temp</div>
                  <div className="mt-0.5 font-mono text-sm font-semibold text-amber-300 tabular-nums">
                    {(telemetry.peakDiskTempK / 1e6).toFixed(1)}M K
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
                  <div className="text-[11px] text-slate-400">Time Dilation (1.35 R_s)</div>
                  <div className="mt-0.5 font-mono text-sm font-semibold text-indigo-300 tabular-nums">
                    {telemetry.timeDilationFactor}×
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-slate-400">
                As plasma spirals toward the innermost stable circular orbit (ISCO), friction heats
                gas to millions of Kelvin while spacetime curvature bends light from behind the
                black hole into glowing upper and lower Einstein arcs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
