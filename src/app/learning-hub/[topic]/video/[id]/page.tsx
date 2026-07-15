import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import VideoDetailPage from '../../../../components/VideoDetailPage';
import { getAllTopicVideoParams, isTopicKey } from '../../../../lib/learning';
import { videoMetadata, videoJsonLd } from '../../../../lib/seo';

export function generateStaticParams() {
  return getAllTopicVideoParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string; id: string }>;
}): Promise<Metadata> {
  const { topic, id } = await params;
  if (!isTopicKey(topic)) return {};
  return videoMetadata(topic, id) ?? {};
}

export default async function VideoRoute({
  params,
}: {
  params: Promise<{ topic: string; id: string }>;
}) {
  const { topic, id } = await params;
  if (!isTopicKey(topic)) notFound();
  const jsonLd = videoJsonLd(topic, id);
  return (
    <>
      {jsonLd?.map((entry, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
      <VideoDetailPage topicKey={topic} videoId={id} />
    </>
  );
}
