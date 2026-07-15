import type { MetadataRoute } from 'next';
import {
  getAllTopicParams,
  getAllCategoryParams,
  getAllTopicVideoParams,
  getVideoInTopic,
} from './lib/learning';
import { absUrl } from './lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = ['/', '/learning-hub'].map((path) => ({
    url: absUrl(path),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: path === '/' ? 1 : 0.9,
  }));

  const topicPages = getAllTopicParams().map(({ topic }) => ({
    url: absUrl(`/learning-hub/${topic}`),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryPages = getAllCategoryParams().map(({ topic, category }) => ({
    url: absUrl(`/learning-hub/${topic}/${category}`),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const videoPages = getAllTopicVideoParams().map(({ topic, id }) => {
    const published = getVideoInTopic(topic, id)?.video.publishedAt;
    return {
      url: absUrl(`/learning-hub/${topic}/video/${id}`),
      lastModified: published ? new Date(published) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });

  return [...staticPages, ...topicPages, ...categoryPages, ...videoPages];
}
