'use client';
import { SOCIAL_LINKS, LEARNING_REPO_URL } from '@/app/lib/constants';
import { trackSocialClick } from '@/app/lib/analytics';

const socials = [
  {
    platform: 'youtube',
    link: SOCIAL_LINKS.YOUTUBE,
    icon: (
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    ),
  },
  {
    platform: 'instagram',
    link: SOCIAL_LINKS.INSTAGRAM,
    icon: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    ),
  },
  {
    platform: 'github',
    link: LEARNING_REPO_URL,
    icon: (
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.12-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.18.77.84 1.24 1.91 1.24 3.23 0 4.63-2.8 5.65-5.48 5.95.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.21.7.82.58A12.01 12.01 0 0024 12.5C24 5.87 18.63.5 12 .5z" />
    ),
  },
];

const LearningFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl bg-white/55 backdrop-saturate-150 border-t border-white/50 shadow-[0_-4px_30px_rgba(31,38,80,0.06)]">
      <div className="px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-xs sm:text-sm text-zinc-500 truncate font-[family-name:var(--font-inter)]">
            &copy; {year} Aazh Aayvu
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {socials.map(({ platform, link, icon }) => (
            <button
              key={platform}
              className="text-zinc-900 hover:text-rose-600 transition-colors cursor-pointer"
              onClick={() => {
                trackSocialClick(platform);
                window.open(link, '_blank', 'noopener,noreferrer');
              }}
              aria-label={platform}
            >
              <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                {icon}
              </svg>
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default LearningFooter;
