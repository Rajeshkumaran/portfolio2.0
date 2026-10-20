'use client';
import AnimatedSection from '../AnimatedSection';
import PortfolioRail from '../PortfolioRail';
import { trackSectionClick } from '../../lib/analytics';
import { ANALYTICS_SECTIONS } from '../../lib/constants';

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
      <h2>Patents</h2>
      <PortfolioRail label="Patents" itemType={patents.length === 1 ? 'patent' : 'patents'}>
        {patents.map((patent, index) => (
          <a
            key={`patent-${index}`}
            href={patent.link}
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-rail-card"
            onClick={() => {
              trackSectionClick(
                ANALYTICS_SECTIONS.PATENT_AND_AWARDS,
                patent.patentNumber
              );
            }}
          >
            <span className="portfolio-rail-meta portfolio-eyebrow">
              <span>{String(index + 1).padStart(2, '0')} / Patent</span>
              <span>Document</span>
            </span>
            <div className="portfolio-rail-artwork portfolio-patent-artwork" aria-hidden="true">
              <svg viewBox="0 0 240 240" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="58" y="26" width="124" height="174" rx="4" />
                <path d="M82 58h76M82 74h50M82 106h76M82 122h76M82 138h40" />
                <circle cx="154" cy="174" r="23" className="text-rose-600" />
                <path d="m142 194-5 23 17-8 17 8-5-23" className="text-rose-600" />
              </svg>
            </div>
            <h3 className="portfolio-rail-title">{patent.title}</h3>
            <p className="portfolio-eyebrow text-rose-600 break-all">{patent.patentNumber}</p>
            <p className="text-sm text-zinc-500 leading-relaxed">{patent.description}</p>
            <span className="portfolio-rail-action">
              View patent <span aria-hidden="true">{'\u2197'}</span>
            </span>
          </a>
        ))}
      </PortfolioRail>
    </AnimatedSection>
  );
};

export default Patents;
