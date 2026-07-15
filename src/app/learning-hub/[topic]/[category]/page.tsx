import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryRoadmap from '../../../components/CategoryRoadmap';
import { getAllCategoryParams, isTopicKey } from '../../../lib/learning';
import { categoryMetadata, categoryJsonLd, topicMetadata } from '../../../lib/seo';

export function generateStaticParams() {
  return getAllCategoryParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string; category: string }>;
}): Promise<Metadata> {
  const { topic, category } = await params;
  if (!isTopicKey(topic)) return {};
  return categoryMetadata(topic, category) ?? topicMetadata(topic);
}

export default async function CategoryRoute({
  params,
}: {
  params: Promise<{ topic: string; category: string }>;
}) {
  const { topic, category } = await params;
  if (!isTopicKey(topic)) notFound();
  const jsonLd = categoryJsonLd(topic, category);
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CategoryRoadmap topicKey={topic} categorySlug={category} />
    </>
  );
}
