'use client';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
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

const skills = [
  { name: 'React', rating: 5, logo: ReactLogo },
  { name: 'Redux', rating: 5, logo: Redux },
  { name: 'Node.js', rating: 4, logo: NodeJs },
  { name: 'Javascript', rating: 5, logo: Js },
  { name: 'Typescript', rating: 4, logo: Ts },
  { name: 'GraphQL', rating: 4, logo: Graphql },
  { name: 'Tailwind CSS', rating: 4, logo: TailwindCss },
  { name: 'Ruby on Rails', rating: 3, logo: RoR },
  { name: 'Vite', rating: 4, logo: vite },
  { name: 'Generative AI', rating: 4, logo: openAI },
];

const SkillBar = ({ skill, index }: { skill: typeof skills[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const percentage = (skill.rating / 5) * 100;

  return (
    <div ref={ref} className="flex items-center gap-3">
      <Image src={skill.logo} alt={skill.name} className="w-[28px] h-[28px] flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm text-zinc-200 font-[family-name:var(--font-inter)]">{skill.name}</span>
          <span className="text-xs text-zinc-500 font-[family-name:var(--font-inter)]">{percentage}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"
            initial={{ width: 0 }}
            animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
            transition={{ duration: 0.8, delay: index * 0.08, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
};

const Skills = () => {
  return (
    <AnimatedSection>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-100 mb-6 sm:mb-8 font-[family-name:var(--font-inter)]">
        Skills
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-4 sm:gap-y-5">
        {skills.map((skill, index) => (
          <SkillBar key={skill.name} skill={skill} index={index} />
        ))}
      </div>
    </AnimatedSection>
  );
};

export default Skills;
