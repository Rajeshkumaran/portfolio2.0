#!/usr/bin/env node
/**
 * Adds a newly published video to the learning hub in one step.
 *
 * A video only surfaces on the site (page, sitemap, SEO metadata, JSON-LD) when
 * it lives in BOTH data files:
 *   1. videos.json     — the flat catalog, keyed by the 11-char YouTube id.
 *   2. learning.json   — the id referenced in a category's `videos` array,
 *                        which is what actually renders it (see lib/learning.ts).
 *
 * This script writes both, validating the topic/category and guarding against
 * duplicates. It preserves learning.json's existing formatting (inline vs
 * multiline arrays) so diffs stay minimal.
 *
 * Usage:
 *   npm run video:add -- \
 *     --id VIDEO_ID \
 *     --title "Video title" \
 *     --format short|long \
 *     --topic tech|finance \
 *     --category <category id or slug> \
 *     --description "One or two sentences summarising the video." \
 *     [--published 2026-07-15]        # defaults to today
 *     [--position N]                  # 1-based slot in the roadmap; default: append
 *     [--instagram <url>]             # for an Instagram-only (non-YouTube) video
 *     [--github <url>] [--youtube <url>]
 *
 * After running, rebuild to regenerate pages + sitemap:
 *   npm run build
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = (p) => join(root, 'src/app/data', p);

const YT_ID_RE = /^[\w-]{11}$/;

/** Parse `--key value` / `--key=value` / boolean `--key` flags. */
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const tok = argv[i];
    if (!tok.startsWith('--')) continue;
    const eq = tok.indexOf('=');
    if (eq !== -1) {
      args[tok.slice(2, eq)] = tok.slice(eq + 1);
    } else {
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        args[tok.slice(2)] = true;
      } else {
        args[tok.slice(2)] = next;
        i++;
      }
    }
  }
  return args;
}

function fail(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

const args = parseArgs(process.argv.slice(2));

const id = args.id;
const title = args.title;
const format = args.format;
const topicKey = args.topic;
const catRef = args.category;
const description = args.description ?? '';
const publishedAt = args.published ?? new Date().toISOString().slice(0, 10);

if (!id) fail('Missing --id (the 11-char YouTube id, used as the catalog key).');
if (!title) fail('Missing --title.');
if (!topicKey) fail('Missing --topic (tech | finance).');
if (!catRef) fail('Missing --category (a category id or slug).');
if (format && format !== 'short' && format !== 'long') {
  fail(`Invalid --format "${format}". Use "short" or "long".`);
}
if (!YT_ID_RE.test(id) && !args.instagram) {
  fail(
    `--id "${id}" is not a valid 11-char YouTube id. For an Instagram-only video, ` +
      'pass a non-YouTube id and supply --instagram <url>.'
  );
}

const learningRaw = readFileSync(dataPath('learning.json'), 'utf-8');
const learning = JSON.parse(learningRaw);
const catalog = JSON.parse(readFileSync(dataPath('videos.json'), 'utf-8'));

const topic = learning[topicKey];
if (!topic) {
  fail(`Unknown topic "${topicKey}". Available: ${Object.keys(learning).join(', ')}.`);
}

const category = topic.categories.find(
  (c) => c.id === catRef || c.slug === catRef
);
if (!category) {
  const avail = topic.categories.map((c) => `${c.id} (${c.slug})`).join(', ');
  fail(`No category "${catRef}" in topic "${topicKey}". Available: ${avail}.`);
}

if (category.videos.includes(id)) {
  fail(`"${id}" is already in ${topicKey}/${category.id}. Nothing to do.`);
}

// --- 1. Update the flat catalog (videos.json) ---
if (catalog[id]) {
  console.log(`ℹ videos.json already has "${id}" — keeping its entry, only adding the roadmap reference.`);
} else {
  const entry = { title, format: format ?? 'short', description };
  if (args.youtube) entry.youtubeUrl = args.youtube;
  if (args.instagram) entry.instagramUrl = args.instagram;
  if (args.github) entry.githubUrl = args.github;
  entry.links = [];
  entry.publishedAt = publishedAt;
  catalog[id] = entry;
  writeFileSync(dataPath('videos.json'), JSON.stringify(catalog, null, 2) + '\n');
  console.log(`✓ videos.json — added "${id}".`);
}

// --- 2. Reference the id in the category (learning.json), format-preserving ---
const nextIds = [...category.videos];
let insertAt = nextIds.length;
if (args.position !== undefined) {
  const pos = Number(args.position);
  if (!Number.isInteger(pos) || pos < 1 || pos > nextIds.length + 1) {
    fail(`--position must be an integer between 1 and ${nextIds.length + 1}.`);
  }
  insertAt = pos - 1;
}
nextIds.splice(insertAt, 0, id);

/** Re-render a category's `videos` array in-place, preserving inline/multiline style. */
function replaceVideosArray(raw, categoryId, ids) {
  const catMarker = `"id": "${categoryId}"`;
  const catIdx = raw.indexOf(catMarker);
  if (catIdx === -1) fail(`Could not locate category "${categoryId}" in learning.json.`);
  const vKey = raw.indexOf('"videos"', catIdx);
  const open = raw.indexOf('[', vKey);
  const close = raw.indexOf(']', open);
  if (vKey === -1 || open === -1 || close === -1) {
    fail(`Malformed "videos" array for category "${categoryId}".`);
  }
  const body = raw.slice(open, close + 1);
  const q = (s) => JSON.stringify(s);
  let rendered;
  if (!body.includes('\n')) {
    rendered = `[${ids.map(q).join(', ')}]`;
  } else {
    const elemIndent = (body.match(/\n(\s+)"/) || [, '          '])[1];
    const closeIndent = (body.match(/\n(\s*)\]$/) || [, '        '])[1];
    rendered = `[\n${ids.map((v) => elemIndent + q(v)).join(',\n')}\n${closeIndent}]`;
  }
  return raw.slice(0, open) + rendered + raw.slice(close + 1);
}

const updatedLearning = replaceVideosArray(learningRaw, category.id, nextIds);
writeFileSync(dataPath('learning.json'), updatedLearning);
console.log(
  `✓ learning.json — referenced "${id}" in ${topicKey}/${category.id} at step ${insertAt + 1}/${nextIds.length}.`
);

console.log(`\n✔ Done. Next: run "npm run build" to regenerate pages, sitemap and SEO metadata.`);
console.log(`  Preview the roadmap order with: npm run learning:list -- ${category.id}\n`);
