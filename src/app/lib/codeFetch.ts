import { CODE_REPO_LINK } from './constants';
import type { CodeSnippet } from './learning';

export type FetchedCode = {
  /** The (possibly sliced) source to display/run. */
  content: string;
  /** raw.githubusercontent.com URL the content came from. */
  rawUrl: string;
  /** Human-facing GitHub blob URL for "Open in GitHub". */
  sourceUrl: string;
};

const cache = new Map<string, string>();

function parseRepo(repoUrl: string): { owner: string; repo: string } {
  const m = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!m) throw new Error('Invalid GitHub repository URL.');
  return { owner: m[1], repo: m[2].replace(/\.git$/, '') };
}

const stripSlash = (p: string) => p.replace(/^\//, '');

export function rawUrl(snippet: CodeSnippet): string {
  const { owner, repo } = parseRepo(snippet.repoUrl ?? CODE_REPO_LINK);
  const branch = snippet.branch ?? 'main';
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${stripSlash(
    snippet.repoPath
  )}`;
}

export function sourceUrl(snippet: CodeSnippet): string {
  const base = (snippet.repoUrl ?? CODE_REPO_LINK).replace(/\.git$/, '');
  const branch = snippet.branch ?? 'main';
  return `${base}/blob/${branch}/${stripSlash(snippet.repoPath)}`;
}

function slice(content: string, startLine?: number, endLine?: number): string {
  if (!startLine && !endLine) return content;
  const lines = content.split('\n');
  return lines.slice((startLine ?? 1) - 1, endLine ?? lines.length).join('\n');
}

/** Fetch a snippet's raw source (cached), applying any line range. */
export async function fetchCode(snippet: CodeSnippet): Promise<FetchedCode> {
  const url = rawUrl(snippet);
  let full = cache.get(url);
  if (full == null) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Couldn't load code from GitHub (${res.status}).`);
    }
    full = await res.text();
    cache.set(url, full);
  }
  return {
    content: slice(full, snippet.startLine, snippet.endLine),
    rawUrl: url,
    sourceUrl: sourceUrl(snippet),
  };
}
