'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import LearningHeader from '../components/LearningHeader';
import LearningFooter from '../components/LearningFooter';
import { getTopicSummaries } from '../lib/learning';
import { LEARNING_INTRO } from '../lib/constants';
import { trackPageView } from '../lib/analytics';

const TOPIC_META: Record<
  string,
  { href: string; accent: string; icon: React.ReactNode }
> = {
  tech: {
    href: '/learning-hub/tech',
    accent: 'from-rose-500/15 to-rose-700/5',
    icon: (
      <svg
        className="w-7 h-7 text-rose-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
  },
  finance: {
    href: '/learning-hub/finance',
    accent: 'from-rose-500/15 to-rose-700/5',
    icon: (
      <svg
        className="w-7 h-7 text-rose-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M3 17l6-6 4 4 8-8m0 0h-5m5 0v5"
        />
      </svg>
    ),
  },
};

export default function LearningHub() {
  const topics = getTopicSummaries();

  useEffect(() => {
    trackPageView('learning', 'Learning · Rajesh K');
  }, []);

  return (
    <div className="min-h-screen font-[family-name:var(--font-poppins)] text-zinc-900 pb-16">
      <LearningHeader backHref="/" backLabel="Back to portfolio" />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-12 lg:mb-16 max-w-2xl"
        >
          <h1 className="text-4xl sm:text-4xl lg:text-5xl font-extrabold gradient-text font-[family-name:var(--font-inter)] mb-5">
            Learn with me
          </h1>
          <div className="flex flex-col gap-1 text-zinc-600 leading-relaxed">
            <p className="text-sm">{LEARNING_INTRO}</p>
            <p className="text-md ">Aarambikkalaama!</p>
          </div>
        </motion.div>

        {/* Topic cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {topics.map((topic, i) => {
            const meta = TOPIC_META[topic.key];
            return (
              <motion.div
                key={topic.key}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + i * 0.1,
                  ease: 'easeOut',
                }}
              >
                <Link
                  href={meta.href}
                  className="group glass-card block h-full p-7 sm:p-8 cursor-pointer"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.accent} border border-white/60 flex items-center justify-center mb-5`}
                  >
                    {meta.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900 mb-2 font-[family-name:var(--font-inter)]">
                    {topic.title}
                  </h2>
                  <p className="text-sm text-zinc-600 leading-relaxed mb-5">
                    {topic.tagline}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500 font-[family-name:var(--font-inter)]">
                      {topic.videoCount} videos · {topic.categoryCount}{' '}
                      categories
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-700 group-hover:gap-2.5 transition-all font-[family-name:var(--font-inter)]">
                      Explore
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>

      <LearningFooter />
    </div>
  );
}
