'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import VideoCard from '../components/VideoCard';
import BackToTop from '../components/BackToTop';
import CursorSpotlight from '../components/CursorSpotlight';
import Footer from '../components/Footer';
import { getVideosByCategory } from '../lib/videos';
import { CODE_REPO_LINK } from '../lib/constants';
import { trackPageView, trackSocialClick } from '../lib/analytics';

export default function VideosPage() {
  const groups = getVideosByCategory();

  useEffect(() => {
    trackPageView('videos', 'Videos · Rajesh K');
  }, []);

  return (
    <div className="min-h-screen font-[family-name:var(--font-poppins)] text-zinc-900 pb-16">
      <CursorSpotlight />
      <BackToTop />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/60 backdrop-saturate-150 border-b border-white/50 shadow-[0_4px_30px_rgba(31,38,80,0.08)]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors font-[family-name:var(--font-inter)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to portfolio
          </Link>
          <Link href="/" className="text-lg font-bold gradient-text font-[family-name:var(--font-inter)]">
            RK
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="glass-bloom mb-12 lg:mb-16"
        >
          <p className="text-rose-700 text-sm font-medium mb-3 font-[family-name:var(--font-inter)]">
            Learning in public
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold gradient-text font-[family-name:var(--font-inter)] mb-4">
            Tech Videos
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-xl mb-6">
            Short, practical videos on data structures, algorithms and system
            design — posted on YouTube and Instagram. Most come with the full
            implementation code on GitHub.
          </p>
          <a
            href={CODE_REPO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackSocialClick('code_repo')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 text-white text-sm px-6 py-2.5 rounded-full transition-all hover:shadow-[0_0_20px_rgba(225,29,72,0.35)] font-medium font-[family-name:var(--font-inter)]"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            View implementation code
          </a>
        </motion.div>

        {/* Categories */}
        {groups.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <p className="text-zinc-700 font-medium mb-1">Videos coming soon.</p>
            <p className="text-zinc-500 text-sm">
              New tech content is on its way — check back shortly.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-14">
            {groups.map((group) => (
              <section key={group.name}>
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 font-[family-name:var(--font-inter)]">
                    {group.name}
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">{group.blurb}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {group.videos.map((video, index) => (
                    <VideoCard key={video.id} video={video} index={index} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
