import { LANGUAGE_ENGINE, type RunRequest, type RunResult } from './types';

export type { RunRequest, RunResult, RunFile } from './types';
export { LANGUAGE_ENGINE } from './types';

/**
 * Single entry point the UI calls. Resolves the language to its engine and
 * lazily imports it, so heavy client engines (Pyodide) and the remote client
 * are never part of the initial bundle.
 */
export async function runCode(req: RunRequest): Promise<RunResult> {
  const kind = LANGUAGE_ENGINE[req.language];
  switch (kind) {
    case 'client-js':
      return (await import('./clientJs')).run(req);
    case 'client-python':
      return (await import('./clientPython')).run(req);
    case 'remote':
      return (await import('./remote')).run(req);
    default:
      return {
        stdout: '',
        stderr: `No runner configured for "${req.language}".`,
        exitCode: null,
        error: 'unsupported',
      };
  }
}
