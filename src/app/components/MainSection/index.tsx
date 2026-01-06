'use client';
import Image from 'next/image';
import Photo from '../../assets/photo2.png';
import Linkedin from '../../assets/linkedIn.png';
import Github from '../../assets/github.png';
import Twitter from '../../assets/twitter.png';

const MainSection = () => {
  return (
    <div className="flex mt-10 flex-col-reverse lg:flex-row text-white">
      <div className="flex-1 flex flex-col gap-4 pt-4 lg:pt-10">
        <h3>Hello, my name is </h3>
        <h1 className="text-3xl lg:text-5xl">Rajesh K</h1>
        <div className="flex items-center gap-3">
          <p className="inline-block w-[30px] h-1 bg-amber-600 " />
          <span className="text-lg lg:text-xl"> Software Engineer</span>
        </div>
        <span className="text-sm text-gray-200">
          As a passionate and enthusiastic engineer, I thrive on solving
          challenging problems and exploring new technologies. My contributions
          to open sources such as Npm and Stack Overflow reflect my love for
          learning and sharing knowledge. In my free time, I enjoy playing
          cricket and watching movies.
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
                  },
                  {
                    image: Github,
                    link: 'https://github.com/Rajeshkumaran',
                  },
                  {
                    image: Twitter,
                    link: 'https://x.com/Rajeshrajk07',
                  },
                ].map(({ image, link }, index) => (
                  <Image
                    src={image}
                    alt="Rajesh"
                    className="w-[32px] h-[32px]"
                    key={index}
                    onClick={() => {
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
