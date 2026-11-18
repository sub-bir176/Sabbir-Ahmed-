import { MouseEvent, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { InitiativeCategory, InitiativeItem } from '../data/portfolio';
import { InitiativeVisual } from './InitiativeVisual';

interface WorkSectionProps {
  initiatives: InitiativeItem[];
  onSelectInitiative: (item: InitiativeItem) => void;
}

type FilterOption = 'All' | InitiativeCategory;

const FILTER_OPTIONS: FilterOption[] = [
  'All',
  'AI & Automation',
  'Operations',
  'Social Impact',
  'Commercial',
];

export function WorkSection({ initiatives, onSelectInitiative }: WorkSectionProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

  const filteredInitiatives =
    activeFilter === 'All'
      ? initiatives
      : initiatives.filter((item) => item.category === activeFilter);

  const isUnfiltered = activeFilter === 'All';

  const handleCardMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  return (
    <section id="work" className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Selected Initiatives
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-lg">
              Applied work across AI workflow automation, lead conversion pipelines, retail sales execution, and community impact.
            </p>
          </div>

          {/* Interactive category filter segmented control with gliding neon indicator */}
          <div
            role="group"
            aria-label="Filter initiatives by focus area"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-cyan-500/[0.06] backdrop-blur-md border border-cyan-500/30 dark:border-cyan-400/25 shadow-[0_0_20px_rgba(6,182,212,0.08)] rounded-lg self-start md:self-auto"
          >
            {FILTER_OPTIONS.map((option) => {
              const isActive = activeFilter === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setActiveFilter(option)}
                  aria-pressed={isActive}
                  className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-cyan-800 dark:text-cyan-200'
                      : 'text-slate-600 dark:text-slate-300/80 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="work-filter-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-0 bg-cyan-500/15 dark:bg-cyan-400/18 border border-cyan-500/45 dark:border-cyan-400/40 rounded-md shadow-[0_0_14px_rgba(34,211,238,0.2)]"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Bento Grid with smooth filter transitions + pointer spotlight */}
        <motion.div
          layout
          className={`grid grid-cols-1 gap-6 ${
            isUnfiltered ? 'lg:grid-cols-3' : 'md:grid-cols-2'
          }`}
        >
          <AnimatePresence mode="popLayout">
            {filteredInitiatives.map((item) => (
              <motion.article
                key={item.id}
                layout
                onMouseMove={handleCardMouseMove}
                initial={{ opacity: 0, scale: 0.97, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 10 }}
                whileHover={{
                  y: -4,
                  scale: 1.02,
                  transition: { type: 'spring', stiffness: 360, damping: 24 },
                }}
                whileTap={{ scale: 0.985 }}
                transition={{
                  duration: 0.22,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group relative bg-gradient-to-br from-cyan-500/[0.07] via-blue-500/[0.05] to-indigo-500/[0.08] dark:from-cyan-500/[0.07] dark:via-blue-600/[0.05] dark:to-indigo-500/[0.08] backdrop-blur-md border border-cyan-500/25 dark:border-cyan-400/25 rounded-2xl overflow-hidden shadow-[0_6px_26px_rgba(6,182,212,0.08)] dark:shadow-[0_0_26px_rgba(6,182,212,0.08),inset_0_1px_0_rgba(125,211,252,0.1)] transition-[colors,box-shadow] duration-200 hover:border-cyan-500/65 dark:hover:border-cyan-300/60 hover:shadow-[0_10px_36px_rgba(6,182,212,0.18)] dark:hover:shadow-[0_0_38px_rgba(34,211,238,0.22)] ${
                  isUnfiltered ? item.gridSpanClass : ''
                }`}
              >
                {/* Pointer-tracked spotlight overlay */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      'radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(34, 211, 238, 0.14), transparent 70%)',
                  }}
                />

                <button
                  type="button"
                  onClick={() => onSelectInitiative(item)}
                  className="relative z-10 w-full h-full text-left flex flex-col cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-inset"
                >
                  <div className="w-full h-56 sm:h-64 overflow-hidden border-b border-cyan-500/20 dark:border-cyan-400/20">
                    <InitiativeVisual
                      type={item.visualType}
                      className="transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-cyan-700 dark:text-cyan-300/90 font-medium">{item.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.organization}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{item.period}</span>
                        </div>
                        <ArrowUpRight
                          className="w-4 h-4 text-cyan-600/70 dark:text-cyan-400/60 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                          aria-hidden="true"
                        />
                      </div>

                      <h3 className="font-display text-xl md:text-2xl font-semibold tracking-tight text-slate-950 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-200 transition-colors duration-150">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
                        {item.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-cyan-500/20 dark:border-cyan-400/15 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{item.role}</span>
                      <span className="font-medium text-cyan-700 dark:text-cyan-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-200 transition-colors whitespace-nowrap">
                        View Details
                      </span>
                    </div>
                  </div>
                </button>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
