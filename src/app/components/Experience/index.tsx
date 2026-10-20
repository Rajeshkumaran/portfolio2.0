'use client';
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
}: {
  experience: (typeof experiences)[0];
}) => {
  return (
    <article className="portfolio-experience">
      <div>
        <p className="portfolio-eyebrow mb-2">{experience.period}</p>
        <p className="text-sm text-zinc-600">{experience.location}</p>
      </div>
      <div>
        <div className="mb-4">
          <h3 className="text-lg sm:text-xl font-medium text-zinc-900 mb-1">
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
        <ul className="space-y-2">
          {experience.highlights.map((highlight, i) => (
            <li
              key={i}
              className="text-sm text-zinc-600 leading-7 flex gap-3"
            >
              <span aria-hidden="true" className="text-rose-500 flex-shrink-0">
                &bull;
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};

const Experience = () => {
  return (
    <AnimatedSection>
      <h2>Experience</h2>
      <div>
        {experiences.map((experience) => (
          <TimelineItem
            key={`${experience.company}-${experience.role}`}
            experience={experience}
          />
        ))}
      </div>
    </AnimatedSection>
  );
};

export default Experience;
