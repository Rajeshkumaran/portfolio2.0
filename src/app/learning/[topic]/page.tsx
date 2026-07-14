import { notFound } from 'next/navigation';
import CategoryRoadmap from '../../components/CategoryRoadmap';
import { getAllTopicParams, isTopicKey } from '../../lib/learning';

export function generateStaticParams() {
  return getAllTopicParams();
}

export default async function TopicRoute({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  if (!isTopicKey(topic)) notFound();
  return <CategoryRoadmap topicKey={topic} />;
}
