'use client';
import Link from 'next/link';
import { getTopicSummaries, type TopicKey } from '@/app/lib/learning';
import { trackSectionClick } from '@/app/lib/analytics';
import { ANALYTICS_SECTIONS } from '@/app/lib/constants';

const TopicSwitcher = ({ active }: { active: TopicKey }) => {
  const topics = getTopicSummaries();

  return (
    <nav
      aria-label="Switch learning track"
      className="inline-flex items-center gap-1 rounded-full border border-rose-200/70 bg-white/60 p-1 backdrop-blur-md shadow-[0_2px_12px_rgba(190,24,60,0.08)] font-[family-name:var(--font-inter)]"
    >
      {topics.map((topic) => {
        const isActive = topic.key === active;
        return (
          <Link
            key={topic.key}
            href={`/learning-hub/${topic.key}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() =>
              trackSectionClick(ANALYTICS_SECTIONS.LEARNING, `track_${topic.key}`)
            }
            className={`rounded-full px-4 py-1.5 text-xs sm:text-[13px] font-medium transition-colors ${
              isActive
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm'
                : 'text-zinc-600 hover:text-rose-700'
            }`}
          >
            {topic.title}
          </Link>
        );
      })}
    </nav>
  );
};

export default TopicSwitcher;
