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
    link: 'https://ppl-ai-file-upload.s3.amazonaws.com/patents/US20240330602A1.pdf?response-content-disposition=inline%3B%20filename%3D%22US20240330602A1.pdf%22&response-content-type=application%2Fpdf&AWSAccessKeyId=ASIA2F3EMEYE6GUGJKII&Signature=z2rucqSONy4cJzgYfDy%2BAdIfLn4%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEJT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEyHqrwxi82tsBIkF%2FFpzwuawIIn69fvbbD6ukB0VtiEAiA8UePyxMiohhmXpDXhYpJtkIORjpSpZL2xtyRwR6UtkyrzBAhdEAEaDDY5OTc1MzMwOTcwNSIMPiNfsBLDki15LMj5KtAE6oAOlNlFJhIsEee6nNfNIvtvTVlfl3taVNEL4NnwP5jFgejwxTKrJad2oUgGvtCcLhawU9L%2BW2HWVeYc7lQEOovwS71QaDNSGXTbp3dZQajLqX3u5dj5igBlnAehVo%2FyzcRXQOreU8uG7vS2tzI0mzHhMT%2F%2FSbVYZ1u%2BCqDy9bA5%2BkvzD2YBYncvD%2B03YBNEwnzc3rrcPB4XM9qqKdzWUKjit%2F7Oe9ZX6T4JxqGLlR4kwuZFIrF%2Bs11e1%2FNEU6IZSSGNY1XCYNK4GqsMuEezqNCEO4gqMiMClGaq9YYAWG2lzOiPMeqUo%2FaSlpXMDPYCjTN%2BN%2BJjjreT99Gdmds8QAYKfzuw5JyaZ%2B%2B7O6PL1MRGPtBMeJgbLRzt9AbhGdvKIIqy%2BfRAAAYAQCFbcavTX%2BpkLXNhvIBC0RM6M4cgStOCCok12wDITei%2F%2FLVEAtgYOD8zQQhB5PkS14ZqBO5UKrktJa4XYtPBDEBPyNlDFkr%2F9Q%2FovLq516NJOpVdj2v1WzPOfi8xVcMOWEPETGcdeVmoKhzd6Ss99MtZ3xDvAD8hQvBtvu5fLkjdup%2BbywzSCJR0i6g1UZHwmptOooqo5G%2BMVL6Ho5UfCfW9iKs5Hh8MnupKyKPN3DCTKytXTjf8UcLMTSsmrMm9G50zwxwNlsyQq02M2LxQl%2BvYqgIgfALauymnIjtvcHl5hmYKimPiXaIRoymFigbXwfu%2FVpci8yVhWJnTR8%2B%2FrDAfKxrsse62JWvDrqIetEk0iz2hX4KWwHUjcM%2B8MJXB7GEcm4H2yDCm6vPKBjqZATNgZHk4QnjcCzh3qpEFOtZ%2FverptnCOjP479XW3ua9fAkzyjMcEdu3mqSelNdjkghNqi3BIsi9wYjeYMp7i%2BtcSfAKv6HOYlcQdH4tNlGvbPthGl0qcRPNUlvYMZgXW3yG7uRycz3LQC6hB2pI3b4Oe7noQMV5siFY4xUvNu2XDeWSI%2B0DGbaDdFiSpkUq1XA6tCEdly1HvHw%3D%3D&Expires=1767703946',
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
