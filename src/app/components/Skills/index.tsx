'use client';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import AnimatedSection from '../AnimatedSection';
import { usePrefersReducedMotion } from '../../lib/hooks';
import skillBox from '../../assets/skillBox.png';
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

// Scattered resting spots on both sides of the box (x%, bottom%). No order.
const restPositions = [
  { x: 9, bottom: 14 },
  { x: 91, bottom: 18 },
  { x: 21, bottom: 24 },
  { x: 79, bottom: 30 },
  { x: 5, bottom: 38 },
  { x: 94, bottom: 44 },
  { x: 17, bottom: 48 },
  { x: 82, bottom: 54 },
  { x: 11, bottom: 62 },
  { x: 90, bottom: 66 },
  { x: 22, bottom: 72 },
  { x: 77, bottom: 74 },
  { x: 7, bottom: 80 },
  { x: 85, bottom: 12 },
];

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <AnimatedSection>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 mb-6 font-[family-name:var(--font-inter)]">
          Skills
        </h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <div key={skill.name} className="glass-chip flex items-center gap-2 px-3 py-2">
              <Image src={skill.logo} alt={skill.name} className="w-5 h-5 object-contain" />
              <span className="text-sm text-zinc-700 font-[family-name:var(--font-inter)]">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 mb-2 text-center font-[family-name:var(--font-inter)]">
        Skills
      </h2>
      <div ref={ref} className="skill-stage">
        <span aria-hidden className="skill-box__rays" />
        <span aria-hidden className="skill-box__aura" />

        <Image
          src={skillBox}
          alt="Open box of skills"
          className="skill-box-img"
          sizes="440px"
          priority
        />

        {skills.map((skill, i) => {
          const delay = 0.4 + i * 0.12;
          const { x, bottom } = restPositions[i];
          return (
            <motion.div
              key={skill.name}
              className="skill-logo group"
              style={{ transform: 'translateX(-50%)' }}
              initial={{ left: '50%', bottom: '34%', opacity: 0 }}
              animate={
                isInView
                  ? {
                      left: ['50%', '50%', `${x}%`],
                      bottom: ['34%', '78%', `${bottom}%`],
                      opacity: [0, 1, 1],
                    }
                  : {}
              }
              transition={{ duration: 1.5, delay, times: [0, 0.4, 1], ease: 'easeInOut' }}
            >
              <motion.span
                className="skill-logo__badge"
                initial={{ scale: 0.4 }}
                animate={isInView ? { scale: [0.4, 1, 1] } : {}}
                transition={{ duration: 1.5, delay, times: [0, 0.4, 1], ease: 'easeInOut' }}
                whileHover={{ y: -5 }}
              >
                <Image src={skill.logo} alt={skill.name} className="w-6 h-6 object-contain" />
              </motion.span>
              <span className="skill-logo__name opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {skill.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </AnimatedSection>
  );
};

export default Skills;
