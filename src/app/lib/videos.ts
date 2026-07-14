import { CODE_REPO_LINK } from './constants';

export type VideoPlatform = 'youtube' | 'instagram';

export type VideoCategory =
  | 'Data Structures'
  | 'Algorithms'
  | 'System Design'
  | 'Web Development'
  | 'Shorts';

export type Video = {
  /** Stable unique id (used as React key + analytics id). */
  id: string;
  title: string;
  description?: string;
  platform: VideoPlatform;
  /**
   * For youtube: the 11-char video id (e.g. "dQw4w9WgXcQ").
   * For instagram: the reel/post shortcode (e.g. "C1a2b3c4D5e").
   */
  videoId: string;
  category: VideoCategory;
  /** Optional deep link to the specific implementation code for this video. */
  githubUrl?: string;
  /** ISO date string, used for sorting newest-first within a category. */
  publishedAt?: string;
};

/**
 * Display order + metadata for categories. Categories with no videos are
 * hidden automatically on the page.
 */
export const CATEGORY_ORDER: {
  name: VideoCategory;
  blurb: string;
}[] = [
  { name: 'Data Structures', blurb: 'Building the fundamentals from scratch.' },
  { name: 'Algorithms', blurb: 'Problem-solving patterns, explained simply.' },
  { name: 'System Design', blurb: 'How real-world systems are architected.' },
  { name: 'Web Development', blurb: 'Frontend, backend and everything between.' },
  { name: 'Shorts', blurb: 'Quick, bite-sized tech tips.' },
];

/** Central place to add your videos. Newest-first is handled automatically. */
export const VIDEOS: Video[] = [
  // TODO: Replace the placeholder videoId / githubUrl values below with your
  // real YouTube video ids and Instagram reel shortcodes.
  {
    id: 'ds-linked-list',
    title: 'Linked Lists in JavaScript — from zero',
    description: 'Implementing a singly linked list and its core operations.',
    platform: 'youtube',
    videoId: 'REPLACE_YT_ID_1',
    category: 'Data Structures',
    githubUrl: `${CODE_REPO_LINK}/tree/main/LinkedList`,
    publishedAt: '2026-07-01',
  },
  {
    id: 'ds-stack-queue',
    title: 'Stacks & Queues, visually',
    description: 'The two workhorses of interview questions.',
    platform: 'youtube',
    videoId: 'REPLACE_YT_ID_2',
    category: 'Data Structures',
    githubUrl: `${CODE_REPO_LINK}/tree/main/Stack`,
    publishedAt: '2026-06-20',
  },
  {
    id: 'algo-binary-search',
    title: 'Binary Search — the template you actually need',
    platform: 'youtube',
    videoId: 'REPLACE_YT_ID_3',
    category: 'Algorithms',
    githubUrl: `${CODE_REPO_LINK}/tree/main/BinarySearch`,
    publishedAt: '2026-06-10',
  },
  {
    id: 'short-bigo',
    title: 'Big-O in 60 seconds',
    platform: 'instagram',
    videoId: 'REPLACE_IG_SHORTCODE_1',
    category: 'Shorts',
    publishedAt: '2026-07-05',
  },
];

/** YouTube helpers */
export const youtubeThumbnail = (videoId: string) =>
  `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

export const youtubeEmbedUrl = (videoId: string) =>
  `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

export const youtubeWatchUrl = (videoId: string) =>
  `https://www.youtube.com/watch?v=${videoId}`;

/** Instagram helpers */
export const instagramEmbedUrl = (shortcode: string) =>
  `https://www.instagram.com/reel/${shortcode}/embed`;

export const instagramPermalink = (shortcode: string) =>
  `https://www.instagram.com/reel/${shortcode}/`;

/** Videos grouped by category in display order, newest-first within a group. */
export const getVideosByCategory = () =>
  CATEGORY_ORDER.map((category) => ({
    ...category,
    videos: VIDEOS.filter((v) => v.category === category.name).sort((a, b) =>
      (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '')
    ),
  })).filter((group) => group.videos.length > 0);
