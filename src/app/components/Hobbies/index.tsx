'use client';
import AnimatedSection from '../AnimatedSection';

const hobbies = [
  { emoji: '🏏', label: 'Cricket' },
  { emoji: '🎮', label: 'PS5 Gaming' },
  { emoji: '🎵', label: 'Music' },
  { emoji: '🛠️', label: 'Hobby Projects' },
  { emoji: '🌱', label: 'Gardening' },
];

const Hobbies = () => {
  return (
    <AnimatedSection>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 mb-6 sm:mb-8 font-[family-name:var(--font-inter)]">
        Beyond Code
      </h2>
      <div className="flex flex-wrap gap-3">
        {hobbies.map((hobby) => (
          <span
            key={hobby.label}
            className="glass-card !transform-none px-4 py-2.5 flex items-center gap-2.5 text-sm text-zinc-700 font-[family-name:var(--font-inter)]"
          >
            <span className="text-lg">{hobby.emoji}</span>
            {hobby.label}
          </span>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default Hobbies;
