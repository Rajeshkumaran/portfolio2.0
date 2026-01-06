'use client';
import Image from 'next/image';
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
        <span className="text-sm text-gray-200">
          As a passionate software engineer with 7.5+ years of experience, I
          specialize in building scalable applications and solving complex
          technical challenges. I actively contribute to the open-source
          community through NPM packages and Stack Overflow, sharing knowledge
          and best practices with fellow developers. When I am not coding, I
          watch movies, play badminton, travel, and more.
        </span>
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
              <div className="flex gap-3 ">
                {[
                  {
                    image: Linkedin,
                    link: 'https://www.linkedin.com/in/rajeshk07/',
                    platform: 'linkedin',
                  },
                  {
                    image: Github,
                    link: 'https://github.com/Rajeshkumaran',
                    platform: 'github',
                  },
                  {
                    image: Twitter,
                    link: 'https://x.com/Rajeshrajk07',
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
