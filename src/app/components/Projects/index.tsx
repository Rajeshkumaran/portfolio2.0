'use client';
import Image from 'next/image';
import npm from '../../assets/npm.webp';
import linkIcon from '../../assets/linkIcon.png';
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
    <div className="flex mb-5">
      <div className="flex-1 flex flex-col gap-4 pt-4 lg:pt-10">
        <h3 className="xs:text-sm lg:text-xl">Projects</h3>
        <div className="flex gap-6 mt-3">
          {projects.map((project, index) => (
            <div
              key={`project-img-${index}`}
              className="card"
              onClick={() => {
                trackSectionClick(
                  ANALYTICS_SECTIONS.PROJECTS,
                  project.name.toLowerCase().replace(/\s+/g, '_')
                );
                window.open(project.link);
              }}
            >
              <div>
                <Image
                  src={project.image}
                  alt={project.name}
                  className="min-w-[150px] min-h-[150px] lg:w-[300px] lg:h-[300px] rounded-t-lg"
                />
              </div>
              <div className="flex p-4 items-center gap-3">
                <p className="text-black xs:text-xs">{project.name}</p>
                <Image
                  src={linkIcon}
                  alt="link"
                  className="w-[16px] h-[16px] cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    trackSectionClick(
                      ANALYTICS_SECTIONS.PROJECTS,
                      project.name.toLowerCase().replace(/\s+/g, '_')
                    );
                    window.open(project.link);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
