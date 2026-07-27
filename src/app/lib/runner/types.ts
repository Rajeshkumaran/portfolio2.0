import type { CodeLanguage } from '../learning';

export type RunFile = { name?: string; content: string };

export type RunRequest = {
  language: CodeLanguage;
  files: RunFile[];
  stdin?: string;
};

export type RunResult = {
  stdout: string;
  stderr: string;
  /** Process exit code (0 = success). null when execution never ran. */
  exitCode: number | null;
  /** Machine-readable error kind for non-program failures (network, timeout…). */
  error?: string;
};

export interface Runner {
  run(req: RunRequest): Promise<RunResult>;
}

/** Which engine handles each language. */
export type EngineKind = 'client-js' | 'client-python' | 'remote';

/**
 * Language → engine map. Adding a language is a one-line change here (plus an
 * engine implementation if a new kind is needed) — the UI never changes.
 */
export const LANGUAGE_ENGINE: Record<CodeLanguage, EngineKind> = {
  javascript: 'client-js',
  typescript: 'client-js',
  python: 'client-python',
  java: 'remote',
};
