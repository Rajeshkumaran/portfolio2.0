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
      'Architected a multi-tenant admin configuration platform for multi-agent orchestration, enabling enterprise-wide deployment of a Super ESS Agent with tenant-specific customization.',
      'Designed a generic connection setup framework that unified migration of 35+ integrations from Angular to React, reducing per-integration development effort by 70%.',
      'Integrated a Power BI connector into Viva Goals, enabling live data surfacing in OKR dashboards and improving user engagement by 25%.',
      'Redesigned OKR check-in and alignment views with a simplified UX, driving a 35% increase in weekly active engagement.',
    ],
  },
  {
    company: 'Ally.io',
    role: 'Software Engineer',
    period: 'Dec 2020 - Nov 2021',
    location: 'Chennai, India',
    highlights: [
      'Built an embeddable React.js SPA for visualizing organizational OKRs, shipped as a white-label solution for enterprise customers including GitLab.',
      'Implemented a garbage-collection layer to prune stale Redux state and tear down inactive Firestore listeners, reducing client-side memory footprint.',
      'Developed a JIRA Marketplace plugin for Ally OKRs, growing the user base by 20% and increasing cross-platform engagement.',
    ],
  },
  {
    company: 'CaratLane',
    subtitle: 'A Tanishq Partnership',
    role: 'Software Engineer II',
    period: 'May 2020 - Dec 2020',
    location: 'Chennai, India',
    highlights: [
      'Improved product page load performance by 20% through code-splitting and lazy loading, lifting Lighthouse SEO scores by 15%.',
      'Built a ratings & reviews system with paginated GraphQL queries, contributing to a 20% increase in organic search traffic.',
    ],
  },
  {
    company: 'CaratLane',
    subtitle: 'A Tanishq Partnership',
    role: 'Software Engineer I',
    period: 'May 2018 - May 2020',
    location: 'Chennai, India',
    highlights: [
      'Built the entire CaratLane product page as a responsive web application using React.js, Node.js, and Redux-Saga, serving as the primary shopping experience for millions of users.',
      'Developed a "Store Check-in" feature bridging online and in-store experiences, strengthening the omni-channel customer journey.',
      'Created a shared component library (dropdown, datepicker, modals) adopted across multiple page surfaces.',
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
          className="w-3 h-3 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 ring-4 ring-rose-400/10 z-10"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        />
        {!isLast && (
          <motion.div
            className="w-[1px] flex-1 bg-gradient-to-b from-rose-400/30 to-transparent"
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
            <h3 className="text-base sm:text-lg font-semibold text-zinc-900 font-[family-name:var(--font-inter)]">
              {experience.role}
            </h3>
            <p className="text-sm text-rose-600 font-medium font-[family-name:var(--font-inter)]">
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
            <span className="text-xs text-zinc-400 font-[family-name:var(--font-inter)]">
              {experience.location}
            </span>
          </div>
        </div>
        <ul className="space-y-2">
          {experience.highlights.map((highlight, i) => (
            <li
              key={i}
              className="text-xs sm:text-sm text-zinc-600 leading-relaxed flex gap-2"
            >
              <span className="text-rose-500/70 mt-1 flex-shrink-0">
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
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 mb-6 sm:mb-8 font-[family-name:var(--font-inter)]">
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
