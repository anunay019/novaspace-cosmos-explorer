import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MISSIONS } from '../data/spaceData';
import { getAdjacentId } from '../utils/astronomy';
import { SpaceImage } from './SpaceImage';

export function MissionTimeline() {
  const [selectedMissionId, setSelectedMissionId] = useState(MISSIONS[0].id);

  const activeMission = useMemo(
    () => MISSIONS.find((m) => m.id === selectedMissionId) ?? MISSIONS[0],
    [selectedMissionId]
  );

  const activeIndex = MISSIONS.findIndex((m) => m.id === activeMission.id);

  return (
    <section
      id="missions"
      className="relative z-10 border-t border-white/10 bg-gradient-to-b from-[#060913] via-[#090d1b] to-[#060913] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-wide text-cyan-400">
              Spaceflight Chronology
            </p>
            <h2 className="mt-2 font-display text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Milestones of Cosmic Exploration
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              Trace humanity’s defining journeys from the Sea of Tranquility to interstellar space
              and the Sun-Earth L2 infrared frontier.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                setSelectedMissionId(getAdjacentId(MISSIONS, activeMission.id, 'prev'))
              }
              aria-label="Previous mission"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 transition-colors hover:bg-white/10 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-mono text-xs text-slate-400 tabular-nums">
              0{activeIndex + 1} / 0{MISSIONS.length}
            </span>
            <button
              type="button"
              onClick={() =>
                setSelectedMissionId(getAdjacentId(MISSIONS, activeMission.id, 'next'))
              }
              aria-label="Next mission"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 transition-colors hover:bg-white/10 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Interactive Horizontal Timeline Selector */}
        <div
          role="tablist"
          aria-label="Historic and active space missions"
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
        >
          {MISSIONS.map((mission) => {
            const active = mission.id === activeMission.id;
            return (
              <button
                key={mission.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedMissionId(mission.id)}
                className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                  active
                    ? 'border-cyan-400/60 bg-cyan-500/15 text-white shadow-[0_0_20px_rgba(34,211,238,0.12)]'
                    : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <span
                  className={`font-mono text-xs font-semibold tabular-nums ${
                    active ? 'text-cyan-300' : 'text-slate-400'
                  }`}
                >
                  {mission.year}
                </span>
                <span className="mt-1 line-clamp-1 font-display text-sm font-semibold">
                  {mission.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Mission Spotlight Card */}
        <div className="glass-panel mt-6 overflow-hidden rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-stretch">
            <div className="lg:col-span-6">
              <SpaceImage
                src={activeMission.image}
                alt={`${activeMission.name} spacecraft photography`}
                className="aspect-[4/3] w-full lg:aspect-auto lg:h-full"
              />
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6">
              <div>
                <p className="font-mono text-xs text-cyan-300 tabular-nums">
                  {activeMission.date} · {activeMission.agency} · {activeMission.status}
                </p>

                <h3 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
                  {activeMission.name}
                </h3>

                <p className="mt-3 text-base leading-relaxed text-slate-200">
                  {activeMission.shortDescription}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  {activeMission.extendedSummary}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
                {activeMission.highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3"
                  >
                    <div className="text-[11px] font-medium text-slate-400">{item.label}</div>
                    <div className="mt-1 font-mono text-xs font-semibold text-white tabular-nums sm:text-sm">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
