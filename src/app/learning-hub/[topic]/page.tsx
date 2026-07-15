import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryRoadmap from '../../components/CategoryRoadmap';
import { getAllTopicParams, isTopicKey } from '../../lib/learning';
import { topicMetadata } from '../../lib/seo';

export function generateStaticParams() {
  return getAllTopicParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  if (!isTopicKey(topic)) return {};
  return topicMetadata(topic);
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
