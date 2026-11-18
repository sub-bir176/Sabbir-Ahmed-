import { MouseEvent, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { HERO_METRICS, PortfolioProfile } from '../data/portfolio';
import { ResilientImage } from './ResilientImage';

interface HeroProps {
  profile: PortfolioProfile;
}

function AnimatedMetricValue({ value }: { value: string }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    if (value === '300 Hours') {
      let frame = 0;
      const totalFrames = 24;
      const timer = window.setInterval(() => {
        frame++;
        const current = Math.round((frame / totalFrames) * 300);
        setDisplay(`${current} Hours`);
        if (frame >= totalFrames) {
          clearInterval(timer);
          setDisplay(value);
        }
      }, 24);
      return () => clearInterval(timer);
    }

    if (value === 'Top 25 / 4,000+') {
      let frame = 0;
      const totalFrames = 24;
      const timer = window.setInterval(() => {
        frame++;
        const ratio = frame / totalFrames;
        const pool = Math.round(ratio * 4000).toLocaleString();
        const top = Math.max(1, Math.round(ratio * 25));
        setDisplay(`Top ${top} / ${pool}+`);
        if (frame >= totalFrames) {
          clearInterval(timer);
          setDisplay(value);
        }
      }, 24);
      return () => clearInterval(timer);
    }

    setDisplay(value);
  }, [value]);

  return <>{display}</>;
}

interface TypewriterTextProps {
  text: string;
  startDelayMs?: number;
  msPerStep?: number;
  charsPerStep?: number;
  balanced?: boolean;
  cursorClassName?: string;
}

function TypewriterText({
  text,
  startDelayMs = 0,
  msPerStep = 22,
  charsPerStep = 1,
  balanced = false,
  cursorClassName = 'bg-[#38BDF8]',
}: TypewriterTextProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState<'waiting' | 'typing' | 'done'>('waiting');

  useEffect(() => {
    const prefersReduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      setVisibleCount(text.length);
      setPhase('done');
      return;
    }

    setVisibleCount(0);
    setPhase('waiting');

    let intervalId = 0;
    const startTimer = window.setTimeout(() => {
      setPhase('typing');
      let count = 0;
      intervalId = window.setInterval(() => {
        count = Math.min(text.length, count + charsPerStep);
        setVisibleCount(count);
        if (count >= text.length) {
          window.clearInterval(intervalId);
          setPhase('done');
        }
      }, msPerStep);
    }, startDelayMs);

    return () => {
      window.clearTimeout(startTimer);
      window.clearInterval(intervalId);
    };
  }, [text, startDelayMs, msPerStep, charsPerStep]);

  const typed = text.slice(0, visibleCount);
  const wrapClass = balanced ? 'block w-full text-balance' : 'block w-full';

  return (
    <span className="relative block w-full">
      {/* Invisible reserve keeps exact multi-line height so layout never shifts while typing */}
      <span className={`${wrapClass} invisible select-none`} aria-hidden="true">
        {text}
      </span>

      <span className={`${wrapClass} absolute inset-0`} aria-hidden="true">
        {typed}
        {phase === 'typing' && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.65, repeat: Infinity, ease: 'linear' }}
            className={`inline-block align-baseline w-[2px] h-[0.92em] ml-[2px] translate-y-[0.08em] rounded-full ${cursorClassName}`}
          />
        )}
      </span>

      <span className="sr-only">{text}</span>
    </span>
  );
}

export function Hero({ profile }: HeroProps) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handlePortraitMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: Number((-y * 5).toFixed(2)),
      rotateY: Number((x * 5).toFixed(2)),
    });
  };

  const handlePortraitLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleJump = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="top" className="pt-12 pb-14 md:pt-16 md:pb-20">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* 2-Column Hero Split with balanced height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between py-2">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs font-medium tracking-normal text-cyan-700 dark:text-cyan-300/90 mb-5"
              >
                {profile.kicker}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="font-display text-[clamp(2.25rem,4.2vw,3.6rem)] font-semibold leading-[1.06] tracking-tight text-slate-950 dark:text-white max-w-2xl"
              >
                <TypewriterText
                  text={profile.headline}
                  startDelayMs={100}
                  msPerStep={20}
                  charsPerStep={1}
                  balanced
                  cursorClassName="bg-cyan-600 dark:bg-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                />
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="mt-6 text-base md:text-[17px] leading-[1.65] text-slate-600 dark:text-slate-300 max-w-xl"
              >
                <TypewriterText
                  text={profile.bio}
                  startDelayMs={1320}
                  msPerStep={16}
                  charsPerStep={3}
                  cursorClassName="bg-blue-600 dark:bg-[#60A5FA] shadow-[0_0_8px_rgba(96,165,250,0.75)]"
                />
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap items-center gap-3.5"
            >
              <motion.a
                href="#work"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-500/85 dark:to-blue-600/90 border border-cyan-400/50 dark:border-cyan-300/45 rounded-lg shadow-[0_0_24px_rgba(6,182,212,0.3)] hover:shadow-[0_0_34px_rgba(34,211,238,0.5)] hover:from-cyan-400 hover:to-blue-500 transition-all duration-150 whitespace-nowrap shrink-0"
              >
                <span>View Selected Initiatives</span>
                <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
              </motion.a>
            </motion.div>
          </div>

          <div
            className="lg:col-span-5 relative group"
            style={{ perspective: '1000px' }}
            onMouseMove={handlePortraitMove}
            onMouseLeave={handlePortraitLeave}
          >
            {/* Primary animated cyan/electric-blue neon aura behind portrait */}
            <motion.span
              aria-hidden="true"
              animate={{
                opacity: [0.55, 0.88, 0.55],
                scale: [0.98, 1.03, 0.98],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="pointer-events-none block absolute -inset-3 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  'linear-gradient(135deg, rgba(0, 229, 255, 0.55) 0%, rgba(37, 99, 235, 0.62) 50%, rgba(0, 255, 198, 0.45) 100%)',
              }}
            />

            {/* Secondary slow-drifting neon highlight behind portrait */}
            <motion.span
              aria-hidden="true"
              animate={{
                opacity: [0.35, 0.7, 0.35],
                x: [-6, 6, -6],
                y: [4, -6, 4],
              }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="pointer-events-none block absolute -inset-2 rounded-3xl blur-xl"
              style={{
                background:
                  'radial-gradient(circle at 30% 25%, rgba(56, 189, 248, 0.55), transparent 55%), radial-gradient(circle at 75% 80%, rgba(37, 99, 235, 0.55), transparent 60%)',
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
              }}
              transition={{
                opacity: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                rotateX: { type: 'spring', stiffness: 260, damping: 24 },
                rotateY: { type: 'spring', stiffness: 260, damping: 24 },
              }}
              className="relative z-10 h-full min-h-[340px] lg:min-h-[440px] max-h-[500px] rounded-2xl overflow-hidden border border-cyan-500/45 dark:border-cyan-400/35 bg-[#0A2558] shadow-[0_0_28px_rgba(37,99,235,0.28),0_0_56px_rgba(0,229,255,0.2)]"
            >
              <ResilientImage
                src={profile.heroImage}
                alt={profile.heroImageAlt}
                fallbackTitle={profile.name}
                className="w-full h-full object-cover object-top"
              />
            </motion.div>
          </div>
        </div>

        {/* Full-width 4-column interactive quantitative proof strip below the split */}
        <div className="mt-12 pt-8 border-t border-cyan-500/20 dark:border-cyan-400/15 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {HERO_METRICS.map((metric, idx) => (
            <motion.button
              key={metric.label}
              type="button"
              onClick={() => handleJump(metric.targetId)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.38,
                delay: 0.16 + idx * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="group text-left p-4 rounded-xl bg-gradient-to-br from-cyan-500/[0.08] via-blue-500/[0.06] to-indigo-500/[0.08] dark:from-cyan-500/[0.08] dark:via-blue-600/[0.05] dark:to-indigo-500/[0.08] backdrop-blur-md border border-cyan-500/30 dark:border-cyan-400/25 shadow-[0_4px_20px_rgba(6,182,212,0.08)] dark:shadow-[0_0_20px_rgba(6,182,212,0.08),inset_0_1px_0_rgba(125,211,252,0.1)] hover:border-cyan-500/70 dark:hover:border-cyan-300/60 hover:from-cyan-400/[0.14] hover:to-blue-500/[0.12] hover:shadow-[0_6px_28px_rgba(6,182,212,0.18)] dark:hover:shadow-[0_0_28px_rgba(34,211,238,0.2)] transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-xl md:text-2xl font-semibold tracking-tight text-slate-950 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 tabular-nums transition-colors">
                  <AnimatedMetricValue value={metric.value} />
                </p>
                <ArrowUpRight
                  className="w-4 h-4 text-cyan-600/70 dark:text-cyan-400/60 opacity-70 group-hover:opacity-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-all shrink-0"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-0.5 text-xs md:text-sm text-slate-600 dark:text-slate-300/85">
                {metric.label}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
