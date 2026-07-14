import { notFound } from 'next/navigation';
import CategoryRoadmap from '../../../components/CategoryRoadmap';
import { getAllCategoryParams, isTopicKey } from '../../../lib/learning';

export function generateStaticParams() {
  return getAllCategoryParams();
}

export default async function CategoryRoute({
  params,
}: {
  params: Promise<{ topic: string; category: string }>;
}) {
  const { topic, category } = await params;
  if (!isTopicKey(topic)) notFound();
  return <CategoryRoadmap topicKey={topic} categorySlug={category} />;
}
