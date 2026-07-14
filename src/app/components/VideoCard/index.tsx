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
} from '@/app/lib/videos';
import { trackSectionClick } from '@/app/lib/analytics';
import { ANALYTICS_SECTIONS } from '@/app/lib/constants';

const PlatformBadge = ({ platform }: { platform: Video['platform'] }) => {
  const label = platform === 'youtube' ? 'YouTube' : 'Instagram';
  return (
    <span className="glass-chip px-2.5 py-1 text-[11px] font-medium text-rose-700 font-[family-name:var(--font-inter)]">
      {label}
    </span>
  );
};

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

const VideoCard = ({ video, index }: { video: Video; index: number }) => {
  const [playing, setPlaying] = useState(false);

  const externalUrl =
    video.platform === 'youtube'
      ? youtubeWatchUrl(video.videoId)
      : instagramPermalink(video.videoId);

  const embedUrl =
    video.platform === 'youtube'
      ? youtubeEmbedUrl(video.videoId)
      : instagramEmbedUrl(video.videoId);

  const isVertical = video.platform === 'instagram';

  const handlePlay = () => {
    trackSectionClick(ANALYTICS_SECTIONS.VIDEOS, video.id);
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
        {playing ? (
          <iframe
            src={embedUrl}
            title={video.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            onClick={handlePlay}
            className="group absolute inset-0 w-full h-full cursor-pointer"
            aria-label={`Play ${video.title}`}
          >
            {video.platform === 'youtube' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={youtubeThumbnail(video.videoId)}
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
        )}
      </div>

      <div className="flex flex-col gap-2 p-4 mt-auto">
        <div className="flex items-center justify-between gap-2">
          <PlatformBadge platform={video.platform} />
          {video.githubUrl && <CodeLink url={video.githubUrl} />}
        </div>
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-zinc-900 leading-snug hover:text-rose-700 transition-colors font-[family-name:var(--font-inter)]"
        >
          {video.title}
        </a>
        {video.description && (
          <p className="text-xs text-zinc-600 leading-relaxed">
            {video.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default VideoCard;
