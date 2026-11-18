import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Check, Copy, Mail, MapPin, Phone } from 'lucide-react';
import { PortfolioProfile } from '../data/portfolio';
import { WhatsAppIcon } from './SabotWidget';

interface ContactSectionProps {
  profile: PortfolioProfile;
}

const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

const INQUIRY_INTENTS = [
  {
    id: 'mt',
    label: 'Management Trainee',
    subject: 'Management Trainee Opportunity',
    message:
      'Hi Sabbir, I reviewed your portfolio and would like to discuss a Management Trainee opportunity with our team.',
  },
  {
    id: 'ops',
    label: 'Operations & Commercial',
    subject: 'Operations & Commercial Role',
    message:
      'Hi Sabbir, we are looking for support with operations, lead conversion, and customer execution—are you available to connect?',
  },
  {
    id: 'ai',
    label: 'AI Workflow Automation',
    subject: 'AI & Workflow Automation Collaboration',
    message:
      'Hi Sabbir, I would love to talk about automating our workflows and KPI reporting using n8n, Zapier, or AI tools.',
  },
];

function LinkedInIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function FacebookIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
    </svg>
  );
}

export function ContactSection({ profile }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState(INQUIRY_INTENTS[0]);

  const whatsappDigits = profile.phone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    selectedIntent.message
  )}`;
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    profile.email
  )}&su=${encodeURIComponent(selectedIntent.subject)}&body=${encodeURIComponent(
    selectedIntent.message
  )}`;
  const gmailDirectUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    profile.email
  )}`;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      id="contact"
      className="py-16 md:py-24 bg-slate-50/75 dark:bg-[#040816]/75 backdrop-blur-xs border-t border-cyan-500/20 dark:border-cyan-400/15 transition-colors duration-200"
    >
      <div className="max-w-[1200px] mx-auto px-6 space-y-12">
        {/* Editorial Intro + Direct Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <p className="text-xs font-medium text-cyan-700 dark:text-cyan-300">
                {profile.availability}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-slate-950 dark:text-white text-balance">
                Let’s connect on your next operations or commercial goal.
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-xl">
                Open to Management Trainee, Operations, Commercial Leadership, and AI Automation opportunities across Bangladesh and remote teams.
              </p>
            </div>

            {/* Role-Based Quick Inquiry Composer */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/[0.08] via-blue-500/[0.05] to-indigo-500/[0.08] dark:from-cyan-500/[0.08] dark:via-blue-600/[0.05] dark:to-indigo-500/[0.08] backdrop-blur-md border border-cyan-500/30 dark:border-cyan-400/25 shadow-[0_6px_26px_rgba(6,182,212,0.08)] dark:shadow-[0_0_26px_rgba(6,182,212,0.1),inset_0_1px_0_rgba(125,211,252,0.1)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-medium text-cyan-800 dark:text-cyan-200/80">
                  Quick Inquiry Topic
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {INQUIRY_INTENTS.map((intent) => {
                    const isSelected = selectedIntent.id === intent.id;
                    return (
                      <button
                        key={intent.id}
                        type="button"
                        onClick={() => setSelectedIntent(intent)}
                        aria-pressed={isSelected}
                        className={`px-2.5 py-1 text-xs rounded-md border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-cyan-500/70 dark:border-cyan-300/70 bg-cyan-500/15 dark:bg-cyan-400/20 text-cyan-800 dark:text-cyan-200 font-medium shadow-[0_0_14px_rgba(34,211,238,0.2)]'
                            : 'border-cyan-500/25 dark:border-cyan-400/20 bg-cyan-500/[0.05] text-slate-700 dark:text-slate-300 hover:border-cyan-500/50 dark:hover:border-cyan-300/45 hover:text-slate-950 dark:hover:text-white'
                        }`}
                      >
                        {intent.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-white/70 dark:bg-[#040816]/60 border border-cyan-500/25 dark:border-cyan-400/20 rounded-xl p-3">
                “{selectedIntent.message}”
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <motion.a
                  href={gmailComposeUrl}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white dark:text-slate-950 bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-400 hover:from-cyan-400 hover:to-blue-500 dark:hover:from-cyan-300 dark:hover:to-blue-300 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.28)] transition-all"
                >
                  <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Send Tailored Email</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </motion.a>

                <motion.a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-500/[0.12] backdrop-blur-xs border border-emerald-500/35 dark:border-emerald-400/35 rounded-lg shadow-[0_0_16px_rgba(16,185,129,0.14)] hover:border-emerald-500/70 dark:hover:border-emerald-300/70 hover:bg-emerald-500/[0.2] transition-all"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>Send on WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </motion.a>
              </div>
            </div>
          </div>

          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.18, ease: EASE_EDITORIAL }}
            className="lg:col-span-5 bg-gradient-to-br from-blue-500/[0.08] via-indigo-500/[0.06] to-cyan-500/[0.08] backdrop-blur-md border border-cyan-500/30 dark:border-cyan-400/25 hover:border-cyan-500/60 dark:hover:border-cyan-300/50 rounded-2xl p-6 space-y-5 shadow-[0_6px_28px_rgba(6,182,212,0.08)] dark:shadow-[0_0_28px_rgba(6,182,212,0.1),inset_0_1px_0_rgba(125,211,252,0.1)] hover:shadow-[0_10px_34px_rgba(6,182,212,0.16)] dark:hover:shadow-[0_0_34px_rgba(34,211,238,0.18)] transition-all duration-200"
          >
            <div>
              <p className="text-xs text-cyan-700 dark:text-cyan-300/80 mb-1">Direct Email</p>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <a
                  href={`mailto:${profile.email}`}
                  className="font-display text-base md:text-lg font-medium text-slate-950 dark:text-white hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors truncate"
                >
                  {profile.email}
                </a>
                <motion.button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                  whileTap={{ scale: 0.94 }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-cyan-800 dark:text-cyan-200 bg-cyan-500/[0.12] border border-cyan-500/35 dark:border-cyan-400/30 rounded-md hover:bg-cyan-500/20 dark:hover:bg-cyan-400/20 hover:border-cyan-500/60 dark:hover:border-cyan-300/60 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer shrink-0 overflow-hidden"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copied ? (
                      <motion.span
                        key="copied"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.14 }}
                        className="inline-flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-300" aria-hidden="true" />
                        <span>Copied</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.14 }}
                        className="inline-flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Copy</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>

            <div className="pt-4 border-t border-cyan-500/20 dark:border-cyan-400/15 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Phone &amp; WhatsApp</p>
                <a
                  href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-1.5 text-sm font-mono font-medium text-slate-900 dark:text-slate-100 tabular-nums hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-600/80 dark:text-cyan-400/80 shrink-0" aria-hidden="true" />
                  <span>{profile.phone}</span>
                </a>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Location</p>
                <p className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                  <MapPin className="w-3.5 h-3.5 text-cyan-600/80 dark:text-cyan-400/80 shrink-0" aria-hidden="true" />
                  <span>{profile.location}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Social & Direct Channel Icon Bar */}
        <div className="pt-8 border-t border-cyan-500/20 dark:border-cyan-400/15 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Reach out directly via your preferred channel
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <motion.a
              href={gmailDirectUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Email ${profile.name} via Gmail (${profile.email})`}
              title={`Email via Gmail: ${profile.email}`}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 24 }}
              className="w-11 h-11 rounded-xl bg-cyan-500/[0.08] backdrop-blur-md border border-cyan-500/35 dark:border-cyan-400/30 text-cyan-700 dark:text-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.12)] hover:border-cyan-500/75 dark:hover:border-cyan-300/70 hover:bg-cyan-500/15 dark:hover:bg-cyan-400/15 hover:text-cyan-800 dark:hover:text-cyan-200 transition-all flex items-center justify-center"
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
            </motion.a>

            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`WhatsApp ${profile.name} (${profile.phone})`}
              title={`WhatsApp: ${profile.phone}`}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 24 }}
              className="w-11 h-11 rounded-xl bg-emerald-500/[0.08] backdrop-blur-md border border-emerald-500/35 dark:border-emerald-400/30 text-emerald-700 dark:text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.12)] hover:border-emerald-500/75 dark:hover:border-emerald-300/70 hover:bg-emerald-500/15 dark:hover:bg-emerald-400/15 hover:text-emerald-800 dark:hover:text-emerald-200 transition-all flex items-center justify-center"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </motion.a>

            <motion.a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${profile.name} on LinkedIn`}
              title="LinkedIn Profile"
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 24 }}
              className="w-11 h-11 rounded-xl bg-sky-500/[0.08] backdrop-blur-md border border-sky-500/35 dark:border-sky-400/30 text-sky-700 dark:text-sky-300 shadow-[0_0_16px_rgba(56,189,248,0.12)] hover:border-sky-500/75 dark:hover:border-sky-300/70 hover:bg-sky-500/15 dark:hover:bg-sky-400/15 hover:text-sky-800 dark:hover:text-sky-200 transition-all flex items-center justify-center"
            >
              <LinkedInIcon className="w-5 h-5" />
            </motion.a>

            <motion.a
              href={profile.facebookUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${profile.name} on Facebook`}
              title="Facebook Profile"
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 24 }}
              className="w-11 h-11 rounded-xl bg-indigo-500/[0.08] backdrop-blur-md border border-indigo-500/35 dark:border-indigo-400/30 text-indigo-700 dark:text-indigo-300 shadow-[0_0_16px_rgba(99,102,241,0.14)] hover:border-indigo-500/75 dark:hover:border-indigo-300/70 hover:bg-indigo-500/15 dark:hover:bg-indigo-400/15 hover:text-indigo-800 dark:hover:text-indigo-200 transition-all flex items-center justify-center"
            >
              <FacebookIcon className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
