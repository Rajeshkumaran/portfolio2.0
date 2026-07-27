import type { RunRequest, RunResult } from './types';

const TIMEOUT_MS = 10_000;

/**
 * Runs JS in a sandboxed Web Worker (no DOM access), capturing console output.
 * TypeScript is executed as-is (type annotations that aren't valid JS will
 * throw) — a proper TS transpile step can be added later behind this engine.
 */
const WORKER_SRC = `
self.onmessage = async (e) => {
  const logs = [];
  const errs = [];
  const fmt = (args) => args.map((x) => {
    if (typeof x === 'string') return x;
    try { return JSON.stringify(x); } catch { return String(x); }
  }).join(' ');
  self.console.log = self.console.info = self.console.debug = (...a) => logs.push(fmt(a));
  self.console.error = self.console.warn = (...a) => errs.push(fmt(a));
  try {
    const fn = new Function('return (async () => {\\n' + e.data.code + '\\n})();');
    await fn();
    self.postMessage({ stdout: logs.join('\\n'), stderr: errs.join('\\n'), exitCode: 0 });
  } catch (err) {
    const msg = err && err.stack ? String(err.stack) : String(err);
    const stderr = (errs.length ? errs.join('\\n') + '\\n' : '') + msg;
    self.postMessage({ stdout: logs.join('\\n'), stderr: stderr, exitCode: 1 });
  }
};
`;

export async function run(req: RunRequest): Promise<RunResult> {
  const code = req.files.map((f) => f.content).join('\n');

  return new Promise<RunResult>((resolve) => {
    let url = '';
    let worker: Worker;
    try {
      const blob = new Blob([WORKER_SRC], { type: 'application/javascript' });
      url = URL.createObjectURL(blob);
      // Indirect reference so the bundler doesn't try to statically analyse
      // this as a bundled worker module (avoids Turbopack TP1001).
      const WorkerCtor = window.Worker;
      worker = new WorkerCtor(url);
    } catch (err) {
      resolve({
        stdout: '',
        stderr: err instanceof Error ? err.message : 'Failed to start runner',
        exitCode: 1,
        error: 'worker',
      });
      return;
    }

    const cleanup = () => {
      worker.terminate();
      if (url) URL.revokeObjectURL(url);
    };

    const timer = setTimeout(() => {
      cleanup();
      resolve({
        stdout: '',
        stderr: `Execution timed out after ${TIMEOUT_MS / 1000}s.`,
        exitCode: 124,
        error: 'timeout',
      });
    }, TIMEOUT_MS);

    worker.onmessage = (e: MessageEvent<RunResult>) => {
      clearTimeout(timer);
      cleanup();
      resolve(e.data);
    };
    worker.onerror = (e) => {
      clearTimeout(timer);
      cleanup();
      resolve({
        stdout: '',
        stderr: e.message || 'Worker error',
        exitCode: 1,
        error: 'worker',
      });
    };

    worker.postMessage({ code });
  });
}
