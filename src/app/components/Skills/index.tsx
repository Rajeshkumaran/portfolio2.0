'use client';
import Image from 'next/image';
import AnimatedSection from '../AnimatedSection';
import ReactLogo from '../../assets/react.png';
import Redux from '../../assets/redux.png';
import NodeJs from '../../assets/nodejs.png';
import Js from '../../assets/js.webp';
import Ts from '../../assets/ts.png';
import Graphql from '../../assets/graphql.png';
import RoR from '../../assets/RoR.png';
import TailwindCss from '../../assets/tailwindcss.webp';
import openAI from '../../assets/openAI.webp';
import vite from '../../assets/vite.png';
import Github from '../../assets/github.png';
import CSharp from '../../assets/csharp.png';
import ReactQuery from '../../assets/reactQuery.png';
import AzureDevops from '../../assets/azureDevops.png';

const skills = [
  { name: 'React', logo: ReactLogo },
  { name: 'Redux', logo: Redux },
  { name: 'Node.js', logo: NodeJs },
  { name: 'Javascript', logo: Js },
  { name: 'Typescript', logo: Ts },
  { name: 'GraphQL', logo: Graphql },
  { name: 'Tailwind', logo: TailwindCss },
  { name: 'Ruby on Rails', logo: RoR },
  { name: 'Vite', logo: vite },
  { name: 'Generative AI', logo: openAI },
  { name: 'GitHub', logo: Github },
  { name: 'C#', logo: CSharp },
  { name: 'React Query', logo: ReactQuery },
  { name: 'Azure DevOps', logo: AzureDevops },
];

const Skills = () => {
  return (
    <AnimatedSection>
      <h2>Skills</h2>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 sm:gap-x-10">
        {skills.map((skill) => (
          <li key={skill.name} className="portfolio-skill">
            <Image src={skill.logo} alt="" className="w-6 h-6 object-contain" />
            <span>{skill.name}</span>
          </li>
        ))}
      </ul>
    </AnimatedSection>
  );
};

export default Skills;
