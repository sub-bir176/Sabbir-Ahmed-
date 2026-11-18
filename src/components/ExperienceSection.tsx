import { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  MotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { EXPERIENCE, TRAININGS } from '../data/portfolio';

const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

type ExperienceView = 'all' | 'work' | 'training';

const VIEW_TABS: { id: ExperienceView; label: string }[] = [
  { id: 'all', label: 'All Tracks' },
  { id: 'work', label: 'Work Experience' },
  { id: 'training', label: 'Training & Certifications' },
];

function TimelineNode({
  progress,
  threshold,
}: {
  progress: MotionValue<number>;
  threshold: number;
}) {
  const start = Math.max(0, threshold - 0.12);
  const scale = useTransform(progress, [start, threshold], [0.9, 1.18]);
  const opacity = useTransform(progress, [start, threshold], [0.45, 1]);

  return (
    <motion.span
      aria-hidden="true"
      style={{ scale, opacity }}
      className="absolute -left-[22px] sm:-left-[30px] top-7 w-3 h-3 rounded-full bg-[#F8FBFF] dark:bg-[#050917] border-2 border-cyan-500 dark:border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)] group-hover:bg-cyan-500 dark:group-hover:bg-cyan-400 transition-colors duration-150"
    />
  );
}

function WorkExperienceTrack() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.72', 'end 0.72'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      key="work-track"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: EASE_EDITORIAL }}
    >
      <h3 className="font-display text-xl md:text-2xl font-semibold tracking-tight text-slate-950 dark:text-white mb-8">
        Work Experience
      </h3>

      <div ref={timelineRef} className="relative pl-6 sm:pl-8 space-y-4">
        {/* Base vertical rail */}
        <div
          aria-hidden="true"
          className="absolute left-2 top-3 bottom-3 w-[2px] bg-cyan-500/25 dark:bg-cyan-400/20 rounded-full"
        />
        {/* Scroll-driven active fill (GPU scaleY + spring for identical down/up smoothness) */}
        <motion.div
          aria-hidden="true"
          style={{ scaleY: smoothProgress }}
          className="absolute left-2 top-3 bottom-3 w-[2px] bg-gradient-to-b from-cyan-500 via-blue-500 to-teal-500 dark:from-cyan-400 dark:via-blue-500 dark:to-teal-400 shadow-[0_0_12px_rgba(34,211,238,0.5)] rounded-full origin-top will-change-transform"
        />

        {EXPERIENCE.map((item, idx) => {
          const nodeThreshold =
            EXPERIENCE.length > 1
              ? 0.08 + (idx / (EXPERIENCE.length - 1)) * 0.82
              : 0.15;

          return (
            <motion.div
              key={`${item.company}-${item.period}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.35,
                delay: idx * 0.06,
                ease: EASE_EDITORIAL,
              }}
              className="group relative py-6 px-5 rounded-xl border border-cyan-500/25 dark:border-cyan-400/25 bg-gradient-to-br from-cyan-500/[0.07] via-blue-500/[0.05] to-indigo-500/[0.08] dark:from-cyan-500/[0.08] dark:via-blue-600/[0.05] dark:to-indigo-500/[0.08] backdrop-blur-md shadow-[0_4px_24px_rgba(6,182,212,0.08)] dark:shadow-[0_0_24px_rgba(6,182,212,0.08),inset_0_1px_0_rgba(125,211,252,0.08)] hover:border-cyan-500/65 dark:hover:border-cyan-300/60 hover:from-cyan-500/[0.11] hover:to-indigo-500/[0.11] hover:shadow-[0_8px_32px_rgba(6,182,212,0.16)] dark:hover:shadow-[0_0_32px_rgba(34,211,238,0.18)] grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start transition-[color,background-color,border-color,box-shadow] duration-150"
            >
              {/* Timeline Node */}
              <TimelineNode
                progress={smoothProgress}
                threshold={nodeThreshold}
              />

              <div className="md:col-span-3 font-mono text-xs md:text-sm text-cyan-700 dark:text-cyan-300/80 tabular-nums pt-0.5">
                {item.period}
              </div>
              <div className="md:col-span-4">
                <h4 className="font-display text-base md:text-lg font-semibold text-slate-950 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                  {item.role}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  {item.company}
                </p>
              </div>
              <ul className="md:col-span-5 space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 list-disc pl-4 marker:text-cyan-600/70 dark:marker:text-cyan-400/70">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function ExperienceSection() {
  const [activeView, setActiveView] = useState<ExperienceView>('all');

  const showWork = activeView === 'all' || activeView === 'work';
  const showTraining = activeView === 'all' || activeView === 'training';

  return (
    <section id="experience" className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 space-y-16">
        {/* Track Filter Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Experience &amp; Training
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-300">
              Frontline operations, consultative retail sales, AI automation training, and certifications.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter experience and training"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-cyan-500/[0.06] backdrop-blur-md border border-cyan-500/30 dark:border-cyan-400/25 shadow-[0_0_20px_rgba(6,182,212,0.08)] rounded-lg self-start md:self-auto"
          >
            {VIEW_TABS.map((tab) => {
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveView(tab.id)}
                  aria-pressed={isActive}
                  className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-cyan-800 dark:text-cyan-200'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="experience-view-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-0 bg-cyan-500/15 dark:bg-cyan-400/18 border border-cyan-500/45 dark:border-cyan-400/40 rounded-md shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Work Experience with Scroll-Driven Vertical Timeline */}
          {showWork && <WorkExperienceTrack />}

          {/* Training & Certifications */}
          {showTraining && (
            <motion.div
              key="training-track"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: EASE_EDITORIAL }}
            >
              <h3 className="font-display text-xl md:text-2xl font-semibold tracking-tight text-slate-950 dark:text-white mb-6">
                Training &amp; Certifications
              </h3>

              <div className="divide-y divide-cyan-500/20 dark:divide-cyan-400/15 border-y border-cyan-500/20 dark:border-cyan-400/15">
                {TRAININGS.map((training, idx) => (
                  <motion.div
                    key={training.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.35,
                      delay: idx * 0.06,
                      ease: EASE_EDITORIAL,
                    }}
                    whileHover={{ x: 4 }}
                    className="group py-7 px-4 -mx-4 rounded-xl border border-transparent grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start hover:border-cyan-500/25 dark:hover:border-cyan-400/20 hover:bg-cyan-500/[0.05] transition-all duration-150"
                  >
                    <div className="md:col-span-3 font-mono text-xs md:text-sm text-cyan-700 dark:text-cyan-300/80 tabular-nums pt-0.5">
                      {training.period}
                    </div>
                    <div className="md:col-span-4 flex items-start gap-3.5">
                      {training.icon && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.15, ease: EASE_EDITORIAL }}
                          className={`w-16 h-9 rounded-lg border border-cyan-500/35 dark:border-cyan-400/30 shadow-[0_0_12px_rgba(34,211,238,0.12)] bg-white overflow-hidden shrink-0 mt-0.5 flex items-center justify-center ${
                            training.iconFit === 'contain' ? 'p-1' : 'px-1.5'
                          }`}
                        >
                          <img
                            src={training.icon}
                            alt={training.iconAlt || training.issuer}
                            referrerPolicy="no-referrer"
                            className={`w-full h-full object-center ${
                              training.iconFit === 'contain' ? 'object-contain' : 'object-cover'
                            }`}
                          />
                        </motion.div>
                      )}
                      <div>
                        <h4 className="font-display text-base md:text-lg font-semibold text-slate-950 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                          {training.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {training.issuer}
                        </p>
                      </div>
                    </div>
                    <ul className="md:col-span-5 space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 list-disc pl-4 marker:text-cyan-600/70 dark:marker:text-cyan-400/70">
                      {training.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
