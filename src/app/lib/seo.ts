import type { Metadata } from 'next';
import {
  getTopicMeta,
  getCategoryBySlug,
  getVideoInTopic,
  youtubeThumbnail,
  youtubeWatchUrl,
  instagramPermalink,
  type TopicKey,
  type Video,
} from './learning';

/**
 * Absolute production origin (GitHub Pages project site). All SEO URLs
 * (canonical, OpenGraph, sitemap, JSON-LD) are built from this so they stay
 * correct regardless of the basePath the CI injects at build time.
 */
export const SITE_URL = 'https://rajeshkumaran.github.io/portfolio2.0';
export const SITE_NAME = 'Aazh Aayvu';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/aazh-aayvu-og.jpg`;

/** Build a fully-qualified, trailing-slashed URL for a site-relative path. */
export const absUrl = (path = '/'): string => {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `${SITE_URL}/${clean}/` : `${SITE_URL}/`;
};

const clamp = (text: string, max = 160): string =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;

/** Preferred OG/thumbnail image for a video (YouTube thumb, else default). */
export const videoImage = (video: Video): string =>
  video.youtubeId ? youtubeThumbnail(video.youtubeId) : DEFAULT_OG_IMAGE;

/** Canonical describing a shared OG/Twitter card block. */
const cardMetadata = (opts: {
  title: string;
  description: string;
  url: string;
  image: string;
  type?: 'website' | 'article' | 'video.other';
}): Metadata => ({
  title: opts.title,
  description: opts.description,
  alternates: { canonical: opts.url },
  openGraph: {
    title: opts.title,
    description: opts.description,
    url: opts.url,
    siteName: SITE_NAME,
    type: opts.type === 'video.other' ? 'video.other' : opts.type ?? 'website',
    images: [{ url: opts.image }],
  },
  twitter: {
    card: 'summary_large_image',
    title: opts.title,
    description: opts.description,
    images: [opts.image],
  },
});

/** Metadata for the learning hub landing page. */
export const hubMetadata = (): Metadata =>
  cardMetadata({
    title: 'Learn with me — Aazh Aayvu',
    description:
      'Aazh Aayvu — tech & finance explained simply on YouTube and Instagram. Pick a track: data structures, system design, the web under the hood, markets and money.',
    url: absUrl('/learning-hub'),
    image: DEFAULT_OG_IMAGE,
  });

/** Metadata for a topic (tech / finance) roadmap page. */
export const topicMetadata = (key: TopicKey): Metadata => {
  const topic = getTopicMeta(key);
  const title = `${topic.title} — Learn with Aazh Aayvu`;
  return cardMetadata({
    title,
    description: clamp(topic.tagline),
    url: absUrl(`/learning-hub/${key}`),
    image: DEFAULT_OG_IMAGE,
  });
};

/** Metadata for a category roadmap page within a topic. */
export const categoryMetadata = (
  key: TopicKey,
  slug: string
): Metadata | undefined => {
  const category = getCategoryBySlug(key, slug);
  if (!category) return undefined;
  const topic = getTopicMeta(key);
  const title = `${category.name} — ${topic.title} · Aazh Aayvu`;
  const count = category.videos.length;
  const description = clamp(
    `${category.blurb} ${count} video${count === 1 ? '' : 's'} in a guided roadmap.`
  );
  return cardMetadata({
    title,
    description,
    url: absUrl(`/learning-hub/${key}/${slug}`),
    image: category.videos[0] ? videoImage(category.videos[0]) : DEFAULT_OG_IMAGE,
  });
};

/** Metadata for a single video page (uses its primary category context). */
export const videoMetadata = (
  key: TopicKey,
  id: string
): Metadata | undefined => {
  const loc = getVideoInTopic(key, id);
  if (!loc) return undefined;
  const { video, category } = loc;
  const topic = getTopicMeta(key);
  const title = `${video.title} · Aazh Aayvu`;
  const description = clamp(
    video.description?.trim() ||
      `${video.title} — part of the ${category.name} roadmap in ${topic.title}. Watch and learn with Aazh Aayvu.`
  );
  return cardMetadata({
    title,
    description,
    url: absUrl(`/learning-hub/${key}/video/${id}`),
    image: videoImage(video),
    type: 'video.other',
  });
};

/** JSON-LD VideoObject + BreadcrumbList for a video page. */
export const videoJsonLd = (key: TopicKey, id: string): object[] | undefined => {
  const loc = getVideoInTopic(key, id);
  if (!loc) return undefined;
  const { video, category } = loc;
  const topic = getTopicMeta(key);
  const pageUrl = absUrl(`/learning-hub/${key}/video/${id}`);

  const contentUrl = video.youtubeId
    ? youtubeWatchUrl(video.youtubeId)
    : video.instagramShortcode
    ? instagramPermalink(video.instagramShortcode)
    : pageUrl;

  const videoObject: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description:
      video.description?.trim() ||
      `${video.title} — ${category.name} · ${topic.title} by Aazh Aayvu.`,
    thumbnailUrl: [videoImage(video)],
    contentUrl,
    url: pageUrl,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: DEFAULT_OG_IMAGE },
    },
  };
  if (video.youtubeId) {
    videoObject.embedUrl = `https://www.youtube.com/embed/${video.youtubeId}`;
  }
  if (video.publishedAt) {
    videoObject.uploadDate = video.publishedAt;
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { name: 'Learning', url: absUrl('/learning-hub') },
      { name: topic.title, url: absUrl(`/learning-hub/${key}`) },
      { name: category.name, url: absUrl(`/learning-hub/${key}/${category.slug}`) },
      { name: video.title, url: pageUrl },
    ].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return [videoObject, breadcrumb];
};

/** JSON-LD ItemList (roadmap) for a category page. */
export const categoryJsonLd = (
  key: TopicKey,
  slug: string
): object | undefined => {
  const category = getCategoryBySlug(key, slug);
  if (!category) return undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: category.name,
    description: category.blurb,
    itemListElement: category.videos.map((v: Video, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: v.title,
      url: absUrl(`/learning-hub/${key}/video/${v.id}`),
    })),
  };
};
