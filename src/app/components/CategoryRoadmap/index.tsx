'use client';
import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import LearningHeader from '../LearningHeader';
import LearningFooter from '../LearningFooter';
import {
  getTopicMeta,
  youtubeThumbnail,
  type TopicKey,
} from '@/app/lib/learning';
import { trackPageView, trackSectionClick } from '@/app/lib/analytics';
import { ANALYTICS_SECTIONS } from '@/app/lib/constants';

const CategoryRoadmap = ({
  topicKey,
  categorySlug,
}: {
  topicKey: TopicKey;
  categorySlug?: string;
}) => {
  const topic = useMemo(() => getTopicMeta(topicKey), [topicKey]);
  const active = useMemo(
    () => topic.groups.find((g) => g.slug === categorySlug) ?? topic.groups[0],
    [topic.groups, categorySlug]
  );

  useEffect(() => {
    if (active) {
      trackPageView(
        `learning_${topicKey}_${active.slug}`,
        `${active.name} · Learning · Rajesh K`
      );
    }
  }, [topicKey, active]);

  return (
    <div className="min-h-screen font-[family-name:var(--font-poppins)] text-zinc-900 pb-16">
      <LearningHeader backHref="/learning" backLabel="Learning" />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8 lg:mb-12"
        >
          <p className="text-rose-700 text-sm font-medium mb-3 font-[family-name:var(--font-inter)]">
            Learning roadmap
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold gradient-text font-[family-name:var(--font-inter)] mb-3">
            {topic.title}
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-xl">
            {topic.tagline}
          </p>
        </motion.div>

        {topic.groups.length === 0 || !active ? (
          <div className="glass-card p-10 text-center">
            <p className="text-zinc-700 font-medium mb-1">Videos coming soon.</p>
            <p className="text-zinc-500 text-sm">New content is on its way — check back shortly.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Sidebar (desktop) */}
            <aside className="hidden lg:block w-60 shrink-0">
              <nav className="sticky top-24 flex flex-col gap-1">
                {topic.groups.map((group) => {
                  const isActive = group.slug === active.slug;
                  return (
                    <Link
                      key={group.id}
                      href={`/learning/${topicKey}/${group.slug}`}
                      scroll={false}
                      className={`nav-glass text-left px-3.5 py-2.5 rounded-xl text-sm transition-colors font-[family-name:var(--font-inter)] ${
                        isActive
                          ? 'text-rose-800 font-semibold'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-between gap-2">
                        {group.name}
                        <span className="text-[11px] text-zinc-400">
                          {group.videos.length}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </aside>

            {/* Category pills (mobile) */}
            <div className="lg:hidden -mx-6 px-6 overflow-x-auto">
              <div className="flex gap-2 pb-1 w-max">
                {topic.groups.map((group) => (
                  <Link
                    key={group.id}
                    href={`/learning/${topicKey}/${group.slug}`}
                    scroll={false}
                    className={`glass-chip whitespace-nowrap px-3 py-1.5 text-xs font-medium font-[family-name:var(--font-inter)] ${
                      group.slug === active.slug ? 'text-rose-800' : 'text-zinc-600'
                    }`}
                  >
                    {group.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Roadmap */}
            <div className="flex-1 min-w-0">
              <motion.div
                key={active.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 font-[family-name:var(--font-inter)]">
                    {active.name}
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">{active.blurb}</p>
                </div>
                {active.videos[0] && (
                  <Link
                    href={`/learning/${topicKey}/${active.slug}/${active.videos[0].id}`}
                    onClick={() =>
                      trackSectionClick(ANALYTICS_SECTIONS.LEARNING, `start_${active.slug}`)
                    }
                    className="group shrink-0 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-br from-rose-600 to-rose-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(190,24,60,0.3)] hover:shadow-[0_10px_30px_rgba(190,24,60,0.4)] transition-all font-[family-name:var(--font-inter)]"
                  >
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/25 group-hover:scale-110 transition-transform">
                      <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                    Start
                  </Link>
                )}
              </motion.div>

              <ol className="relative">
                <span
                  aria-hidden
                  className="absolute left-[27px] top-3 bottom-3 w-px bg-gradient-to-b from-rose-300/70 via-rose-400/40 to-transparent"
                />
                {active.videos.map((video, index) => (
                  <motion.li
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, delay: (index % 4) * 0.05, ease: 'easeOut' }}
                    className="relative pl-16 pb-6 last:pb-0"
                  >
                    <span className="absolute left-0 top-1 w-14 flex justify-center">
                      <span className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-rose-200 shadow-[0_4px_16px_rgba(190,24,60,0.15)] flex items-center justify-center text-sm font-bold text-rose-700 font-[family-name:var(--font-inter)]">
                        {index + 1}
                      </span>
                    </span>

                    <Link
                      href={`/learning/${topicKey}/${active.slug}/${video.id}`}
                      onClick={() =>
                        trackSectionClick(ANALYTICS_SECTIONS.LEARNING, `roadmap_${video.id}`)
                      }
                      className="group glass-card flex items-center gap-4 p-3 pr-4 cursor-pointer"
                    >
                      <div className="relative w-28 sm:w-32 aspect-video shrink-0 rounded-xl overflow-hidden bg-zinc-900/5">
                        {video.youtubeId ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={youtubeThumbnail(video.youtubeId)}
                            alt={video.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-rose-400/30 via-rose-600/20 to-pink-400/20" />
                        )}
                        <span className="absolute bottom-1.5 right-1.5 flex items-center justify-center">
                          <span className="w-8 h-8 rounded-full bg-white/70 backdrop-blur-md border border-white/70 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                            <svg className="w-4 h-4 text-rose-700 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </span>
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-zinc-900 leading-snug group-hover:text-rose-700 transition-colors font-[family-name:var(--font-inter)]">
                          {video.title}
                        </h3>
                        {video.description && (
                          <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                            {video.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </main>

      <LearningFooter />
    </div>
  );
};

export default CategoryRoadmap;
