'use client';
import Image from 'next/image';
import {
  RESUME_LINK,
  SOCIAL_LINKS,
  PROFILE_SUMMARY,
} from '@/app/lib/constants';
import Photo from '../../assets/photo2.png';
import Linkedin from '../../assets/linkedIn.png';
import Github from '../../assets/github.png';
import Twitter from '../../assets/twitter.png';
import { trackSocialClick } from '../../lib/analytics';

const MainSection = () => {
  return (
    <div className="flex mt-10 flex-col-reverse lg:flex-row text-white">
      <div className="flex-1 flex flex-col gap-4 pt-4 lg:pt-10">
        <h3>👋 Hey there!</h3>
        <h1 className="text-3xl lg:text-5xl font-bold text-amber-600">
          Rajesh K
        </h1>
        <div className="flex items-center gap-3">
          <p className="inline-block w-[30px] h-1 bg-amber-600 " />
          <span className="text-lg lg:text-xl"> Software Engineer</span>
        </div>
        <span className="text-sm text-gray-200">{PROFILE_SUMMARY}</span>
        <div className="mt-2">
          <a
            href={RESUME_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-600 hover:bg-amber-700 text-white text-sm px-4 py-2 rounded transition-colors inline-block"
            onClick={() => trackSocialClick('resume')}
          >
            📄 View Resume
          </a>
        </div>
        <div className="flex flex-col gap-3 mt-3">
          <p className="inline-block w-[100%] h-[1px] bg-amber-600 lg:bg-gray-300" />
          <div className="flex gap-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center">
              <div className="flex items-center">
                <span className="text-4xl">7.5</span>
                <span className="text-xl text-amber-600">+</span>
              </div>

              <div className="max-w-[105px] ml-0 lg:ml-3">
                <span className="text-xs leading-none">
                  Years of experience
                </span>
              </div>
            </div>

            <div className="flex flex-1 justify-between gap-3 flex-col lg:flex-row">
              <div className="flex flex-col gap-2 justify-center lg:ml-3">
                <span className="text-xs text-amber-600">+91 9884142330</span>
                <span className="text-xs text-amber-600">
                  rajeshkumaran1996@gmail.com
                </span>
              </div>
              <div className="flex gap-3">
                {[
                  {
                    image: Linkedin,
                    link: SOCIAL_LINKS.LINKEDIN,
                    platform: 'linkedin',
                  },
                  {
                    image: Github,
                    link: SOCIAL_LINKS.GITHUB,
                    platform: 'github',
                  },
                  {
                    image: Twitter,
                    link: SOCIAL_LINKS.TWITTER,
                    platform: 'twitter',
                  },
                ].map(({ image, link, platform }, index) => (
                  <Image
                    src={image}
                    alt="Rajesh"
                    className="w-[32px] h-[32px] cursor-pointer hover:opacity-80 transition-opacity"
                    key={index}
                    onClick={() => {
                      trackSocialClick(platform);
                      window.open(link);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex lg:justify-end">
        <Image
          src={Photo}
          alt="Rajesh"
          className="max-w-[100px] lg:max-w-[450px]"
        />
      </div>
    </div>
  );
};

export default MainSection;
