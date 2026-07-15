'use client';
import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import LearningHeader from '../LearningHeader';
import LearningFooter from '../LearningFooter';
import {
  getVideoInTopic,
  getTopicMeta,
  youtubeEmbedUrl,
  youtubeWatchUrl,
  youtubeThumbnail,
  instagramEmbedUrl,
  instagramPermalink,
  type TopicKey,
} from '@/app/lib/learning';
import { trackPageView, trackSectionClick } from '@/app/lib/analytics';
import { ANALYTICS_SECTIONS } from '@/app/lib/constants';

const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5m6.656-6.656l1.5-1.5a4 4 0 015.656 5.656l-3 3a4 4 0 01-5.656 0" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const NavThumb = ({ youtubeId, title }: { youtubeId?: string; title: string }) => (
  <span className="relative w-24 aspect-video shrink-0 rounded-lg overflow-hidden bg-zinc-900/5">
    {youtubeId ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={youtubeThumbnail(youtubeId)}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    ) : (
      <span className="absolute inset-0 bg-gradient-to-br from-rose-400/30 via-rose-600/20 to-pink-400/20" />
    )}
  </span>
);

const VideoDetailPage = ({
  topicKey,
  videoId,
}: {
  topicKey: TopicKey;
  videoId: string;
}) => {
  const location = useMemo(
    () => getVideoInTopic(topicKey, videoId),
    [topicKey, videoId]
  );

  useEffect(() => {
    if (location) {
      trackPageView(
        `learning_video_${videoId}`,
        `${location.video.title} · Learning · Rajesh K`
      );
      trackSectionClick(ANALYTICS_SECTIONS.LEARNING, videoId);
    }
  }, [location, videoId]);

  if (!location) {
    return (
      <div className="min-h-screen font-[family-name:var(--font-poppins)] text-zinc-900 pb-16">
        <LearningHeader />
        <main className="max-w-3xl mx-auto px-6 pt-28 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="glass-card p-10 sm:p-14 text-center"
          >
            <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-pink-100 ring-1 ring-rose-200/70">
              <svg
                className="h-8 w-8 text-rose-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M15 10l-4 4m0-4l4 4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold gradient-text font-[family-name:var(--font-inter)] mb-3">
              Video not found
            </h1>
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-8">
              Indha video kaanom — it may have moved or is no longer available.
              Namma learning hub-ku thirumbi poalaam.
            </p>
            <Link
              href="/learning-hub"
              onClick={() =>
                trackSectionClick(ANALYTICS_SECTIONS.LEARNING, 'not_found_return_hub')
              }
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(190,24,60,0.3)] hover:from-rose-600 hover:to-pink-600 transition-colors font-[family-name:var(--font-inter)]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Return to learning hub
            </Link>
          </motion.div>
        </main>
        <LearningFooter />
      </div>
    );
  }

  const { video, category, index, prev, next } = location;
  const topicTitle = getTopicMeta(topicKey).title;
  const backHref = `/learning-hub/${topicKey}/${category.slug}`;
  const isVertical = video.primaryPlatform === 'instagram';

  const embedUrl =
    video.primaryPlatform === 'youtube' && video.youtubeId
      ? youtubeEmbedUrl(video.youtubeId)
      : video.primaryPlatform === 'instagram' && video.instagramShortcode
      ? instagramEmbedUrl(video.instagramShortcode)
      : undefined;

  const relevantLinks = [
    ...(video.githubUrl
      ? [{ label: 'Source code on GitHub', url: video.githubUrl, code: true }]
      : []),
    ...(video.links ?? []).map((l) => ({ ...l, code: false })),
  ];

  return (
    <div className="min-h-screen font-[family-name:var(--font-poppins)] text-zinc-900 pb-16">
      <LearningHeader />

      <main className="max-w-4xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Breadcrumbs + step indicator */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <nav aria-label="Breadcrumb">
              <ol className="inline-flex flex-wrap items-center gap-1.5 rounded-full border border-rose-200/70 bg-white/60 px-3.5 py-1.5 backdrop-blur-md shadow-[0_2px_12px_rgba(190,24,60,0.08)] text-xs sm:text-[13px] text-zinc-700 font-[family-name:var(--font-inter)]">
                <li>
                  <Link href="/learning-hub" className="hover:text-rose-700 transition-colors">
                    Learning
                  </Link>
                </li>
                <li aria-hidden className="text-zinc-300">/</li>
                <li>
                  <Link href={`/learning-hub/${topicKey}`} className="hover:text-rose-700 transition-colors">
                    {topicTitle}
                  </Link>
                </li>
                <li aria-hidden className="text-zinc-300">/</li>
                <li>
                  <Link href={backHref} className="hover:text-rose-700 transition-colors">
                    {category.name}
                  </Link>
                </li>
                <li aria-hidden className="text-zinc-300">/</li>
                <li className="text-rose-700 font-semibold truncate max-w-[16rem]" aria-current="page">
                  {video.title}
                </li>
              </ol>
            </nav>
            <p className="shrink-0 text-rose-700 text-xs sm:text-[13px] font-medium font-[family-name:var(--font-inter)]">
              Step {index + 1} of {category.videos.length}
            </p>
          </div>

          {/* Player */}
          <div
            className={`glass-card overflow-hidden mb-6 ${
              isVertical ? 'max-w-sm mx-auto' : ''
            }`}
          >
            <div className={`relative w-full ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} bg-zinc-900/5`}>
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={video.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-100/60 to-zinc-200/40">
                  <span className="text-sm font-medium text-zinc-500 font-[family-name:var(--font-inter)]">
                    Coming soon
                  </span>
                </div>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 leading-snug font-[family-name:var(--font-inter)] mb-3">
            {video.title}
          </h1>

          {video.description ? (
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
              {video.description}
            </p>
          ) : null}

          {/* Watch on links */}
          <div className="flex items-center gap-3 mb-8">
            {video.youtubeId && (
              <a
                href={youtubeWatchUrl(video.youtubeId)}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-chip inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-zinc-700 hover:text-rose-700 transition-colors font-[family-name:var(--font-inter)]"
              >
                Watch on YouTube
              </a>
            )}
            {video.instagramShortcode && (
              <a
                href={instagramPermalink(video.instagramShortcode)}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-chip inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-zinc-700 hover:text-rose-700 transition-colors font-[family-name:var(--font-inter)]"
              >
                Watch on Instagram
              </a>
            )}
          </div>

          {/* Relevant links */}
          {relevantLinks.length > 0 && (
            <div className="mb-10">
              <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-3 font-[family-name:var(--font-inter)]">
                Relevant links
              </h2>
              <div className="flex flex-col gap-2">
                {relevantLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card inline-flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:text-rose-700 transition-colors font-[family-name:var(--font-inter)]"
                  >
                    {link.code ? <CodeIcon /> : <LinkIcon />}
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Prev / Next */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/50">
            {prev ? (
              <Link
                href={`/learning-hub/${topicKey}/video/${prev.id}`}
                className="group glass-card p-3 flex items-center gap-3"
              >
                <NavThumb youtubeId={prev.youtubeId} title={prev.title} />
                <span className="flex flex-col min-w-0">
                  <span className="text-[11px] text-zinc-400 mb-0.5 font-[family-name:var(--font-inter)]">← Previous</span>
                  <span className="text-xs sm:text-[13px] font-semibold text-zinc-900 group-hover:text-rose-700 transition-colors leading-snug line-clamp-2">
                    {prev.title}
                  </span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/learning-hub/${topicKey}/video/${next.id}`}
                className="group glass-card p-3 flex items-center gap-3 sm:flex-row-reverse sm:text-right"
              >
                <NavThumb youtubeId={next.youtubeId} title={next.title} />
                <span className="flex flex-col min-w-0">
                  <span className="text-[11px] text-zinc-400 mb-0.5 font-[family-name:var(--font-inter)]">Next →</span>
                  <span className="text-xs sm:text-[13px] font-semibold text-zinc-900 group-hover:text-rose-700 transition-colors leading-snug line-clamp-2">
                    {next.title}
                  </span>
                </span>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </motion.div>
      </main>

      <LearningFooter />
    </div>
  );
};

export default VideoDetailPage;
