'use client';
import AnimatedSection from '../AnimatedSection';
import { trackSectionClick } from '../../lib/analytics';
import { ANALYTICS_SECTIONS } from '../../lib/constants';

import './index.css';

const patents = [
  {
    title: 'Machine-Learning-Based OKR Generation',
    patentNumber: 'US20240330602A1',
    link: 'https://drive.google.com/file/d/1ZXqwcZvVUhIgL3ubeEWo-HlLX70CC-k5/view?usp=sharing',
    description:
      'A comprehensive patent on Machine-Learning-Based OKR Generation.',
  },
];

const Patents = () => {
  return (
    <AnimatedSection>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 mb-6 sm:mb-8 font-[family-name:var(--font-inter)]">
        Patents
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {patents.map((patent, index) => (
          <div
            key={`patent-${index}`}
            className="patent-card glass-card cursor-pointer p-6"
            onClick={() => {
              trackSectionClick(
                ANALYTICS_SECTIONS.PATENT_AND_AWARDS,
                patent.patentNumber
              );
              window.open(patent.link, '_blank');
            }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-700/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-rose-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v2H6V6zm0 4h8v2H6v-2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-rose-600 font-mono mb-1 font-[family-name:var(--font-inter)]">
                  {patent.patentNumber}
                </p>
                <h3 className="text-sm font-semibold text-zinc-900 mb-2">
                  {patent.title}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {patent.description}
                </p>
                <div className="flex items-center gap-1 mt-3 text-rose-600">
                  <span className="text-xs font-medium font-[family-name:var(--font-inter)]">View Patent</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default Patents;
