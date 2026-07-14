'use client';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/app/lib/hooks';

type Blob = {
  className: string;
  color: string;
  duration: number;
  delay: number;
};

const blobs: Blob[] = [
  {
    className: 'top-[-12%] left-[-8%] w-[42vw] h-[42vw] max-w-[600px] max-h-[600px]',
    color: 'rgba(251, 113, 133, 0.14)',
    duration: 28,
    delay: 0,
  },
  {
    className: 'top-[18%] right-[-12%] w-[38vw] h-[38vw] max-w-[520px] max-h-[520px]',
    color: 'rgba(244, 63, 94, 0.12)',
    duration: 34,
    delay: 4,
  },
  {
    className: 'bottom-[-18%] left-[28%] w-[46vw] h-[46vw] max-w-[660px] max-h-[660px]',
    color: 'rgba(225, 29, 72, 0.09)',
    duration: 40,
    delay: 8,
  },
];

const orbs = [
  { className: 'top-[15%] left-[18%] w-2 h-2', duration: 14, delay: 0 },
  { className: 'top-[35%] right-[22%] w-1.5 h-1.5', duration: 18, delay: 2 },
  { className: 'top-[60%] left-[12%] w-1 h-1', duration: 16, delay: 5 },
  { className: 'top-[72%] right-[30%] w-2 h-2', duration: 20, delay: 3 },
  { className: 'top-[48%] left-[46%] w-1.5 h-1.5', duration: 22, delay: 7 },
];

/**
 * Animated aurora background: slow-drifting colored blobs plus floating light
 * orbs, sitting behind all content. Motion is disabled for reduced-motion users
 * (a static gradient wash remains).
 */
const LiquidBackground = () => {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[90px] ${blob.className}`}
          style={{ background: blob.color }}
          animate={
            prefersReduced
              ? undefined
              : {
                  x: [0, 40, -30, 0],
                  y: [0, -30, 40, 0],
                  scale: [1, 1.12, 0.94, 1],
                }
          }
          transition={{
            duration: blob.duration,
            delay: blob.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {!prefersReduced &&
        orbs.map((orb, i) => (
          <motion.span
            key={`orb-${i}`}
            className={`absolute rounded-full bg-rose-300/40 blur-[1px] shadow-[0_0_10px_rgba(225,29,72,0.25)] ${orb.className}`}
            animate={{ y: [0, -28, 0], opacity: [0.1, 0.35, 0.1] }}
            transition={{
              duration: orb.duration,
              delay: orb.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
    </div>
  );
};

export default LiquidBackground;
