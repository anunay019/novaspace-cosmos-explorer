import { useEffect, useState } from 'react';
import { ArrowRight, Compass, ChevronDown } from 'lucide-react';
import { HERO_IMAGE } from '../data/spaceData';

export function HeroSection() {
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const y = Math.min(window.scrollY, 800);
      setParallaxOffset(y * 0.22);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full items-center overflow-hidden pt-20 pb-16"
    >
      {/* Background Cosmos Image with subtle parallax */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div
          className="h-[115%] w-full will-change-transform"
          style={{ transform: `translate3d(0, ${parallaxOffset}px, 0)` }}
        >
          <img
            src={HERO_IMAGE}
            alt=""
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center opacity-75"
          />
        </div>
        {/* Calibrated readability scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060913]/95 via-[#060913]/70 to-[#060913]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-[#060913]/65" />
      </div>

      {/* Hero Foreground Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="animate-hero-in max-w-2xl">
          <p className="mb-3 text-sm font-medium tracking-wide text-cyan-300/90">
            Cosmic Observation Platform
          </p>

          <h1 className="font-display text-balance text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-[4.25rem] lg:leading-[1.06]">
            Explore the Universe.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Discover the mysteries of space, one world at a time. Journey from our Solar System’s
            innermost rocky worlds to deep-field nebulae, relativistic black holes, and humanity’s
            far-reaching spacecraft.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => scrollToSection('#solar-system')}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition-all duration-150 hover:bg-cyan-300 hover:shadow-[0_0_24px_rgba(34,211,238,0.35)] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              <span>Explore Space</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('#missions')}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-150 hover:border-indigo-300/50 hover:bg-indigo-500/15 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              <Compass className="h-4 w-4 text-indigo-300" aria-hidden="true" />
              <span>Discover Missions</span>
            </button>
          </div>

          {/* Unboxed Reference Telemetry Footer inside Hero */}
          <div className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-6">
            <div>
              <div className="font-mono text-xl font-semibold text-white tabular-nums sm:text-2xl">
                8
              </div>
              <div className="mt-0.5 text-xs text-slate-400">Solar Worlds</div>
            </div>
            <div>
              <div className="font-mono text-xl font-semibold text-cyan-300 tabular-nums sm:text-2xl">
                5,800+
              </div>
              <div className="mt-0.5 text-xs text-slate-400">Cataloged Exoplanets</div>
            </div>
            <div>
              <div className="font-mono text-xl font-semibold text-indigo-300 tabular-nums sm:text-2xl">
                166 AU
              </div>
              <div className="mt-0.5 text-xs text-slate-400">Farthest Human Probe</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Cue */}
      <button
        type="button"
        onClick={() => scrollToSection('#solar-system')}
        aria-label="Scroll to Solar System section"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-white/5 p-2.5 text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
      >
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>
    </section>
  );
}
