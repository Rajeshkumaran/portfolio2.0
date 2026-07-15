import type { Metadata } from 'next';
import { hubMetadata } from '../lib/seo';

export const metadata: Metadata = hubMetadata();

export default function LearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
