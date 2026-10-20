'use client';
import Image from 'next/image';
import AnimatedSection from '../AnimatedSection';
import PortfolioRail from '../PortfolioRail';
import npm from '../../assets/npm.webp';
import { trackSectionClick } from '../../lib/analytics';
import { ANALYTICS_SECTIONS } from '../../lib/constants';

const projects = [
  {
    name: 'React custom tooltip',
    image: npm,
    link: 'https://www.npmjs.com/package/react-custom-tooltip',
  },
  {
    name: 'React date picker',
    image: npm,
    link: 'https://www.npmjs.com/package/custom-reactdatepicker',
  },
];

const Projects = () => {
  return (
    <AnimatedSection>
      <h2>Open source projects</h2>
      <PortfolioRail label="Open source projects" itemType="packages">
        {projects.map((project, index) => (
          <a
            key={project.link}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-rail-card"
            onClick={() => {
              trackSectionClick(
                ANALYTICS_SECTIONS.PROJECTS,
                project.name.toLowerCase().replace(/\s+/g, '_')
              );
            }}
          >
            <span className="portfolio-rail-meta portfolio-eyebrow">
              <span>{String(index + 1).padStart(2, '0')} / Package</span>
              <span>npm</span>
            </span>
            <div className="portfolio-rail-artwork">
              <Image
                src={project.image}
                alt=""
                className="portfolio-rail-image portfolio-rail-image--package"
                sizes="(max-width: 767px) 75vw, 480px"
              />
            </div>
            <h3 className="portfolio-rail-title">
              {project.name}
            </h3>
            <span className="portfolio-rail-action">
              View package <span aria-hidden="true">{'\u2197'}</span>
            </span>
          </a>
        ))}
      </PortfolioRail>
    </AnimatedSection>
  );
};

export default Projects;
