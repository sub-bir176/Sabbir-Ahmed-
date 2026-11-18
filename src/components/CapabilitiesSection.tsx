import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CAPABILITIES } from '../data/portfolio';

const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

const SKILL_PROOF_MAP: Record<string, string> = {
  'Customer Relationship Management (CRM)':
    'Applied at EduTune to manage inbound & outbound student pipelines from inquiry to enrollment.',
  'Retail & Telesales Execution':
    'Practiced at Twelve Clothing Limited driving daily consultative sales targets and repeat customer care.',
  'Lead Conversion':
    'Tailored student and parent advisory scripts at EduTune to turn inquiries into confirmed enrollments.',
  'Cross-Functional Collaboration':
    'Coordinated across academic, support, and admin teams at EduTune and peak shifts at PizzaBurg.',
  'Conflict Resolution':
    'Resolved real-time customer concerns and peak-hour team coordination as Peer Leader at PizzaBurg.',
  'n8n, Zapier, Make & Power Automate':
    'Built multi-step operational automations during the 300-hour DYD AI Basic Technology Training.',
  'Microsoft Excel & Google Sheets':
    'Automated formula workflows, data preprocessing, and executive KPI reporting sheets.',
  'AI Prompt Engineering':
    'Engineered structured prompts for ChatGPT Advanced Data Analysis, Copilot, and Gemini insights.',
  'AI Data Insights & KPI Reporting':
    'Combined spreadsheet pipelines with LLM sentiment analysis and automated executive summaries.',
  'Python (Basic)':
    'Completed Advanced Python Programming Course under Bangladesh Computer Council (BCC) EDGE Program.',
  'HTML / CSS / JavaScript (Basic)':
    'Computer Science & Engineering foundation for building responsive interfaces and interactive prototypes.',
  'Google Workspace & MS Office Suite':
    'Daily operational documentation, reporting templates, and cross-team coordination.',
  'Canva & CapCut':
    'Designed visual campaign materials, product collateral, and short-form digital media assets.',
  'Bengali (Native) · English (Professional)':
    'Bilingual client advisory, consultative retail communication, and executive reporting.',
};

export function CapabilitiesSection() {
  const [selectedSkill, setSelectedSkill] = useState<string>(
    'n8n, Zapier, Make & Power Automate'
  );

  return (
    <section
      id="capabilities"
      className="py-16 md:py-24 bg-white/75 dark:bg-[#070E24]/65 backdrop-blur-xs border-y border-cyan-500/20 dark:border-cyan-400/15 transition-colors duration-200"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-slate-950 dark:text-white text-balance">
                Core Skills &amp; Operational Capabilities
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Combining a Computer Science &amp; Engineering background with frontline commercial execution and modern AI workflow automation. Click any skill on the right to inspect how it is applied.
              </p>
            </div>

            {/* Interactive Skill Proof Inspector Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSkill}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: EASE_EDITORIAL }}
                className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/[0.1] via-blue-500/[0.06] to-teal-500/[0.08] backdrop-blur-md border border-cyan-500/35 dark:border-cyan-400/35 shadow-[0_6px_26px_rgba(6,182,212,0.1)] dark:shadow-[0_0_28px_rgba(6,182,212,0.12),inset_0_1px_0_rgba(125,211,252,0.12)] space-y-2"
              >
                <p className="text-[11px] font-mono text-cyan-700 dark:text-cyan-300">
                  Applied Context
                </p>
                <h3 className="font-display text-base font-semibold text-slate-950 dark:text-white">
                  {selectedSkill}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {SKILL_PROOF_MAP[selectedSkill] ||
                    'Applied across operations, analytics, and technical execution.'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-7 divide-y divide-cyan-500/20 dark:divide-cyan-400/15 border-y border-cyan-500/20 dark:border-cyan-400/15">
            {CAPABILITIES.map((item, idx) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.35,
                  delay: idx * 0.06,
                  ease: EASE_EDITORIAL,
                }}
                className="group py-7 first:pt-6 last:pb-6 px-4 -mx-4 rounded-xl border border-transparent hover:border-cyan-500/25 dark:hover:border-cyan-400/20 hover:bg-cyan-500/[0.05] dark:hover:bg-cyan-500/[0.04] transition-all duration-150"
              >
                <h3 className="font-display text-lg md:text-xl font-semibold tracking-tight text-slate-950 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                  <span className="font-mono text-sm font-medium text-cyan-600 dark:text-cyan-400 mr-2.5 tabular-nums">
                    {item.number}
                  </span>
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm md:text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {item.focusAreas.map((skill) => {
                    const isSelected = selectedSkill === skill;
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => setSelectedSkill(skill)}
                        onMouseEnter={() => setSelectedSkill(skill)}
                        aria-pressed={isSelected}
                        className={`px-2.5 py-1 text-xs rounded-md border backdrop-blur-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'border-cyan-500/70 dark:border-cyan-300/70 bg-cyan-500/15 dark:bg-cyan-400/20 text-cyan-800 dark:text-cyan-200 font-medium shadow-[0_0_14px_rgba(34,211,238,0.2)]'
                            : 'border-cyan-500/25 dark:border-cyan-400/20 bg-cyan-500/[0.05] dark:bg-cyan-500/[0.06] text-slate-700 dark:text-slate-300 hover:border-cyan-500/50 dark:hover:border-cyan-300/45 hover:bg-cyan-500/10 dark:hover:bg-cyan-400/12 hover:text-slate-950 dark:hover:text-white'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
