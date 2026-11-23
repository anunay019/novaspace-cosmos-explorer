import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Solar System', href: '#solar-system' },
  { label: 'Discover', href: '#discover' },
  { label: 'Missions', href: '#missions' },
  { label: 'About', href: '#about' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-200 ${
        scrolled || mobileOpen
          ? 'bg-[#060913]/85 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('#home');
          }}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="text-cyan-400 shrink-0"
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

        {/* Zone 2: Primary Nav Links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              className="relative text-sm font-medium text-slate-300 transition-colors duration-150 hover:text-white whitespace-nowrap shrink-0 after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-0 after:bg-cyan-400 after:transition-all after:duration-200 hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Button */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#dashboard"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#dashboard');
            }}
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-cyan-500/15 border border-cyan-400/35 px-4 py-2 text-xs font-semibold text-cyan-200 transition-all duration-150 hover:bg-cyan-500/25 hover:border-cyan-300/60 hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          >
            Space Dashboard
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 transition-colors hover:bg-white/10 md:hidden focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile Navigation"
          className="border-t border-white/10 bg-[#060913]/95 px-4 pb-5 pt-3 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-slate-200 hover:bg-white/5 hover:text-cyan-300"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#dashboard"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('#dashboard');
              }}
              className="mt-2 flex min-h-[44px] items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-400/40 px-4 text-sm font-semibold text-cyan-100 hover:bg-cyan-500/30"
            >
              Space Dashboard
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
