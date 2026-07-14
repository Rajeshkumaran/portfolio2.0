'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  type Video,
  youtubeThumbnail,
  youtubeEmbedUrl,
  youtubeWatchUrl,
  instagramEmbedUrl,
  instagramPermalink,
} from '@/app/lib/learning';
import { trackSectionClick } from '@/app/lib/analytics';
import { ANALYTICS_SECTIONS } from '@/app/lib/constants';

const YouTubeGlyph = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const InstagramGlyph = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const CodeLink = ({ url }: { url: string }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => e.stopPropagation()}
    className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-rose-700 transition-colors font-[family-name:var(--font-inter)]"
  >
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
    View code
  </a>
);

const LearningVideoCard = ({ video, index }: { video: Video; index: number }) => {
  const [playing, setPlaying] = useState(false);

  const isVertical = video.primaryPlatform === 'instagram';

  const embedUrl =
    video.primaryPlatform === 'youtube' && video.youtubeId
      ? youtubeEmbedUrl(video.youtubeId)
      : video.primaryPlatform === 'instagram' && video.instagramShortcode
      ? instagramEmbedUrl(video.instagramShortcode)
      : undefined;

  const primaryUrl =
    video.primaryPlatform === 'youtube' && video.youtubeId
      ? youtubeWatchUrl(video.youtubeId)
      : video.instagramShortcode
      ? instagramPermalink(video.instagramShortcode)
      : undefined;

  const handlePlay = () => {
    trackSectionClick(ANALYTICS_SECTIONS.LEARNING, video.id);
    setPlaying(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: 'easeOut' }}
      className="glass-card overflow-hidden h-full flex flex-col"
    >
      <div
        className={`relative w-full ${isVertical ? 'aspect-[9/16] max-h-[420px]' : 'aspect-video'} bg-zinc-900/5`}
      >
        {playing && embedUrl ? (
          <iframe
            src={embedUrl}
            title={video.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : video.isAvailable ? (
          <button
            onClick={handlePlay}
            className="group absolute inset-0 w-full h-full cursor-pointer"
            aria-label={`Play ${video.title}`}
          >
            {video.youtubeId ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={youtubeThumbnail(video.youtubeId)}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400/30 via-rose-600/20 to-pink-400/20" />
            )}
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-14 h-14 rounded-full bg-white/70 backdrop-blur-md border border-white/70 shadow-[0_6px_24px_rgba(31,38,80,0.18)] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <svg className="w-6 h-6 text-rose-700 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-zinc-100/60 to-zinc-200/40">
            <span className="text-xs font-medium text-zinc-500 font-[family-name:var(--font-inter)]">
              Coming soon
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4 mt-auto">
        {video.githubUrl && (
          <div className="flex items-center justify-end gap-2">
            <CodeLink url={video.githubUrl} />
          </div>
        )}

        {primaryUrl ? (
          <a
            href={primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-zinc-900 leading-snug hover:text-rose-700 transition-colors font-[family-name:var(--font-inter)]"
          >
            {video.title}
          </a>
        ) : (
          <p className="text-sm font-semibold text-zinc-900 leading-snug font-[family-name:var(--font-inter)]">
            {video.title}
          </p>
        )}

        {(video.youtubeId || video.instagramShortcode) && (
          <div className="flex items-center gap-3 pt-0.5">
            {video.youtubeId && (
              <a
                href={youtubeWatchUrl(video.youtubeId)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch on YouTube"
                className="text-zinc-500 hover:text-rose-700 transition-colors"
              >
                <YouTubeGlyph />
              </a>
            )}
            {video.instagramShortcode && (
              <a
                href={instagramPermalink(video.instagramShortcode)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch on Instagram"
                className="text-zinc-500 hover:text-rose-700 transition-colors"
              >
                <InstagramGlyph />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LearningVideoCard;
