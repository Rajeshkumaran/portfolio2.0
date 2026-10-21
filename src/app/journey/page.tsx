import type { Metadata } from 'next';
import Link from 'next/link';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import nextConfig from '../../../next.config';
import journeyData from '../data/journey.json';
import { parseJourneyContent, type JourneyMoment } from '../lib/journey';
import { absUrl } from '../lib/seo';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import JourneyTimeline from '../components/JourneyTimeline';
import JourneyRoad, { JourneyMountains } from '../components/JourneyScenery';
import '../portfolio.css';
import './journey.css';

const content = parseJourneyContent(journeyData);
const preview = content.moments.length === 0;
const description = content.subtitle;

export const metadata: Metadata = {
  title: `${content.title} | Rajesh K`,
  description,
  alternates: { canonical: absUrl('/journey') },
  robots: { index: !preview, follow: !preview },
  openGraph: {
    title: `${content.title} | Rajesh K`,
    description,
    url: absUrl('/journey'),
    siteName: 'Rajesh K',
    type: 'website',
    images: [],
  },
  twitter: {
    card: 'summary',
    title: `${content.title} | Rajesh K`,
    description,
    images: [],
  },
};

const exampleMoments: JourneyMoment[] = [
  {
    id: 'example-beginning',
    date: '2023-03',
    category: 'milestone',
    title: 'A first step',
    story: 'A place for a beginning: trying something unfamiliar, choosing a direction, or opening a new chapter.',
    reflection: 'This space can hold what the experience taught you, beyond the event itself.',
  },
  {
    id: 'example-detour',
    date: '2023-10',
    category: 'detour',
    title: 'Not quite the plan',
    story: 'A place for an unexpected turn. A story can make room for uncertainty without needing a perfect ending.',
    reflection: 'Share only what feels comfortable. A small, honest detail can say more than a polished lesson.',
  },
  {
    id: 'example-discovery',
    date: '2024-06',
    category: 'discovery',
    title: 'A different perspective',
    story: 'A place for something that changed how you see things: a conversation, a book, a skill, or a quiet realization.',
  },
  {
    id: 'example-memory',
    date: '2025-02',
    category: 'life',
    title: 'One for the memory book',
    story: 'Not every moment needs to be an achievement. There is room here for the people, places, and ordinary days that matter.',
  },
  {
    id: 'example-travel',
    date: '2025-09',
    category: 'travel',
    title: 'Somewhere new',
    story: 'A place for a journey beyond the familiar. An optional photograph can sit alongside the story of a place or an experience.',
  },
];

export default function JourneyPage() {
  const moments = preview
    ? exampleMoments.filter((moment) => content.categories.some((category) => category.id === moment.category))
    : content.moments.map((moment) => {
        if (!moment.images) return moment;
        return {
          ...moment,
          images: moment.images.map((image) => {
            if (!existsSync(join(process.cwd(), 'public', image.src.slice(1)))) {
              throw new Error(`Journey image "${image.src}" is missing. Add it under public/journey/ before publishing.`);
            }
            return { ...image, src: `${nextConfig.basePath ?? ''}${image.src}` };
          }),
        };
      });
  const yearCount = new Set(moments.map((moment) => moment.date.slice(0, 4))).size;

  return (
    <div className="portfolio journey-page min-h-screen">
      <a href="#main-content" className="portfolio-skip-link">Skip to content</a>
      <Navbar />
      <BackToTop />
      <main id="main-content" className="journey-main">
        <header className="journey-intro">
          <Link href="/" className="portfolio-eyebrow journey-home-link">
            <span aria-hidden="true">&larr;</span> Back to the portfolio
          </Link>
          <div className="journey-intro-grid">
            <div>
              <p className="portfolio-eyebrow">Journey / Rajesh K</p>
              <h1>{content.title}</h1>
              <p className="journey-subtitle">{content.subtitle}</p>
              <a href="#journey-route" className="journey-follow-link">
                Follow the road <span aria-hidden="true">&darr;</span>
              </a>
            </div>
            <div className="journey-intro-aside" aria-hidden="true">
              <div className="journey-intro-landscape">
                <JourneyMountains className="journey-intro-mountains" />
                <JourneyRoad className="journey-intro-road-map" />
              </div>
              <p>Not a straight line.<br /><em>Still a way forward.</em></p>
            </div>
          </div>
          <div className="journey-intro-footer">
            <span className="portfolio-eyebrow">{String(moments.length).padStart(2, '0')} {preview ? 'example ' : ''}{moments.length === 1 ? 'moment' : 'moments'}</span>
            <span className="portfolio-eyebrow">{yearCount} {preview ? 'example ' : ''}{yearCount === 1 ? 'year' : 'years'} / one unfolding story</span>
          </div>
        </header>

        {preview && (
          <aside className="journey-preview-note" aria-label="Layout preview">
            <span className="portfolio-eyebrow">Layout preview</span>
            <p>These are example stories and dates, not events from my life. The real moments will take their place when they are ready to be shared.</p>
          </aside>
        )}

        <JourneyTimeline moments={moments} categories={content.categories} preview={preview} />

        <footer className="journey-closing">
          <p>There is more to a person than a list of things they have built.</p>
          <Link href="/" className="journey-follow-link">
            Back to the grind <span aria-hidden="true">&rarr;</span>
          </Link>
        </footer>
      </main>
      <Footer />
    </div>
  );
}
