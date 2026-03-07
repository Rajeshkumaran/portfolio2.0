'use client';
import Image from 'next/image';
import AnimatedSection from '../AnimatedSection';
import npm from '../../assets/npm.webp';
import { trackSectionClick } from '../../lib/analytics';
import { ANALYTICS_SECTIONS } from '../../lib/constants';

import './index.css';

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
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-100 mb-6 sm:mb-8 font-[family-name:var(--font-inter)]">
        Open source projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project, index) => (
          <AnimatedSection key={`project-${index}`} delay={index * 0.1}>
            <div
              className="project-card glass-card cursor-pointer h-full flex flex-col"
              onClick={() => {
                trackSectionClick(
                  ANALYTICS_SECTIONS.PROJECTS,
                  project.name.toLowerCase().replace(/\s+/g, '_')
                );
                window.open(project.link);
              }}
            >
              <div className="project-image-wrapper">
                <Image
                  src={project.image}
                  alt={project.name}
                  className="w-full h-[160px] lg:h-[200px] object-cover"
                />
              </div>
              <div className="flex items-center gap-3 p-4 mt-auto">
                <p className="text-zinc-200 text-sm flex-1 font-[family-name:var(--font-inter)]">
                  {project.name}
                </p>
                <svg
                  className="w-4 h-4 text-violet-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default Projects;
