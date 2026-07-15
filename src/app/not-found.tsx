import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center font-[family-name:var(--font-poppins)] text-zinc-900 px-6 py-20">
      <div className="glass-card max-w-lg w-full p-10 sm:p-14 text-center">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-pink-100 ring-1 ring-rose-200/70">
          <svg
            className="h-8 w-8 text-rose-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M15 10l-4 4m0-4l4 4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
        <p className="text-rose-700 text-sm font-medium mb-2 font-[family-name:var(--font-inter)]">
          404
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold gradient-text font-[family-name:var(--font-inter)] mb-3">
          Page not found
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-8">
          Indha page kaanom — it may have moved or is no longer available. Namma
          learning hub-ku thirumbi poalaam.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/learning-hub"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(190,24,60,0.3)] hover:from-rose-600 hover:to-pink-600 transition-colors font-[family-name:var(--font-inter)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Return to learning hub
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-rose-200/70 bg-white/60 px-6 py-2.5 text-sm font-medium text-rose-700 hover:bg-rose-50 hover:border-rose-300 transition-colors font-[family-name:var(--font-inter)]"
          >
            Back to portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
