import { useState, useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PLANETS, type PlanetData } from '../data/spaceData';
import {
  filterPlanetsByCategory,
  getAdjacentId,
  type PlanetCategory,
} from '../utils/astronomy';
import { PlanetVisual } from './PlanetVisual';
import { PlanetModal } from './PlanetModal';

const CATEGORIES: { id: PlanetCategory; label: string }[] = [
  { id: 'all', label: 'All Worlds (8)' },
  { id: 'terrestrial', label: 'Terrestrial' },
  { id: 'gas-giant', label: 'Gas Giants' },
  { id: 'ice-giant', label: 'Ice Giants' },
];

export function SolarSystemSection() {
  const [selectedCategory, setSelectedCategory] = useState<PlanetCategory>('all');
  const [activePlanetId, setActivePlanetId] = useState<string | null>(null);

  const visiblePlanets = useMemo(
    () => filterPlanetsByCategory(PLANETS, selectedCategory),
    [selectedCategory]
  );

  const activePlanet: PlanetData | null = useMemo(
    () => PLANETS.find((p) => p.id === activePlanetId) ?? null,
    [activePlanetId]
  );

  const handleNavigateModal = (direction: 'prev' | 'next') => {
    if (!activePlanetId) return;
    const nextId = getAdjacentId(PLANETS, activePlanetId, direction);
    setActivePlanetId(nextId);
  };

  return (
    <section id="solar-system" className="relative z-10 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header + Filter Segmented Bar */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-wide text-cyan-400">
              Solar System Atlas
            </p>
            <h2 className="mt-2 font-display text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Eight Worlds Around Our Star
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              Select any planet to inspect its orbital period, surface temperature, moon count, and
              distinctive atmospheric dynamics.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter planets by classification"
            className="inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] p-1"
          >
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  aria-pressed={active}
                  className={`min-h-[36px] rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                    active
                      ? 'bg-cyan-400 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Planet Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visiblePlanets.map((planet) => (
            <button
              key={planet.id}
              type="button"
              onClick={() => setActivePlanetId(planet.id)}
              aria-label={`Inspect ${planet.name} — ${planet.distanceFromSun}`}
              className="group glass-panel flex flex-col items-start rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-[#111931]/85 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              <div className="flex w-full items-center justify-between text-xs text-slate-400">
                <span className="font-mono tabular-nums">0{planet.order}</span>
                <span>{planet.categoryLabel}</span>
              </div>

              <div className="my-4 flex w-full items-center justify-center py-1 transition-transform duration-300 group-hover:scale-105">
                <PlanetVisual planet={planet} size={148} />
              </div>

              <div className="flex w-full items-center justify-between gap-2">
                <h3 className="font-display text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {planet.name}
                </h3>
                <ArrowUpRight
                  className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-300"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-1 font-mono text-xs text-cyan-300/90 tabular-nums">
                {planet.distanceFromSun} · {planet.moons} {planet.moons === 1 ? 'moon' : 'moons'}
              </p>

              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {planet.shortDescription}
              </p>
            </button>
          ))}
        </div>
      </div>

      <PlanetModal
        planet={activePlanet}
        onClose={() => setActivePlanetId(null)}
        onNavigate={handleNavigateModal}
      />
    </section>
  );
}
