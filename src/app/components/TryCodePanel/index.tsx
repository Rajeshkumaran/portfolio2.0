'use client';
import { useState } from 'react';
import { trackSectionClick } from '@/app/lib/analytics';
import { ANALYTICS_SECTIONS } from '@/app/lib/constants';

const CodeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const DesktopIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const TryCodeButton = ({
  open,
  onToggle,
  videoId,
}: {
  open: boolean;
  onToggle: () => void;
  videoId: string;
}) => {
  const [hint, setHint] = useState(false);

  const handleDesktop = () => {
    if (!open) {
      trackSectionClick(ANALYTICS_SECTIONS.CODE_RUN, `open_panel_${videoId}`);
    }
    onToggle();
  };

  return (
    <>
      {/* Desktop: toggles the in-page code panel */}
      <button
        onClick={handleDesktop}
        aria-expanded={open}
        className="hidden md:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-rose-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_2px_12px_rgba(190,24,60,0.25)] hover:from-rose-400 hover:to-rose-600 transition-all font-[family-name:var(--font-inter)]"
      >
        <CodeIcon />
        {open ? 'Hide code' : 'Try code'}
      </button>

      {/* Mobile: informational only */}
      <button
        onClick={() => setHint((v) => !v)}
        aria-expanded={hint}
        className="inline-flex md:hidden items-center gap-2 rounded-full border border-rose-200/70 bg-white/60 px-3.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors font-[family-name:var(--font-inter)]"
      >
        <CodeIcon />
        Try code
      </button>
      {hint && (
        <span className="inline-flex md:hidden items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/60 px-3 py-1.5 text-[11px] font-medium text-amber-700 font-[family-name:var(--font-inter)]">
          <DesktopIcon />
          Best on desktop — open on a larger screen to run the code.
        </span>
      )}
    </>
  );
};

export default TryCodeButton;
