'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from 'framer-motion';
import {
  RESUME_LINK,
  SOCIAL_LINKS,
  PROFILE_SUMMARY,
} from '@/app/lib/constants';
import Photo from '../../assets/photo2.png';
import { trackSocialClick } from '../../lib/analytics';
import { usePrefersReducedMotion, useIsDesktop } from '@/app/lib/hooks';

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, delay: i * 0.15, ease: 'easeOut' as const },
  }),
};

const MainSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktop();
  const interactive = isDesktop && !prefersReduced;

  // Scroll-driven parallax for the photo
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const photoScrollY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  // Pointer-driven tilt/parallax for the photo
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [8, -8]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-8, 8]), {
    stiffness: 150,
    damping: 18,
  });

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width);
    pointerY.set((e.clientY - rect.top) / rect.height);
  };

  const handlePointerLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  return (
    <div ref={sectionRef} className="min-h-screen flex items-center pt-16">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16 w-full py-12">
        {/* Photo - shows on top on mobile */}
        <motion.div
          className="lg:order-2 flex-shrink-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={interactive ? { y: photoScrollY } : undefined}
        >
          <motion.div
            className="relative"
            onMouseMove={handlePointerMove}
            onMouseLeave={handlePointerLeave}
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
          >
            <Image
              src={Photo}
              alt="Rajesh K"
              className="relative w-[140px] h-[140px] lg:w-[340px] lg:h-[340px] rounded-full object-cover ring-1 ring-white/60 shadow-[0_20px_50px_rgba(31,38,80,0.18)]"
            />
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="lg:order-1 flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-5">
          <motion.p
            className="text-zinc-600 text-sm font-[family-name:var(--font-inter)]"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            Hey there!
          </motion.p>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold gradient-text font-[family-name:var(--font-inter)]"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Rajesh K
          </motion.h1>

          <motion.div
            className="flex items-center gap-3"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <span className="inline-block w-8 h-[2px] bg-rose-500" />
            <span className="text-base sm:text-lg text-zinc-700 font-[family-name:var(--font-inter)]">
              Software Engineer
            </span>
          </motion.div>

          <motion.p
            className="text-zinc-600 text-sm leading-relaxed max-w-md"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            {PROFILE_SUMMARY}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4 mt-2"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <a
              href={RESUME_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 text-white text-sm px-6 py-2.5 rounded-full transition-all hover:shadow-[0_0_20px_rgba(225,29,72,0.35)] font-medium font-[family-name:var(--font-inter)]"
              onClick={() => trackSocialClick('resume')}
            >
              View Resume
            </a>

            <Link
              href="/learning"
              className="glass-chip text-rose-700 hover:text-rose-800 text-sm px-5 py-2.5 flex items-center gap-2 font-medium font-[family-name:var(--font-inter)]"
              onClick={() => trackSocialClick('learning')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Explore Learning
            </Link>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1 text-zinc-600">
                <span className="text-3xl font-bold text-zinc-900 font-[family-name:var(--font-inter)]">
                  8
                </span>
                <span className="text-lg text-rose-500 font-bold">+</span>
                <span className="text-xs ml-1 max-w-[60px] leading-tight">
                  Years of experience
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-5 mt-4"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
          >
            {[
              {
                platform: 'linkedin',
                link: SOCIAL_LINKS.LINKEDIN,
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                ),
              },
              {
                platform: 'github',
                link: SOCIAL_LINKS.GITHUB,
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                ),
              },
              {
                platform: 'twitter',
                link: SOCIAL_LINKS.TWITTER,
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ),
              },
            ].map(({ link, platform, icon }) => (
              <button
                key={platform}
                className="text-zinc-500 hover:text-rose-600 transition-colors cursor-pointer"
                onClick={() => {
                  trackSocialClick(platform);
                  window.open(link);
                }}
                aria-label={platform}
              >
                {icon}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={interactive ? { opacity: indicatorOpacity } : undefined}
      >
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-[family-name:var(--font-inter)]">
          Scroll
        </span>
        <motion.div
          className="w-[1px] h-6 bg-gradient-to-b from-rose-400/60 to-transparent"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  );
};

export default MainSection;
