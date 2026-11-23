import { useEffect } from 'react';
import { X, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ExplorationTopic } from '../data/spaceData';
import { SpaceImage } from './SpaceImage';

interface ExplorationModalProps {
  topic: ExplorationTopic | null;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onLaunchBlackHoleLab: () => void;
}

export function ExplorationModal({
  topic,
  onClose,
  onNavigate,
  onLaunchBlackHoleLab,
}: ExplorationModalProps) {
  useEffect(() => {
    if (!topic) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [topic, onClose, onNavigate]);

  if (!topic) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exploration-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/15 bg-[#0b1020] p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs font-medium text-indigo-300">{topic.classification}</p>
            <h3
              id="exploration-modal-title"
              className="mt-0.5 font-display text-2xl font-bold text-white sm:text-3xl"
            >
              {topic.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${topic.title} overview`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <SpaceImage
            src={topic.image}
            alt={topic.title}
            className="aspect-[4/3] w-full rounded-xl border border-white/10"
          />

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm leading-relaxed text-slate-300">{topic.overview}</p>

              <div className="mt-4">
                <h4 className="text-xs font-semibold text-slate-400">
                  Notable Cosmic Examples
                </h4>
                <p className="mt-2 text-sm text-cyan-200/90">
                  {topic.notableExamples.join(' · ')}
                </p>
              </div>
            </div>

            {topic.hasSimulatorLink && (
              <button
                type="button"
                onClick={onLaunchBlackHoleLab}
                className="mt-5 inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-cyan-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-300"
              >
                <span>Open Interactive Black Hole Simulation</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {topic.telemetryMetrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <div className="text-[11px] font-medium text-slate-400">{metric.label}</div>
              <div className="mt-1 font-mono text-sm font-semibold text-white tabular-nums">
                {metric.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={() => onNavigate('prev')}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span>Previous Topic</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('next')}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <span>Next Topic</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
