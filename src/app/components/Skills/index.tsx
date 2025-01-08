import Image from 'next/image';
import React from '../../assets/react.png';
import Redux from '../../assets/redux.png';
import NodeJs from '../../assets/nodejs.png';
import Js from '../../assets/js.webp';
import Ts from '../../assets/ts.png';
import Graphql from '../../assets/graphql.png';
import RoR from '../../assets/RoR.png';
import TailwindCss from '../../assets/tailwindcss.webp';
import openAI from '../../assets/openAI.webp';
import vite from '../../assets/vite.png';

const skills = [
  {
    name: 'React',
    rating: 5,
    logo: React,
  },
  {
    name: 'Redux',
    rating: 5,
    logo: Redux,
  },
  {
    name: 'Node.js',
    rating: 4,
    logo: NodeJs,
  },
  {
    name: 'Javascript',
    rating: 5,
    logo: Js,
  },
  {
    name: 'Typescript',
    rating: 4,
    logo: Ts,
  },
  {
    name: 'GraphQL',
    rating: 4,
    logo: Graphql,
  },
  {
    name: 'Tailwind CSS',
    rating: 4,
    logo: TailwindCss,
  },
  {
    name: 'Ruby on Rails',
    rating: 3,
    logo: RoR,
  },
  {
    name: 'Vite',
    rating: 4,
    logo: vite,
  },
  {
    name: 'Generative AI',
    rating: 4,
    logo: openAI,
  },
];
const Skills = () => {
  return (
    <div className='flex flex-col my-10 gap-3 max-w-[100%]'>
      <h1 className='xs:text-sm lg:text-xl'>{`Skills I'm good at`}</h1>
      <div className='flex flex-wrap gap-5 lg:gap-8'>
        {skills.map((skill) => (
          <div key={skill.name} className='flex items-center gap-2 min-w-[100px] lg:min-w-[200px]'>
            <Image src={skill.logo} alt={skill.name} className='w-[32px]' />
            <div>
              <span className='xs:text-sm lg:text-md'>{skill.name}</span>
              <div className='flex items-center gap-1 text-xs'>
                {[...Array(skill.rating)].map((_, index) => (
                  <span key={index} className='text-amber-600'>
                    ★
                  </span>
                ))}
                {[...Array(5 - skill.rating)].map((_, index) => (
                  <span key={index} className='text-gray-300'>
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
