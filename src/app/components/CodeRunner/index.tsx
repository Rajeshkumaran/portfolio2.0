'use client';
import { useCallback, useEffect, useState } from 'react';
import { fetchCode, sourceUrl } from '@/app/lib/codeFetch';
import { runCode, LANGUAGE_ENGINE } from '@/app/lib/runner';
import type { CodeSnippet } from '@/app/lib/learning';
import { trackSectionClick } from '@/app/lib/analytics';
import { ANALYTICS_SECTIONS } from '@/app/lib/constants';

const LANG_LABEL: Record<CodeSnippet['language'], string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
};

type OutputState =
  | { status: 'idle' }
  | { status: 'running' }
  | { status: 'done'; stdout: string; stderr: string; exitCode: number | null };

const EDITOR_THEMES = {
  midnight: {
    label: 'Midnight',
    className: 'bg-zinc-950 text-zinc-100 caret-rose-400',
  },
  dracula: {
    label: 'Dracula',
    className: 'bg-[#282a36] text-[#f8f8f2] caret-[#ff79c6]',
  },
  solarized: {
    label: 'Solarized',
    className: 'bg-[#002b36] text-[#eee8d5] caret-[#b58900]',
  },
  light: {
    label: 'Light',
    className: 'bg-slate-50 text-slate-900 caret-rose-600',
  },
} as const;

type EditorTheme = keyof typeof EDITOR_THEMES;

const PlayIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M8 5v14l11-7z" />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.42.36.79 1.09.79 2.2v3.26c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
  </svg>
);

const SnippetPanel = ({
  snippet,
  videoId,
  fillHeight,
  theme,
  onThemeChange,
}: {
  snippet: CodeSnippet;
  videoId: string;
  fillHeight: boolean;
  theme: EditorTheme;
  onThemeChange: (theme: EditorTheme) => void;
}) => {
  const [code, setCode] = useState<string>('');
  const [original, setOriginal] = useState<string>('');
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadError, setLoadError] = useState<string>('');
  const [output, setOutput] = useState<OutputState>({ status: 'idle' });

  const runnable = snippet.runnable !== false;
  const isRemote = LANGUAGE_ENGINE[snippet.language] === 'remote';
  const gitUrl = sourceUrl(snippet);

  const outputContent =
    output.status === 'done' ? (
      <>
        {output.stdout}
        {output.stderr && (
          <span className="text-rose-400">
            {output.stdout ? '\n' : ''}
            {output.stderr}
          </span>
        )}
        {!output.stdout && !output.stderr && (
          <span className="text-zinc-500">(no output)</span>
        )}
      </>
    ) : output.status === 'running' ? (
      <span className="text-zinc-500">Running code…</span>
    ) : (
      <span className="text-zinc-500">Run the code to see its output.</span>
    );

  const outputStatus =
    output.status === 'done'
      ? output.exitCode === 0
        ? 'Success'
        : output.exitCode == null
        ? 'Not run'
        : `Exit ${output.exitCode}`
      : output.status === 'running'
      ? 'Running'
      : 'Ready';

  useEffect(() => {
    let cancelled = false;
    setLoadState('loading');
    fetchCode(snippet)
      .then((res) => {
        if (cancelled) return;
        setCode(res.content);
        setOriginal(res.content);
        setLoadState('ready');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : 'Failed to load code.');
        setLoadState('error');
      });
    return () => {
      cancelled = true;
    };
    // Re-fetch when the target file changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippet.repoPath, snippet.repoUrl, snippet.branch]);

  const handleRun = useCallback(async () => {
    setOutput({ status: 'running' });
    trackSectionClick(ANALYTICS_SECTIONS.CODE_RUN, `${snippet.language}_${videoId}`);
    const startedAt = Date.now();
    const result = await runCode({
      language: snippet.language,
      files: [{ name: snippet.repoPath.split('/').pop(), content: code }],
      stdin: snippet.stdin,
    });
    // Keep the running state visible for a minimum duration so fast client-side
    // runs don't flicker the spinner.
    const elapsed = Date.now() - startedAt;
    const MIN_RUNNING_MS = 400;
    if (elapsed < MIN_RUNNING_MS) {
      await new Promise((r) => setTimeout(r, MIN_RUNNING_MS - elapsed));
    }
    setOutput({
      status: 'done',
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
    });
  }, [code, snippet.language, snippet.repoPath, snippet.stdin, videoId]);

  return (
    <div
      className={
        fillHeight
          ? 'flex min-h-0 flex-1 flex-col overflow-hidden border-l border-white/60 bg-white/70'
          : 'glass-card overflow-hidden'
      }
    >
      {/* Toolbar */}
      <div className="flex shrink-0 items-center justify-between gap-2 px-4 py-2.5 border-b border-white/50 bg-white/40">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-rose-100/70 px-2.5 py-1 text-[11px] font-semibold text-rose-700 font-[family-name:var(--font-inter)]">
            {LANG_LABEL[snippet.language]}
          </span>
          <select
            value={theme}
            onChange={(event) => onThemeChange(event.target.value as EditorTheme)}
            aria-label="Code editor theme"
            className="rounded-full border border-zinc-200/80 bg-white/70 px-2.5 py-1 text-[11px] font-medium text-zinc-600 outline-none hover:text-rose-700 font-[family-name:var(--font-inter)]"
          >
            {Object.entries(EDITOR_THEMES).map(([value, editorTheme]) => (
              <option key={value} value={value}>
                {editorTheme.label}
              </option>
            ))}
          </select>
          {code !== original && loadState === 'ready' && (
            <button
              onClick={() => setCode(original)}
              className="text-[11px] text-zinc-500 hover:text-rose-700 transition-colors font-[family-name:var(--font-inter)]"
            >
              Reset
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={gitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-600 hover:text-rose-700 transition-colors font-[family-name:var(--font-inter)]"
          >
            <GithubIcon />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          {runnable && (
            <button
              onClick={handleRun}
              disabled={loadState !== 'ready' || output.status === 'running'}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-rose-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_2px_12px_rgba(190,24,60,0.25)] hover:from-rose-400 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-[family-name:var(--font-inter)]"
            >
              {output.status === 'running' ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Running…
                </>
              ) : (
                <>
                  <PlayIcon />
                  Run
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div
        className={
          fillHeight
            ? 'grid min-h-0 flex-1 grid-rows-[minmax(0,65fr)_minmax(0,35fr)]'
            : ''
        }
      >
        {/* Code */}
        <div className={fillHeight ? 'flex min-h-0 flex-col' : ''}>
          {loadState === 'loading' ? (
            <div className={`px-4 py-10 text-center text-sm text-zinc-500 font-[family-name:var(--font-inter)] ${fillHeight ? 'flex flex-1 items-center justify-center' : ''}`}>
              Loading code…
            </div>
          ) : loadState === 'error' ? (
            <div className={`px-4 py-8 text-center text-sm text-zinc-600 font-[family-name:var(--font-inter)] ${fillHeight ? 'flex flex-1 items-center justify-center' : ''}`}>
              <span>
                {loadError}{' '}
                <a href={gitUrl} target="_blank" rel="noopener noreferrer" className="text-rose-700 underline">
                  View on GitHub
                </a>
              </span>
            </div>
          ) : (
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              rows={fillHeight ? undefined : Math.min(Math.max(code.split('\n').length, 6), 24)}
              className={`w-full font-mono text-[13px] leading-relaxed p-4 outline-none focus:ring-1 focus:ring-rose-400/40 ${EDITOR_THEMES[theme].className} ${
                fillHeight ? 'min-h-0 flex-1 resize-none overflow-auto' : 'resize-y'
              }`}
              aria-label={`${LANG_LABEL[snippet.language]} source code`}
            />
          )}

          {/* Runnability note for remote-only langs */}
          {runnable && isRemote && (
            <p className="shrink-0 px-4 py-2 text-[11px] text-amber-700 bg-amber-50/60 border-t border-amber-200/50 font-[family-name:var(--font-inter)]">
              {LANG_LABEL[snippet.language]} runs on a remote runner — output may take a moment.
            </p>
          )}
        </div>

        {/* Output */}
        <div className={`flex min-h-0 flex-col border-t border-white/50 ${fillHeight || output.status === 'done' ? '' : 'hidden'}`}>
          <div className="flex shrink-0 items-center justify-between px-4 py-2 bg-white/40">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 font-[family-name:var(--font-inter)]">
              Output
            </span>
            <span
              className={`text-[11px] font-medium font-[family-name:var(--font-inter)] ${
                output.status === 'done' && output.exitCode === 0
                  ? 'text-emerald-600'
                  : output.status === 'done' && output.exitCode !== null
                  ? 'text-rose-600'
                  : 'text-zinc-500'
              }`}
            >
              {outputStatus}
            </span>
          </div>
          <pre className={`${fillHeight ? 'min-h-0 flex-1' : 'max-h-64'} overflow-auto bg-zinc-950/95 text-zinc-100 font-mono text-[12.5px] leading-relaxed p-4 whitespace-pre-wrap`}>
            {outputContent}
          </pre>
        </div>
      </div>
    </div>
  );
};

const CodeRunner = ({
  snippets,
  videoId,
  showHeading = true,
  fillHeight = false,
}: {
  snippets: CodeSnippet[];
  videoId: string;
  showHeading?: boolean;
  fillHeight?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const [theme, setTheme] = useState<EditorTheme>('midnight');
  if (snippets.length === 0) return null;
  const current = snippets[Math.min(active, snippets.length - 1)];

  return (
    <div className={`${showHeading ? 'mb-10' : ''} ${fillHeight ? 'flex h-full min-h-0 flex-col' : ''}`}>
      {showHeading && (
        <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-3 font-[family-name:var(--font-inter)]">
          Try the code
        </h2>
      )}
      {snippets.length > 1 && (
        <div className="flex shrink-0 flex-wrap gap-2 mb-3">
          {snippets.map((s, i) => (
            <button
              key={`${s.repoPath}-${i}`}
              onClick={() => setActive(i)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors font-[family-name:var(--font-inter)] ${
                i === active
                  ? 'bg-rose-600 text-white'
                  : 'glass-chip text-zinc-600 hover:text-rose-700'
              }`}
            >
              {s.title ?? LANG_LABEL[s.language]}
            </button>
          ))}
        </div>
      )}

      <SnippetPanel
        key={`${current.repoPath}-${active}`}
        snippet={current}
        videoId={videoId}
        fillHeight={fillHeight}
        theme={theme}
        onThemeChange={setTheme}
      />
    </div>
  );
};

export default CodeRunner;
