'use client';
import { useId } from 'react';
import { motion } from 'framer-motion';
import {
  Bike, BookOpen, Briefcase, Car, CodeXml, Compass, CornerUpRight,
  Dumbbell, Flag, Heart, MapPin, Motorbike, Mountain, Plane, Star, Trophy,
  type LucideIcon,
} from 'lucide-react';
import type { JourneyIcon } from '@/app/lib/journey';

const roadPath = (start: number, end: number) => {
  let path = `M120 ${start}`;
  for (let y = start; y < end; y += 200) {
    path += ` C82 ${y + 70} 158 ${y + 130} 120 ${y + 200}`;
  }
  return path;
};

const ROAD = roadPath(0, 400);
// Extend beyond each tile so clipped stroke caps cannot leave seams.
const CONTINUOUS_ROAD = roadPath(-200, 600);

const checkpointIcons: Record<JourneyIcon, LucideIcon> = {
  pin: MapPin,
  flag: Flag,
  turn: CornerUpRight,
  compass: Compass,
  heart: Heart,
  mountain: Mountain,
  briefcase: Briefcase,
  book: BookOpen,
  star: Star,
  plane: Plane,
  dumbbell: Dumbbell,
  trophy: Trophy,
  bike: Bike,
  motorbike: Motorbike,
  car: Car,
  code: CodeXml,
};

export const JourneyCheckpointIcon = ({ icon }: { icon: JourneyIcon }) => {
  const Icon = checkpointIcons[icon];
  return <Icon strokeWidth={1.75} aria-hidden="true" focusable="false" />;
};

export const JourneyMountains = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 360 240" fill="none" aria-hidden="true">
    <ellipse cx="180" cy="214" rx="158" ry="12" className="journey-terrain-shadow" />
    <path d="M16 210 85 64l80 146H16Zm121 0L228 36l116 174H137Z" className="journey-mountain-far" />
    <path d="m85 64 27 146h53L85 64Zm143-28 23 174h93L228 36Z" className="journey-mountain-facet" />
    <path d="m68 101 17-37 21 38-12-5-10 8-7-9-9 5Zm137-22 23-43 29 44-15-6-11 12-10-13-16 6Z" className="journey-mountain-snow" />
    <path d="m70 214 91-146 88 146H70Z" className="journey-mountain-near" />
    <path d="m161 68 13 146h75L161 68Z" className="journey-mountain-facet" />
    <path d="m139 104 22-36 22 37-15-6-9 10-8-10-12 5Z" className="journey-mountain-snow" />
    <g className="journey-trees">
      <path d="m38 180 10-23 10 23h-5l9 17H34l9-17h-5Zm254 4 9-22 9 22h-4l9 17h-28l9-17h-4ZM269 200l8-20 8 20h-4l7 14h-23l8-14h-4Z" />
      <path d="M48 197v12m253-8v10m-24 3v8" stroke="currentColor" strokeWidth="2" />
    </g>
  </svg>
);

const JourneyRoad = ({
  className,
  animated = false,
  continuous = false,
}: {
  className: string;
  animated?: boolean;
  continuous?: boolean;
}) => {
  const patternId = `journey-road-${useId().replace(/:/g, '')}`;
  const path = continuous ? CONTINUOUS_ROAD : ROAD;
  const drawProgress = animated && !continuous;
  const artwork = (
    <>
      <path d={path} className="journey-road-verge" />
      <path d={path} className="journey-road-shoulder" />
      <path d={path} className="journey-road-surface" />
      <path d={path} transform="translate(-19 0)" className="journey-road-edge" />
      <path d={path} transform="translate(19 0)" className="journey-road-edge" />
      <path d={path} className="journey-road-center" />
      <motion.path
        d={path}
        transform="translate(-10 0)"
        className="journey-road-progress"
        initial={drawProgress ? { pathLength: 0 } : false}
        animate={!drawProgress ? { pathLength: 1 } : undefined}
        whileInView={drawProgress ? { pathLength: 1 } : undefined}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: animated ? 1.4 : 0 }}
      />
      {!continuous && (
        <g className="journey-road-scenery">
          <path d="m4 112 27-62 34 62H4Zm166 181 30-75 37 75h-67Z" className="journey-mountain-far" />
          <path d="m31 50 8 62h26L31 50Zm169 168 9 75h28l-37-75Z" className="journey-mountain-facet" />
          <path d="m23 69 8-19 11 20-8-3-4 5-3-5-4 2Zm168 172 9-23 13 24-8-3-5 5-5-6-4 3Z" className="journey-mountain-snow" />
          <g className="journey-trees">
            <path d="m42 322 8-22 8 22h-4l8 15H38l8-15h-4Zm142-207 8-20 8 20h-4l8 14h-24l8-14h-4Z" />
            <path d="M50 337v9m142-217v9" stroke="currentColor" strokeWidth="2" />
          </g>
        </g>
      )}
    </>
  );
  return (
    <svg
      className={className}
      viewBox={continuous ? undefined : '0 0 240 400'}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      {continuous ? (
        <>
          <defs>
            <pattern
              id={patternId}
              width="100%"
              height="400"
              patternUnits="userSpaceOnUse"
              viewBox="0 0 240 400"
              preserveAspectRatio="none"
            >
              {artwork}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </>
      ) : artwork}
    </svg>
  );
};

export default JourneyRoad;
