import { useEffect, useMemo, useRef, useState } from 'react';
import { CELESTIAL_TARGETS, DASHBOARD_COUNTERS } from '../data/spaceData';
import {
  computeLogDistancePercent,
  formatCelestialDistance,
  formatSpacecraftTransitTime,
  type DistanceUnit,
} from '../utils/astronomy';

function AnimatedCounter({
  targetValue,
  suffix = '',
}: {
  targetValue: number;
  suffix?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(targetValue);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const startAnimation = () => {
      if (animatedRef.current) return;
      animatedRef.current = true;
      const durationMs = 950;
      const start = performance.now();

      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(targetValue * eased));
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [targetValue]);

  return (
    <span ref={ref} className="font-mono text-3xl font-bold text-white tabular-nums sm:text-4xl">
      {displayValue.toLocaleString('en-US')}
      {suffix}
    </span>
  );
}

const DISTANCE_UNITS: { id: DistanceUnit; label: string }[] = [
  { id: 'km', label: 'Kilometers' },
  { id: 'au', label: 'Astronomical Units' },
  { id: 'ly', label: 'Light-Years' },
  { id: 'lightTime', label: 'Light Time' },
];

export function SpaceDashboard() {
  const [selectedTargetId, setSelectedTargetId] = useState(CELESTIAL_TARGETS[0].id);
  const [unit, setUnit] = useState<DistanceUnit>('km');

  const selectedTarget = useMemo(
    () => CELESTIAL_TARGETS.find((t) => t.id === selectedTargetId) ?? CELESTIAL_TARGETS[0],
    [selectedTargetId]
  );

  const formattedDistance = useMemo(
    () => formatCelestialDistance(selectedTarget.distanceKm, unit),
    [selectedTarget.distanceKm, unit]
  );

  const lightTravelReadout = useMemo(
    () => formatCelestialDistance(selectedTarget.distanceKm, 'lightTime'),
    [selectedTarget.distanceKm]
  );

  const transitTime = useMemo(
    () => formatSpacecraftTransitTime(selectedTarget.distanceKm),
    [selectedTarget.distanceKm]
  );

  const scalePercent = useMemo(
    () => computeLogDistancePercent(selectedTarget.distanceKm),
    [selectedTarget.distanceKm]
  );

  return (
    <section id="dashboard" className="relative z-10 border-t border-white/10 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-wide text-indigo-300">
              Cosmic Telemetry Overview
            </p>
            <h2 className="mt-2 font-display text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Space Dashboard
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              Explore key astronomical counts and compare real-scale distances from Earth to
              planets, deep-space probes, and galactic landmarks.
            </p>
          </div>

          <p className="font-mono text-xs text-slate-400">
            Reference Catalog &amp; Simulated Telemetry
          </p>
        </div>

        {/* 4 Animated Counter Cards */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DASHBOARD_COUNTERS.map((counter) => (
            <div
              key={counter.id}
              className="glass-panel flex flex-col justify-between rounded-2xl p-6"
            >
              <div className="text-xs font-medium text-slate-400">{counter.label}</div>
              <div className="mt-3">
                <AnimatedCounter targetValue={counter.targetValue} suffix={counter.suffix} />
              </div>
              <div className="mt-2 text-xs text-cyan-300/85">{counter.detail}</div>
            </div>
          ))}
        </div>

        {/* Interactive Distance from Earth Panel */}
        <div className="glass-panel mt-8 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-center">
            <div>
              <h3 className="font-display text-xl font-semibold text-white">
                Distance from Earth Explorer
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Select a celestial object and unit scale to inspect cosmic range and transit time.
              </p>
            </div>

            <div
              role="group"
              aria-label="Distance display unit"
              className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1"
            >
              {DISTANCE_UNITS.map((u) => {
                const active = unit === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUnit(u.id)}
                    aria-pressed={active}
                    className={`min-h-[34px] rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                      active
                        ? 'bg-cyan-400 text-slate-950'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {u.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Object Selector List */}
            <div
              role="listbox"
              aria-label="Select celestial object"
              className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1"
            >
              {CELESTIAL_TARGETS.map((target) => {
                const active = target.id === selectedTarget.id;
                return (
                  <button
                    key={target.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => setSelectedTargetId(target.id)}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                      active
                        ? 'border-cyan-400/55 bg-cyan-500/15 text-white'
                        : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/25 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{target.name}</div>
                      <div className="text-xs text-slate-400">{target.type}</div>
                    </div>
                    <span className="font-mono text-xs text-cyan-300 tabular-nums whitespace-nowrap shrink-0">
                      {formatCelestialDistance(target.distanceKm, unit)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Range Readout + Logarithmic Scale Visualization */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#070b17]/80 p-6 lg:col-span-7">
              <div>
                <p className="text-xs font-medium text-indigo-300">{selectedTarget.type}</p>
                <h4 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                  {selectedTarget.name}
                </h4>
                <p className="mt-1.5 text-sm text-slate-400">{selectedTarget.note}</p>

                <div className="mt-7 rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-xs font-medium text-slate-400">
                    Measured Distance from Earth
                  </div>
                  <div
                    data-testid="dashboard-distance-value"
                    className="mt-1.5 font-mono text-3xl font-bold text-cyan-300 tabular-nums sm:text-4xl"
                  >
                    {formattedDistance}
                  </div>
                </div>

                {/* Logarithmic Cosmic Scale Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Logarithmic Cosmic Scale (Lunar Orbit to Galactic Core)</span>
                    <span className="font-mono text-slate-200 tabular-nums">{scalePercent}%</span>
                  </div>
                  <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 transition-all duration-300"
                      style={{ width: `${scalePercent}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between font-mono text-[11px] text-slate-500">
                    <span>384k km (Moon)</span>
                    <span>166 AU (Voyager 1)</span>
                    <span>26,670 ly (Sgr A*)</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <div className="text-[11px] text-slate-400">One-Way Light Travel Time</div>
                  <div className="mt-1 font-mono text-sm font-semibold text-white tabular-nums">
                    {lightTravelReadout}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <div className="text-[11px] text-slate-400">
                    Spacecraft Cruise (58,500 km/h)
                  </div>
                  <div className="mt-1 font-mono text-sm font-semibold text-white tabular-nums">
                    {transitTime}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About NovaSpace Anchor Section */}
        <div
          id="about"
          className="mt-16 grid grid-cols-1 gap-8 border-t border-white/10 pt-14 lg:grid-cols-12 lg:items-center"
        >
          <div className="lg:col-span-5">
            <p className="text-sm font-medium tracking-wide text-cyan-400">
              About NovaSpace
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
              Designed to Make Cosmic Scale Tangible
            </h3>
          </div>
          <div className="lg:col-span-7">
            <p className="text-base leading-relaxed text-slate-300">
              NovaSpace brings planetary telemetry, deep-field astrophysics, relativistic gravity
              visualizations, and historic spaceflight milestones into a single interactive
              observatory. Built for curious learners, educators, and spaceflight enthusiasts, every
              visualization pairs scientific precision with direct tactile exploration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
