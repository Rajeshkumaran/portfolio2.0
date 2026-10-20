'use client';
import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { usePrefersReducedMotion } from '@/app/lib/hooks';
import JourneyRoad, { JourneyCheckpointIcon, JourneyMountains } from '../JourneyScenery';
import {
  formatJourneyDate,
  groupJourneyMoments,
  type JourneyCategory,
  type JourneyMoment,
} from '@/app/lib/journey';

const JourneyStop = ({
  moment,
  category,
  timelineId,
  compact,
  animated,
  preview,
}: {
  moment: JourneyMoment;
  category?: JourneyCategory;
  timelineId: string;
  compact: boolean;
  animated: boolean;
  preview: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [manualExpanded, setManualExpanded] = useState<boolean | null>(null);
  const titleButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const expanded = manualExpanded ?? (!compact || hovered || focused);
  const titleId = `${timelineId}-${moment.id}`;
  const panelId = `${titleId}-details`;
  const icon = moment.icon ?? category?.icon ?? 'pin';
  const toggle = () => {
    if (expanded && panel.current?.contains(document.activeElement)) titleButton.current?.focus();
    setManualExpanded(!expanded);
  };

  return (
    <li
      className="journey-stop"
      data-expanded={expanded}
      onPointerEnter={(event) => {
        if (compact && event.pointerType !== 'touch') {
          setHovered(true);
          setManualExpanded((value) => value === false ? null : value);
        }
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(true);
          if (compact) setManualExpanded((value) => value === false ? null : value);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && expanded) {
          event.preventDefault();
          event.stopPropagation();
          setManualExpanded(false);
          if (panel.current?.contains(document.activeElement)) titleButton.current?.focus();
        }
      }}
    >
      <span className="journey-checkpoint">
        <motion.button
          type="button"
          className="journey-pin"
          aria-label={`Details for ${moment.title}`}
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={toggle}
          initial={false}
          whileInView={animated ? { scale: [0.9, 1] } : undefined}
          animate={!animated ? { scale: 1 } : undefined}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: animated ? 0.3 : 0 }}
        >
          <JourneyCheckpointIcon icon={icon} />
        </motion.button>
      </span>
      <div className="journey-stop-meta portfolio-eyebrow">
        <time dateTime={moment.date}>{formatJourneyDate(moment.date)}</time>
        <span>{category?.label}</span>
      </div>
      <motion.article
        className="journey-story"
        aria-labelledby={titleId}
        initial={false}
        whileInView={animated ? { opacity: [0.5, 1], y: [8, 0] } : undefined}
        animate={!animated ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: animated ? 0.45 : 0 }}
      >
        <h3 id={titleId}>
          <button
            ref={titleButton}
            type="button"
            className="journey-story-toggle"
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={toggle}
          >
            <span>{moment.title}</span>
            <ChevronDown aria-hidden="true" focusable="false" />
          </button>
        </h3>
        <div
          ref={panel}
          id={panelId}
          className="journey-story-panel"
          data-expanded={expanded}
          aria-hidden={!expanded}
          inert={!expanded}
        >
          <div className="journey-story-panel-inner">
            <div className="journey-story-content">
              {preview && <p className="journey-example-label">Example moment</p>}
              {moment.images && moment.images.length > 0 && (
                <div className="journey-story-photos" role="group" aria-label={`Photos from ${moment.title}`}>
                  {moment.images.map((image, index) => {
                    const landscapePhoto = image.orientation === 'landscape';
                    return (
                      <figure
                        key={`${image.src}-${index}`}
                        className="journey-story-photo"
                        data-orientation={image.orientation ?? 'portrait'}
                      >
                        <div className="journey-photo-frame">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            width={landscapePhoto ? 1200 : 800}
                            height={landscapePhoto ? 800 : 1000}
                            sizes={landscapePhoto
                              ? '(max-width: 767px) calc(100vw - 132px), 384px'
                              : '(max-width: 383px) calc(100vw - 132px), 256px'}
                            className="journey-story-image"
                          />
                        </div>
                        <figcaption>
                          <span>{formatJourneyDate(moment.date)}</span>
                          <span>{category?.label}</span>
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>
              )}
              <p className="journey-story-body">{moment.story}</p>
              {moment.links && moment.links.length > 0 && (
                <ul className="journey-story-links" aria-label={`Links for ${moment.title}`} role="list">
                  {moment.links.map((link, index) => (
                    <li key={`${link.href}-${index}`}>
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        {link.label} <span aria-hidden="true">{'\u2197'}</span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {moment.reflection && (
                <details className="journey-reflection">
                  <summary>What stayed with me</summary>
                  <p>{moment.reflection}</p>
                </details>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </li>
  );
};

const JourneyTimeline = ({
  moments,
  categories,
  preview,
}: {
  moments: JourneyMoment[];
  categories: JourneyCategory[];
  preview: boolean;
}) => {
  const [category, setCategory] = useState('all');
  const [compact, setCompact] = useState(false);
  const [motionOn, setMotionOn] = useState(true);
  const prefersReduced = usePrefersReducedMotion();
  const animated = motionOn && !prefersReduced;
  const timelineId = useId();
  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const groups = groupJourneyMoments(moments, category);
  const visibleCount = groups.reduce((total, group) => total + group.moments.length, 0);
  const filters: JourneyCategory[] = [
    { id: 'all', label: 'All moments', icon: 'pin' },
    ...categories,
  ];

  return (
    <section id="journey-route" className="journey-route" aria-label="Journey timeline" data-motion={animated ? 'on' : 'off'}>
      <div className="journey-toolbar">
        <div className="journey-filters" role="group" aria-label="Filter moments">
          {filters.map((filter) => {
            const count = moments.filter((moment) => filter.id === 'all' || moment.category === filter.id).length;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={category === filter.id}
                aria-controls={timelineId}
                disabled={count === 0}
                onClick={() => setCategory(filter.id)}
              >
                <JourneyCheckpointIcon icon={filter.icon ?? 'pin'} />
                {filter.label} <span>{count}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="journey-motion-toggle"
          aria-label="Animate the journey"
          aria-pressed={animated}
          disabled={prefersReduced}
          onClick={() => setMotionOn((value) => !value)}
        >
          {prefersReduced ? 'Reduced motion' : animated ? 'Motion on' : 'Motion off'}
        </button>
      </div>

      <div className="journey-route-caption">
        <p className="portfolio-eyebrow" role="status">
          {visibleCount} {preview ? 'example ' : ''}{visibleCount === 1 ? 'moment' : 'moments'}
          {category !== 'all' && ` / ${categories.find((item) => item.id === category)?.label}`}
        </p>
        <span className="portfolio-eyebrow">Every turn has a story</span>
      </div>

      <div id={timelineId} className="journey-route-stories">
        {groups.length === 0 ? (
          <div className="journey-empty">
            <h2>No moments on this stretch yet.</h2>
            <p>There will be stories here when they are ready to be shared.</p>
          </div>
        ) : (
          <>
            <div className="journey-bookend portfolio-eyebrow">
              <span aria-hidden="true" />
              A place to begin
            </div>
            <div className="journey-road-track">
              <JourneyRoad className="journey-road-segment" animated={animated} continuous />
              {groups.map((group) => (
                <section key={group.year} className="journey-year-group" aria-labelledby={`${timelineId}-${group.year}`}>
                  <header className="journey-year-heading">
                    <h2 id={`${timelineId}-${group.year}`} className="journey-year">{group.year}</h2>
                    <p className="portfolio-eyebrow">
                      {group.moments.length} {group.moments.length === 1 ? 'moment' : 'moments'}
                    </p>
                    <JourneyMountains className="journey-year-mountains" />
                  </header>
                  <ol className="journey-year-stories" role="list">
                    {group.moments.map((moment) => (
                      <JourneyStop
                        key={moment.id}
                        moment={moment}
                        category={categories.find((item) => item.id === moment.category)}
                        timelineId={timelineId}
                        compact={compact}
                        animated={animated}
                        preview={preview}
                      />
                    ))}
                  </ol>
                </section>
              ))}
            </div>
            <div className="journey-bookend journey-bookend-end portfolio-eyebrow">
              <span aria-hidden="true" />
              {preview ? 'The rest is yours to tell' : 'The road goes on'}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default JourneyTimeline;
