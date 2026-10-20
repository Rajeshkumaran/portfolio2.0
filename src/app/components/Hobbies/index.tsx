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
      <h2>Beyond Code</h2>
      <div className="flex flex-wrap gap-3">
        {hobbies.map((hobby) => (
          <span
            key={hobby.label}
            className="portfolio-hobby"
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
