'use client';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from 'framer-motion';
import { useRef } from 'react';
import { usePrefersReducedMotion, useIsDesktop } from '@/app/lib/hooks';

type LiquidGlassProps = {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees on pointer move. Set 0 to disable tilt. */
  tilt?: number;
  /** Additional framer-motion props (initial/animate/whileInView etc). */
  motionProps?: HTMLMotionProps<'div'>;
};

/**
 * Reusable Apple-style liquid-glass surface with optional cursor-reactive tilt
 * and a pointer-tracked specular bloom. Falls back to a static glass panel when
 * the user prefers reduced motion or is not on a desktop pointer device.
 */
const LiquidGlass = ({
  children,
  className = '',
  tilt = 6,
  motionProps,
}: LiquidGlassProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktop();
  const interactive = tilt > 0 && isDesktop && !prefersReduced;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [tilt, -tilt]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-tilt, tilt]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    px.set(x);
    py.set(y);
    ref.current.style.setProperty('--pointer-x', `${x * 100}%`);
    ref.current.style.setProperty('--pointer-y', `${y * 100}%`);
  };

  const handleLeave = () => {
    if (!interactive) return;
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={
        interactive
          ? {
              rotateX,
              rotateY,
              transformPerspective: 900,
              transformStyle: 'preserve-3d',
            }
          : undefined
      }
      className={`liquid-glass ${className}`}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default LiquidGlass;
