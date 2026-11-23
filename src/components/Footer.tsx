import { useState } from 'react';
import { Globe, Mail, Share2, Radio } from 'lucide-react';
import { ContactModal } from './ContactModal';

export function Footer() {
  const [contactOpen, setContactOpen] = useState(false);

  const scrollTo = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#04060d] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand Column */}
          <div className="md:col-span-4">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('#home');
              }}
              className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-white"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="text-cyan-400"
              >
                <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.9" />
                <ellipse
                  cx="12"
                  cy="12"
                  rx="10"
                  ry="4.2"
                  transform="rotate(-24 12 12)"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="font-display">NovaSpace</span>
            </a>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
              Explore the Universe. Interactive planetary atlas, astrophysics simulations, and
              humanity’s landmark deep-space missions.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8">
            <div>
              <h3 className="text-xs font-semibold tracking-wider text-slate-200">
                About
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
                <li>
                  <a
                    href="#about"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo('#about');
                    }}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    Our Mission
                  </a>
                </li>
                <li>
                  <a
                    href="#dashboard"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo('#dashboard');
                    }}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    Space Dashboard
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setContactOpen(true)}
                    className="hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    Contact Team
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-wider text-slate-200">
                Exploration
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
                <li>
                  <a
                    href="#solar-system"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo('#solar-system');
                    }}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    Solar System
                  </a>
                </li>
                <li>
                  <a
                    href="#discover"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo('#discover');
                    }}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    Deep Space
                  </a>
                </li>
                <li>
                  <a
                    href="#black-hole-lab"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo('#black-hole-lab');
                    }}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    Black Hole Lab
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-wider text-slate-200">
                Missions &amp; Contact
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
                <li>
                  <a
                    href="#missions"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo('#missions');
                    }}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    Mission Timeline
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setContactOpen(true)}
                    className="hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    Send Inquiry
                  </button>
                </li>
              </ul>

              {/* Functional Social / Action Icons */}
              <div className="mt-5 flex items-center gap-2.5">
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('#home');
                  }}
                  aria-label="NovaSpace Global Portal"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
                >
                  <Globe className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#missions"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('#missions');
                  }}
                  aria-label="Deep Space Network Telemetry"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
                >
                  <Radio className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#discover"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('#discover');
                  }}
                  aria-label="Share NovaSpace Discoveries"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
                >
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  aria-label="Contact NovaSpace via message form"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-300 cursor-pointer"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} NovaSpace. Educational Cosmos Explorer.</p>
          <p>Planetary &amp; mission telemetry presented for educational exploration.</p>
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </footer>
  );
}
