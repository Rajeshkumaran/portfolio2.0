import { CODE_RUNNER_REMOTE_URL } from '../constants';
import type { RunRequest, RunResult } from './types';

/**
 * Remote execution for languages that can't run client-side (Java, and future
 * compiled languages). Targets a Piston-compatible endpoint configured via
 * CODE_RUNNER_REMOTE_URL (e.g. a self-hosted Piston). Disabled by default.
 *
 * Note: the public emkc.org Piston API is intentionally NOT the default — as of
 * 2026-02-15 it requires an authorization token not granted to portfolio
 * projects. Self-host Piston (or swap this file for Wandbox/Judge0) to enable.
 */
const DEFAULT_VERSIONS: Partial<Record<string, string>> = {
  java: '15.0.2',
};

export async function run(req: RunRequest): Promise<RunResult> {
  if (!CODE_RUNNER_REMOTE_URL) {
    return {
      stdout: '',
      stderr:
        `Running ${req.language} in the browser isn't enabled yet — it needs a ` +
        `remote runner. You can still view the source on GitHub.`,
      exitCode: null,
      error: 'not-configured',
    };
  }

  const base = CODE_RUNNER_REMOTE_URL.replace(/\/$/, '');
  try {
    const res = await fetch(`${base}/api/v2/piston/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: req.language,
        version: DEFAULT_VERSIONS[req.language] ?? '*',
        files: req.files.map((f) => ({ name: f.name, content: f.content })),
        stdin: req.stdin ?? '',
      }),
    });

    if (!res.ok) {
      return {
        stdout: '',
        stderr: `Runner error: ${res.status} ${res.statusText}`,
        exitCode: 1,
        error: 'http',
      };
    }

    const data = (await res.json()) as {
      run?: { stdout?: string; stderr?: string; code?: number };
      compile?: { stderr?: string };
      message?: string;
    };

    if (data.message && !data.run) {
      return { stdout: '', stderr: data.message, exitCode: 1, error: 'runner' };
    }

    const compileErr = data.compile?.stderr ? `${data.compile.stderr}\n` : '';
    return {
      stdout: data.run?.stdout ?? '',
      stderr: compileErr + (data.run?.stderr ?? ''),
      exitCode: data.run?.code ?? 0,
    };
  } catch (err) {
    return {
      stdout: '',
      stderr: err instanceof Error ? err.message : String(err),
      exitCode: 1,
      error: 'network',
    };
  }
}
