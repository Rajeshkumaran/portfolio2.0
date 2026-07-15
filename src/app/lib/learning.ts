import learningData from '../data/learning.json';
import videosData from '../data/videos.json';

export type TopicKey = 'tech' | 'finance';
export type VideoFormat = 'long' | 'short';
export type VideoPlatform = 'youtube' | 'instagram';

export type VideoLink = { label: string; url: string };

/**
 * A shared video entry in the flat catalog (videos.json). Keyed by the video's
 * YouTube id, so the id itself identifies the video (no separate youtubeUrl).
 * `youtubeUrl` remains optional for non-YouTube-keyed fallbacks.
 */
export type CatalogVideo = {
  title: string;
  format: VideoFormat;
  youtubeUrl?: string;
  instagramUrl?: string;
  githubUrl?: string;
  description?: string;
  links?: VideoLink[];
  /** ISO 8601 publish date (e.g. "2025-03-14"), used for VideoObject uploadDate. */
  publishedAt?: string;
};

/** A catalog video plus its id (as resolved for a category). */
export type RawVideo = CatalogVideo & { id: string };

export type LearningCategory = {
  id: string;
  slug: string;
  name: string;
  blurb: string;
  /** Ordered video ids referencing videos.json (learning sequence). */
  videos: string[];
};

export type RawTopic = {
  title: string;
  tagline: string;
  categories: LearningCategory[];
};

/** A video enriched with parsed ids + the primary platform to embed. */
export type Video = RawVideo & {
  youtubeId?: string;
  instagramShortcode?: string;
  /** Platform used for the inline embed/thumbnail (YouTube preferred). */
  primaryPlatform?: VideoPlatform;
  /** True when at least one playable link exists. */
  isAvailable: boolean;
};

export type CategoryGroup = Omit<LearningCategory, 'videos'> & { videos: Video[] };

export type Topic = {
  key: TopicKey;
  title: string;
  tagline: string;
  groups: CategoryGroup[];
  totalVideos: number;
};

const DATA = learningData as Record<TopicKey, RawTopic>;
const CATALOG = videosData as Record<string, CatalogVideo>;

/** Resolve a catalog video by id into a RawVideo (id + metadata). */
const resolveVideo = (id: string): RawVideo | undefined => {
  const entry = CATALOG[id];
  return entry ? { id, ...entry } : undefined;
};

/** Extract the 11-char YouTube id from watch, youtu.be or shorts URLs. */
export const parseYoutubeId = (url?: string): string | undefined => {
  if (!url) return undefined;
  const patterns = [
    /[?&]v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /\/shorts\/([\w-]{11})/,
    /\/embed\/([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return undefined;
};

/** Extract the reel/post shortcode from an Instagram URL. */
export const parseInstagramShortcode = (url?: string): string | undefined => {
  if (!url) return undefined;
  const m = url.match(/instagram\.com\/(?:reel|reels|p|tv)\/([\w-]+)/);
  return m ? m[1] : undefined;
};

/** YouTube helpers */
export const youtubeThumbnail = (id: string) =>
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export const youtubeEmbedUrl = (id: string) =>
  `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;

export const youtubeWatchUrl = (id: string) =>
  `https://www.youtube.com/watch?v=${id}`;

/** Instagram helpers */
export const instagramEmbedUrl = (shortcode: string) =>
  `https://www.instagram.com/reel/${shortcode}/embed`;

export const instagramPermalink = (shortcode: string) =>
  `https://www.instagram.com/reel/${shortcode}/`;

const YT_ID_RE = /^[\w-]{11}$/;

const enrich = (raw: RawVideo): Video => {
  // The catalog key is the YouTube id; fall back to parsing a legacy url.
  const youtubeId = YT_ID_RE.test(raw.id)
    ? raw.id
    : parseYoutubeId(raw.youtubeUrl);
  const instagramShortcode = parseInstagramShortcode(raw.instagramUrl);
  const primaryPlatform: VideoPlatform | undefined = youtubeId
    ? 'youtube'
    : instagramShortcode
    ? 'instagram'
    : undefined;
  return {
    ...raw,
    youtubeId,
    instagramShortcode,
    primaryPlatform,
    isAvailable: Boolean(primaryPlatform),
  };
};

/**
 * Returns a topic with its videos grouped by category. Each category resolves
 * its ordered `videos` id list against the catalog (array order = learning
 * sequence). Empty/unresolved categories are omitted.
 */
export const getTopic = (key: TopicKey): Topic => {
  const raw = DATA[key];
  const groups: CategoryGroup[] = raw.categories
    .map(({ videos, ...category }) => ({
      ...category,
      videos: videos
        .map(resolveVideo)
        .filter((v): v is RawVideo => Boolean(v))
        .map(enrich),
    }))
    .filter((group) => group.videos.length > 0);

  const uniqueIds = new Set(groups.flatMap((g) => g.videos.map((v) => v.id)));

  return {
    key,
    title: raw.title,
    tagline: raw.tagline,
    groups,
    totalVideos: uniqueIds.size,
  };
};

/** Lightweight summary for the hub cards. */
export const getTopicSummaries = () =>
  (Object.keys(DATA) as TopicKey[]).map((key) => {
    const topic = getTopic(key);
    return {
      key,
      title: topic.title,
      tagline: topic.tagline,
      categoryCount: topic.groups.length,
      videoCount: topic.totalVideos,
    };
  });

export const isTopicKey = (v: string): v is TopicKey =>
  v === 'tech' || v === 'finance';

/** Full metadata for a single topic (title/tagline + non-empty groups). */
export const getTopicMeta = (key: TopicKey) => {
  const topic = getTopic(key);
  return {
    key,
    title: topic.title,
    tagline: topic.tagline,
    groups: topic.groups,
  };
};

/** Resolve a category (with its ordered videos) by its URL slug. */
export const getCategoryBySlug = (
  key: TopicKey,
  slug: string
): CategoryGroup | undefined => getTopic(key).groups.find((g) => g.slug === slug);

/**
 * Resolve a video by id within a topic. Uses the video's PRIMARY category
 * (the first category, in declared order, that contains it) for breadcrumb,
 * "Step N of M", and roadmap prev/next. The video's own URL stays category-free.
 */
export const getVideoInTopic = (
  key: TopicKey,
  videoId: string
):
  | {
      topicKey: TopicKey;
      category: CategoryGroup;
      video: Video;
      index: number;
      prev?: Video;
      next?: Video;
    }
  | undefined => {
  for (const category of getTopic(key).groups) {
    const index = category.videos.findIndex((v) => v.id === videoId);
    if (index !== -1) {
      return {
        topicKey: key,
        category,
        video: category.videos[index],
        index,
        prev: index > 0 ? category.videos[index - 1] : undefined,
        next:
          index < category.videos.length - 1
            ? category.videos[index + 1]
            : undefined,
      };
    }
  }
  return undefined;
};

/** Static params: every (topic, category) pair. */
export const getAllCategoryParams = () =>
  (Object.keys(DATA) as TopicKey[]).flatMap((topic) =>
    getTopic(topic).groups.map((g) => ({ topic, category: g.slug }))
  );

/** Static params: one canonical (topic, id) page per video (deduped across categories). */
export const getAllTopicVideoParams = () =>
  (Object.keys(DATA) as TopicKey[]).flatMap((topic) => {
    const seen = new Set<string>();
    const params: { topic: TopicKey; id: string }[] = [];
    for (const g of getTopic(topic).groups) {
      for (const v of g.videos) {
        if (!seen.has(v.id)) {
          seen.add(v.id);
          params.push({ topic, id: v.id });
        }
      }
    }
    return params;
  });

/** Static params: every topic. */
export const getAllTopicParams = () =>
  (Object.keys(DATA) as TopicKey[]).map((topic) => ({ topic }));

