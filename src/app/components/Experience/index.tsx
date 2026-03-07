'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import AnimatedSection from '../AnimatedSection';

const experiences = [
  {
    company: 'Microsoft',
    role: 'Software Engineer II (L62)',
    period: 'Nov 2021 - Present',
    location: 'Bengaluru, India',
    highlights: [
      'Architected an admin configuration platform for multi-agent setups, enabling deployment of a Super ESS Agent across organizations with tenant-specific customization.',
      'Contributed to the ESS (Employee Self-Service) Copilot, an AI-powered assistant streamlining HR processes.',
      'Developed a generic connection setup wizard, streamlining migration of 35+ integrations from Angular to React, reducing development time by 70%.',
      'Integrated a PowerBI connector into Viva Goals, improving data accessibility and user engagement by 25%.',
      'Designed and implemented simplified OKR views, enhancing user experience for easy check-ins and alignments, increasing user engagement by 35%.',
    ],
  },
  {
    company: 'Ally.io',
    role: 'Software Engineer',
    period: 'Dec 2020 - Nov 2021',
    location: 'Chennai, India',
    highlights: [
      'Developed a React.js SPA for visualizing organizational OKRs, embedded into customer pages (tailored for GitLab).',
      'Implemented a garbage collection layer to remove unused Redux store data and disconnect inactive Firestore connections.',
      'Built a JIRA Marketplace plugin for Ally OKRs, attracting 20% more users and boosting engagement.',
    ],
  },
  {
    company: 'CaratLane',
    subtitle: 'A Tanishq Partnership',
    role: 'Software Engineer II',
    period: 'May 2020 - Dec 2020',
    location: 'Chennai, India',
    highlights: [
      'Enhanced jewellery product page performance by 20% through component offloading and lazy loading, boosting SEO scores by 15%.',
      'Implemented ratings & reviews with pagination and a GraphQL API, increasing organic traffic by 20%.',
    ],
  },
  {
    company: 'CaratLane',
    subtitle: 'A Tanishq Partnership',
    role: 'Software Engineer I',
    period: 'May 2018 - May 2020',
    location: 'Chennai, India',
    highlights: [
      'Developed the entire CaratLane website product pages (responsive) from scratch using React.js, Node.js, and Redux-Saga.',
      'Built a "Store Check-in" feature bridging the gap in omni-channel experience.',
      'Created reusable React components (dropdown, datepicker, etc.) used across multiple pages.',
    ],
  },
];

const TimelineItem = ({
  experience,
  index,
  isLast,
}: {
  experience: (typeof experiences)[0];
  index: number;
  isLast: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="relative flex gap-4 sm:gap-6 lg:gap-8">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          className="w-3 h-3 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 ring-4 ring-violet-400/10 z-10"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        />
        {!isLast && (
          <motion.div
            className="w-[1px] flex-1 bg-gradient-to-b from-violet-400/30 to-transparent"
            initial={{ scaleY: 0, originY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
          />
        )}
      </div>

      {/* Content card */}
      <motion.div
        className="glass-card p-4 sm:p-5 mb-6 sm:mb-8 flex-1"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.1 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 mb-3">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-zinc-100 font-[family-name:var(--font-inter)]">
              {experience.role}
            </h3>
            <p className="text-sm text-violet-400 font-medium font-[family-name:var(--font-inter)]">
              {experience.company}
              {experience.subtitle && (
                <span className="text-zinc-500 font-normal">
                  {' '}
                  &middot; {experience.subtitle}
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-col sm:items-end">
            <span className="text-xs text-zinc-500 font-[family-name:var(--font-inter)] whitespace-nowrap">
              {experience.period}
            </span>
            <span className="text-xs text-zinc-600 font-[family-name:var(--font-inter)]">
              {experience.location}
            </span>
          </div>
        </div>
        <ul className="space-y-2">
          {experience.highlights.map((highlight, i) => (
            <li
              key={i}
              className="text-xs sm:text-sm text-zinc-400 leading-relaxed flex gap-2"
            >
              <span className="text-violet-400/60 mt-1 flex-shrink-0">
                &bull;
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

const Experience = () => {
  return (
    <AnimatedSection>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-100 mb-6 sm:mb-8 font-[family-name:var(--font-inter)]">
        Experience
      </h2>
      <div className="ml-1">
        {experiences.map((experience, index) => (
          <TimelineItem
            key={`${experience.company}-${experience.role}`}
            experience={experience}
            index={index}
            isLast={index === experiences.length - 1}
          />
        ))}
      </div>
    </AnimatedSection>
  );
};

export default Experience;
