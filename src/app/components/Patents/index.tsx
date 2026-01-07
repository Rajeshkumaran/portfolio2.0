'use client';
import Image from 'next/image';
import linkIcon from '../../assets/linkIcon.png';
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
    <div className="flex mb-5">
      <div className="flex-1 flex flex-col gap-4 pt-4 lg:pt-10">
        <h3 className="xs:text-sm lg:text-xl">Patents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3 pb-4">
          {patents.map((patent, index) => (
            <div
              key={`patent-${index}`}
              className="patent-card flex flex-col h-full cursor-pointer"
              onClick={() => {
                trackSectionClick(
                  ANALYTICS_SECTIONS.PATENT_AND_AWARDS,
                  patent.patentNumber
                );
                window.open(patent.link, '_blank');
              }}
            >
              <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-lg">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v2H6V6zm0 4h8v2H6v-2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {patent.patentNumber}
                  </h4>
                </div>
              </div>
              <div className="flex flex-col p-4 mt-auto bg-white">
                <h5 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                  {patent.title}
                </h5>
                <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                  {patent.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-blue-600 font-medium">
                    View Patent
                  </span>
                  <Image
                    src={linkIcon}
                    alt="link"
                    className="w-[16px] h-[16px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Patents;
