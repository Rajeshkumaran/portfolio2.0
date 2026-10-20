'use client';
import Image from 'next/image';
import AnimatedSection from '../AnimatedSection';
import PortfolioRail from '../PortfolioRail';
import blogGitBasics from '../../assets/blogGitBasics.webp';
import pursuitOfHappiness from '../../assets/pursuitOfHappiness.webp';
import blogPersonalAssistant from '../../assets/blogPersonalAssistant.webp';
import secondBrainThumbnail from '../../assets/secondBrainThumbnail.png';
import { trackSectionClick } from '../../lib/analytics';
import { ANALYTICS_SECTIONS } from '../../lib/constants';

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
      <h2>Writing</h2>
      <PortfolioRail label="Writing" itemType="articles">
        {blogs.map((blog, index) => (
          <a
            key={blog.link}
            href={blog.link}
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-rail-card"
            onClick={() => {
              trackSectionClick(
                ANALYTICS_SECTIONS.BLOGS,
                blog.name.toLowerCase().replace(/\s+/g, '_')
              );
            }}
          >
            <span className="portfolio-rail-meta portfolio-eyebrow">
              <span>{String(index + 1).padStart(2, '0')} / Article</span>
              <span>Medium</span>
            </span>
            <div className="portfolio-rail-artwork">
              <Image
                src={blog.image}
                alt=""
                className="portfolio-rail-image"
                sizes="(max-width: 767px) 75vw, 360px"
              />
            </div>
            <h3 className="portfolio-rail-title">
              {blog.name}
            </h3>
            <span className="portfolio-rail-action">
              Read article <span aria-hidden="true">{'\u2197'}</span>
            </span>
          </a>
        ))}
      </PortfolioRail>
    </AnimatedSection>
  );
};

export default Blogs;
