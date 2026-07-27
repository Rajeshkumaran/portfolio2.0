import type { RunRequest, RunResult } from './types';

const PYODIDE_VERSION = 'v0.26.2';
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

type PyodideInterface = {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
  setStdin: (opts: { stdin: () => string }) => void;
};

declare global {
  interface Window {
    loadPyodide?: (opts?: { indexURL?: string }) => Promise<PyodideInterface>;
  }
}

let pyodidePromise: Promise<PyodideInterface> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-pyodide="1"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.dataset.pyodide = '1';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Pyodide.'));
    document.head.appendChild(s);
  });
}

/** Lazily load Pyodide once and cache the instance across runs. */
async function getPyodide(): Promise<PyodideInterface> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      await loadScript(`${PYODIDE_BASE}pyodide.js`);
      if (!window.loadPyodide) throw new Error('Pyodide is unavailable.');
      return window.loadPyodide({ indexURL: PYODIDE_BASE });
    })();
  }
  return pyodidePromise;
}

export async function run(req: RunRequest): Promise<RunResult> {
  const code = req.files.map((f) => f.content).join('\n');
  try {
    const pyodide = await getPyodide();
    let stdout = '';
    let stderr = '';
    pyodide.setStdout({ batched: (s) => { stdout += s; } });
    pyodide.setStderr({ batched: (s) => { stderr += s; } });
    if (req.stdin != null) {
      const value = req.stdin;
      pyodide.setStdin({ stdin: () => value });
    }
    await pyodide.runPythonAsync(code);
    return { stdout, stderr, exitCode: 0 };
  } catch (err) {
    return {
      stdout: '',
      stderr: err instanceof Error ? err.message : String(err),
      exitCode: 1,
      error: 'python',
    };
  }
}
