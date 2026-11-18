import { motion, useScroll, useSpring } from 'motion/react';

export function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-50 h-[2px] bg-transparent"
    >
      <motion.div
        style={{ scaleX }}
        className="h-full w-full origin-left bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-300 shadow-[0_0_10px_rgba(34,211,238,0.65)]"
      />
    </div>
  );
}
