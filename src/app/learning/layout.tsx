import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learning · Rajesh K',
  description:
    'Aazh Aayvu — tech & finance videos by Rajesh K on YouTube and Instagram. Data structures, system design, the web under the hood, markets and money, explained simply.',
};

export default function LearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
