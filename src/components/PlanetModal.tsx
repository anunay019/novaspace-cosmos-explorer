import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PlanetData } from '../data/spaceData';
import { PlanetVisual } from './PlanetVisual';

interface PlanetModalProps {
  planet: PlanetData | null;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function PlanetModal({ planet, onClose, onNavigate }: PlanetModalProps) {
  useEffect(() => {
    if (!planet) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [planet, onClose, onNavigate]);

  if (!planet) return null;

  const specs = [
    { label: 'Distance from Sun', value: planet.distanceFromSun },
    { label: 'Diameter', value: planet.diameterKm },
    { label: 'Mean Temperature', value: planet.meanTemperature },
    { label: 'Known Moons', value: String(planet.moons) },
    { label: 'Orbital Period', value: planet.orbitalPeriod },
    { label: 'Solar Day Length', value: planet.dayLength },
    { label: 'Surface Gravity', value: planet.gravity },
    { label: 'Axial Tilt', value: `${planet.visual.axialTiltDeg}°` },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="planet-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/15 bg-[#0b1020] p-5 shadow-2xl sm:p-6">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs font-medium text-cyan-300">
              Planet 0{planet.order} · {planet.categoryLabel}
            </p>
            <h3 id="planet-modal-title" className="mt-0.5 font-display text-2xl font-bold text-white sm:text-3xl">
              {planet.name}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${planet.name} details`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Visual + Core Summary */}
        <div className="mt-4 grid grid-cols-1 items-center gap-5 md:grid-cols-[200px_1fr]">
          <div className="flex items-center justify-center rounded-xl border border-white/10 bg-[#060913]/90 p-3">
            <PlanetVisual planet={planet} size={168} rotate />
          </div>

          <div>
            <p className="text-sm leading-relaxed text-slate-300">
              {planet.shortDescription}
            </p>

            <h4 className="mt-4 text-xs font-semibold text-slate-400">
              Key Planetary Observations
            </h4>
            <ul className="mt-2 space-y-1.5">
              {planet.facts.map((fact) => (
                <li key={fact} className="flex items-start gap-2.5 text-sm leading-snug text-slate-200">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-400" aria-hidden="true" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
            >
              <div className="text-[11px] font-medium text-slate-400">{spec.label}</div>
              <div className="mt-0.5 font-mono text-xs font-semibold text-white tabular-nums sm:text-sm">
                {spec.value}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer Navigation */}
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => onNavigate('prev')}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span>Previous Planet</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('next')}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <span>Next Planet</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
