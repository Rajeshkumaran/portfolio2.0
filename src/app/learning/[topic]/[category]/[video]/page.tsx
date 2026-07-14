import { notFound } from 'next/navigation';
import VideoDetailPage from '../../../../components/VideoDetailPage';
import { getAllVideoParams, isTopicKey } from '../../../../lib/learning';

export function generateStaticParams() {
  return getAllVideoParams();
}

export default async function VideoRoute({
  params,
}: {
  params: Promise<{ topic: string; category: string; video: string }>;
}) {
  const { topic, category, video } = await params;
  if (!isTopicKey(topic)) notFound();
  return (
    <VideoDetailPage topicKey={topic} categorySlug={category} videoId={video} />
  );
}
