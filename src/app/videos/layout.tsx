import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Videos · Rajesh K',
  description:
    'Tech videos by Rajesh K — data structures, algorithms, system design and more, on YouTube and Instagram.',
};

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
