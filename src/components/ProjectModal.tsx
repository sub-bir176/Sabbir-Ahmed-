import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { InitiativeItem } from '../data/portfolio';
import { InitiativeVisual } from './InitiativeVisual';

interface ProjectModalProps {
  initiative: InitiativeItem | null;
  initiatives: InitiativeItem[];
  onClose: () => void;
  onSelectInitiative: (item: InitiativeItem) => void;
}

export function ProjectModal({
  initiative,
  initiatives,
  onClose,
  onSelectInitiative,
}: ProjectModalProps) {
  useEffect(() => {
    if (!initiative) return;

    const currentIndex = initiatives.findIndex((item) => item.id === initiative.id);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight' && currentIndex !== -1) {
        const nextIndex = (currentIndex + 1) % initiatives.length;
        onSelectInitiative(initiatives[nextIndex]);
      } else if (event.key === 'ArrowLeft' && currentIndex !== -1) {
        const prevIndex = (currentIndex - 1 + initiatives.length) % initiatives.length;
        onSelectInitiative(initiatives[prevIndex]);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [initiative, initiatives, onClose, onSelectInitiative]);

  const currentIndex = initiative
    ? initiatives.findIndex((item) => item.id === initiative.id)
    : -1;
  const prevItem =
    currentIndex !== -1
      ? initiatives[(currentIndex - 1 + initiatives.length) % initiatives.length]
      : null;
  const nextItem =
    currentIndex !== -1
      ? initiatives[(currentIndex + 1) % initiatives.length]
      : null;

  return (
    <AnimatePresence>
      {initiative && (
        <motion.div
          key="project-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="initiative-detail-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 dark:bg-[#020510]/80 backdrop-blur-sm p-4 md:p-8"
          onClick={onClose}
        >
          <motion.div
            key="project-modal-panel"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-[#081129]/95 backdrop-blur-xl rounded-2xl border border-cyan-500/35 dark:border-cyan-400/30 shadow-[0_12px_45px_rgba(6,182,212,0.18)] dark:shadow-[0_0_45px_rgba(6,182,212,0.22),inset_0_1px_0_rgba(125,211,252,0.12)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky modal header bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-white/90 dark:bg-[#070E24]/90 backdrop-blur-md border-b border-cyan-500/20 dark:border-cyan-400/20">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-cyan-200/80 truncate">
                <span className="text-cyan-700 dark:text-cyan-300 font-medium">{initiative.category}</span>
                <span aria-hidden="true">·</span>
                <span>{initiative.organization}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{initiative.period}</span>
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={onClose}
                aria-label="Close initiative details"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-500/[0.12] border border-cyan-500/35 dark:border-cyan-400/30 text-cyan-800 dark:text-cyan-200 hover:bg-cyan-500/25 dark:hover:bg-cyan-400/25 hover:border-cyan-500/60 dark:hover:border-cyan-300/60 hover:text-slate-950 dark:hover:text-white shadow-[0_0_12px_rgba(34,211,238,0.15)] transition-all duration-150 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={initiative.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Architectural diagram header */}
                <div className="w-full h-60 sm:h-72 border-b border-cyan-500/20 dark:border-cyan-400/20 overflow-hidden">
                  <InitiativeVisual type={initiative.visualType} />
                </div>

                {/* Initiative body */}
                <div className="p-6 md:p-10 space-y-8">
                  <div>
                    <h2
                      id="initiative-detail-title"
                      className="font-display text-2xl md:text-4xl font-semibold tracking-tight text-slate-950 dark:text-white"
                    >
                      {initiative.title}
                    </h2>
                    <p className="mt-3 text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                      {initiative.summary}
                    </p>
                  </div>

                  {/* Highlights Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-cyan-500/20 dark:border-cyan-400/20">
                    {initiative.highlights.map((highlight) => (
                      <div key={highlight.label}>
                        <p className="font-display text-2xl md:text-3xl font-semibold text-cyan-700 dark:text-cyan-300 tabular-nums">
                          {highlight.value}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{highlight.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Context & Execution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <h3 className="font-display text-base font-semibold text-slate-950 dark:text-white">
                        Context & Scope
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {initiative.context}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display text-base font-semibold text-slate-950 dark:text-white">
                        Execution & Impact
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {initiative.execution}
                      </p>
                    </div>
                  </div>

                  {/* Role & Tools (unboxed typographic layout) */}
                  <div className="pt-6 border-t border-cyan-500/20 dark:border-cyan-400/20 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-xs text-cyan-700 dark:text-cyan-300/80 mb-1">Role</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{initiative.role}</p>
                    </div>
                    <div>
                      <p className="text-xs text-cyan-700 dark:text-cyan-300/80 mb-1">Tools & Competencies</p>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {initiative.toolsAndSkills.join(' · ')}
                      </p>
                    </div>
                  </div>

                  {/* Prev / Next Navigation */}
                  {prevItem && nextItem && (
                    <div className="pt-6 border-t border-cyan-500/20 dark:border-cyan-400/20 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => onSelectInitiative(prevItem)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                        <span className="truncate max-w-[160px] sm:max-w-none">{prevItem.title}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectInitiative(nextItem)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        <span className="truncate max-w-[160px] sm:max-w-none">{nextItem.title}</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
