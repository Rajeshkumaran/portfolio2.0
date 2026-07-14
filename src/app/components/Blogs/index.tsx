'use client';
import Image from 'next/image';
import AnimatedSection from '../AnimatedSection';
import blogGitBasics from '../../assets/blogGitBasics.webp';
import pursuitOfHappiness from '../../assets/pursuitOfHappiness.webp';
import blogPersonalAssistant from '../../assets/blogPersonalAssistant.webp';
import secondBrainThumbnail from '../../assets/secondBrainThumbnail.png';
import { trackSectionClick } from '../../lib/analytics';
import { ANALYTICS_SECTIONS } from '../../lib/constants';

import './index.css';

const blogs = [
  {
    name: 'From Scattered Data to a Second Brain',
    image: secondBrainThumbnail,
    link: 'https://rajeshkumaran1996.medium.com/from-scattered-data-to-a-second-brain-ee3896e25f0f',
  },
  {
    name: 'Building a Personal Assistant with Multi-Agent Architecture',
    image: blogPersonalAssistant,
    link: 'https://rajeshkumaran1996.medium.com/building-a-personal-assistant-with-multi-agent-architecture-using-langchain-f8066383f9b3',
  },
  {
    name: 'Pursuit of happiness',
    image: pursuitOfHappiness,
    link: 'https://rajeshkumaran1996.medium.com/my-pursuit-of-happiness-moment-62735b75e286',
  },
  {
    name: 'Git Basics',
    image: blogGitBasics,
    link: 'https://rajeshkumaran1996.medium.com/git-basics-for-beginners-fcf762304bcc',
  },
];

const Blogs = () => {
  return (
    <AnimatedSection>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 mb-6 sm:mb-8 font-[family-name:var(--font-inter)]">
        Writing
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {blogs.map((blog, index) => (
          <AnimatedSection key={`blog-${index}`} delay={index * 0.1}>
            <div
              className="blog-card glass-card cursor-pointer h-full flex flex-col"
              onClick={() => {
                trackSectionClick(
                  ANALYTICS_SECTIONS.BLOGS,
                  blog.name.toLowerCase().replace(/\s+/g, '_')
                );
                window.open(blog.link);
              }}
            >
              <div className="blog-image-wrapper">
                <Image
                  src={blog.image}
                  alt={blog.name}
                  className="w-full h-[140px] sm:h-[160px] lg:h-[180px] object-cover"
                />
              </div>
              <div className="flex items-center gap-3 p-4 mt-auto">
                <p className="text-zinc-800 text-xs flex-1 line-clamp-2 font-[family-name:var(--font-inter)]">
                  {blog.name}
                </p>
                <svg
                  className="w-4 h-4 text-rose-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default Blogs;
