import { motion } from 'motion/react';
import { EDUCATION, LEADERSHIP } from '../data/portfolio';

const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

export function EducationSection() {
  return (
    <section
      id="education"
      className="py-16 md:py-24 bg-white/75 dark:bg-[#070E24]/65 backdrop-blur-xs border-t border-cyan-500/20 dark:border-cyan-400/15 transition-colors duration-200"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Education & Extracurricular Leadership */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-slate-950 dark:text-white mb-8">
              Education
            </h2>

            <div className="divide-y divide-cyan-500/20 dark:divide-cyan-400/15 border-y border-cyan-500/20 dark:border-cyan-400/15">
              {EDUCATION.map((edu, idx) => (
                <motion.div
                  key={edu.degree}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.35,
                    delay: idx * 0.06,
                    ease: EASE_EDITORIAL,
                  }}
                  whileHover={{ x: 3 }}
                  className="group py-5 px-4 -mx-4 rounded-xl border border-transparent grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline hover:border-teal-500/25 dark:hover:border-teal-400/20 hover:bg-teal-500/[0.05] transition-all duration-150"
                >
                  <div className="sm:col-span-3 font-mono text-xs md:text-sm text-teal-700 dark:text-teal-300/80 tabular-nums">
                    {edu.period}
                  </div>
                  <div className="sm:col-span-9 space-y-1">
                    <h3 className="font-display text-base md:text-lg font-semibold text-slate-950 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                      {edu.degree}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{edu.institution}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">{edu.note}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-slate-950 dark:text-white mb-8">
              Extracurricular & Leadership
            </h2>

            <div className="space-y-6">
              {LEADERSHIP.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.35,
                    delay: idx * 0.07,
                    ease: EASE_EDITORIAL,
                  }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.99 }}
                  className="p-6 bg-gradient-to-br from-teal-500/[0.08] via-cyan-500/[0.05] to-blue-600/[0.08] backdrop-blur-md border border-teal-500/30 dark:border-teal-400/25 hover:border-teal-500/70 dark:hover:border-teal-300/60 shadow-[0_6px_26px_rgba(20,184,166,0.1)] dark:shadow-[0_0_26px_rgba(20,184,166,0.12),inset_0_1px_0_rgba(94,234,212,0.1)] hover:shadow-[0_10px_32px_rgba(20,184,166,0.18)] dark:hover:shadow-[0_0_32px_rgba(45,212,191,0.2)] rounded-2xl space-y-2 transition-all duration-150"
                >
                  <p className="text-xs font-medium text-teal-700 dark:text-teal-300">{item.organization}</p>
                  <h3 className="font-display text-base md:text-lg font-semibold text-slate-950 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
