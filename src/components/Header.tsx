import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, Moon, Sun, X } from 'lucide-react';

interface HeaderProps {
  brandName: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onContactClick: () => void;
}

const NAV_LINKS = [
  { label: 'Initiatives', href: '#work' },
  { label: 'Skills', href: '#capabilities' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
];

export function Header({
  brandName,
  theme,
  onToggleTheme,
  onContactClick,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#050917]/80 backdrop-blur-xl border-b border-cyan-500/20 dark:border-cyan-400/15 transition-colors duration-200">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-lg font-semibold tracking-tight text-slate-950 dark:text-white whitespace-nowrap shrink-0 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors duration-150"
        >
          {brandName}
        </a>

        {/* Zone 2: 4 single-line text navigation links with gliding translucent neon hover box */}
        <nav
          aria-label="Primary Navigation"
          onMouseLeave={() => setHoveredHref(null)}
          className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          {NAV_LINKS.map((link) => {
            const isHovered = hoveredHref === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredHref(link.href)}
                onFocus={() => setHoveredHref(link.href)}
                onBlur={() => setHoveredHref(null)}
                className={`relative whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg transition-colors duration-150 ${
                  isHovered
                    ? 'text-cyan-700 dark:text-cyan-200'
                    : 'hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {isHovered && (
                  <motion.span
                    layoutId="header-nav-hover-box"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 440, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-cyan-500/10 dark:bg-cyan-400/12 border border-cyan-500/35 dark:border-cyan-400/35 shadow-[0_0_14px_rgba(6,182,212,0.16)] dark:shadow-[0_0_16px_rgba(34,211,238,0.2)]"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Theme Switcher & Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <motion.button
            type="button"
            onClick={onToggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            aria-label={theme === 'dark' ? 'Switch to white mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to white mode' : 'Switch to dark mode'}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-500/[0.08] border border-cyan-500/30 dark:border-cyan-400/30 text-cyan-700 dark:text-cyan-200 hover:bg-cyan-500/15 dark:hover:bg-cyan-400/20 hover:border-cyan-500/60 dark:hover:border-cyan-300/60 shadow-[0_0_14px_rgba(6,182,212,0.14)] transition-all duration-150 cursor-pointer"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.span
                  key="sun-icon"
                  initial={{ opacity: 0, rotate: -60, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 60, scale: 0.7 }}
                  transition={{ duration: 0.16 }}
                  className="flex items-center justify-center"
                >
                  <Sun className="w-4 h-4" aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon-icon"
                  initial={{ opacity: 0, rotate: 60, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -60, scale: 0.7 }}
                  transition={{ duration: 0.16 }}
                  className="flex items-center justify-center"
                >
                  <Moon className="w-4 h-4" aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.14 }}
            onClick={onContactClick}
            className="hidden md:inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-500/85 dark:to-blue-600/90 border border-cyan-400/50 dark:border-cyan-300/40 rounded-lg shadow-[0_0_18px_rgba(6,182,212,0.28)] hover:shadow-[0_0_26px_rgba(34,211,238,0.45)] hover:from-cyan-400 hover:to-blue-500 transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Get in Touch
          </motion.button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-slate-700 dark:text-slate-200 bg-cyan-500/[0.08] border border-cyan-500/25 dark:border-cyan-400/20 hover:border-cyan-500/50 dark:hover:border-cyan-400/45 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      <AnimatePresence initial={false}>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-cyan-500/20 dark:border-cyan-400/15 bg-white/95 dark:bg-[#060C20]/95 backdrop-blur-xl px-6 py-4 space-y-3"
          >
            <nav aria-label="Mobile Navigation" className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-300"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onContactClick();
              }}
              className="w-full py-2.5 px-4 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-300/40 rounded-lg shadow-[0_0_18px_rgba(6,182,212,0.28)] transition-all cursor-pointer"
            >
              Get in Touch
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
