import { useState, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { EXPLORATION_TOPICS } from '../data/spaceData';
import { getAdjacentId } from '../utils/astronomy';
import { SpaceImage } from './SpaceImage';
import { ExplorationModal } from './ExplorationModal';

export function ExplorationSection() {
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

  const activeTopic = useMemo(
    () => EXPLORATION_TOPICS.find((t) => t.id === activeTopicId) ?? null,
    [activeTopicId]
  );

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!activeTopicId) return;
    setActiveTopicId(getAdjacentId(EXPLORATION_TOPICS, activeTopicId, direction));
  };

  const handleLaunchBlackHoleLab = () => {
    setActiveTopicId(null);
    const lab = document.querySelector('#black-hole-lab');
    if (lab) {
      lab.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="discover"
      className="relative z-10 border-t border-white/10 bg-gradient-to-b from-[#060913] via-[#090e1d] to-[#060913] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide text-indigo-300">
            Deep Space Phenomena
          </p>
          <h2 className="mt-2 font-display text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Frontiers Beyond the Solar System
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-300">
            Examine the cosmic structures shaping the universe — from star-forming nebulae and
            grand-design galaxies to extrasolar worlds and singularities.
          </p>
        </div>

        {/* Asymmetric 5-card grid: 2 featured + 3 standard on desktop */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-6">
          {EXPLORATION_TOPICS.map((topic, index) => {
            const isFeatured = index < 2;
            return (
              <article
                key={topic.id}
                className={`group glass-panel flex flex-col overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:border-indigo-400/40 ${
                  isFeatured ? 'md:col-span-3' : 'md:col-span-2'
                }`}
              >
                <div className="relative overflow-hidden">
                  <SpaceImage
                    src={topic.image}
                    alt={`${topic.title} — ${topic.classification}`}
                    className={isFeatured ? 'aspect-[16/10] w-full' : 'aspect-[4/3] w-full'}
                    imgClassName="group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1020] via-transparent to-transparent opacity-80"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <p className="text-xs font-medium text-indigo-300">{topic.classification}</p>
                    <h3 className="mt-1.5 font-display text-2xl font-semibold text-white">
                      {topic.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                      {topic.shortDescription}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      {topic.telemetryMetrics[0].value}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTopicId(topic.id)}
                      aria-label={`Explore ${topic.title}`}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-200 transition-all duration-150 hover:border-cyan-300/60 hover:bg-cyan-400 hover:text-slate-950 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <ExplorationModal
        topic={activeTopic}
        onClose={() => setActiveTopicId(null)}
        onNavigate={handleNavigate}
        onLaunchBlackHoleLab={handleLaunchBlackHoleLab}
      />
    </section>
  );
}
