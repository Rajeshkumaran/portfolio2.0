#!/usr/bin/env node
/**
 * Prints each learning category's roadmap in order (step → id → title).
 *
 * The order of a roadmap (and the prev/next chain + "Step N of M") is simply the
 * order of ids in each category's `videos` array in learning.json. Video titles
 * live in videos.json, keyed by YouTube id. Because those ids are opaque, this
 * script pairs them with titles so you can reorder confidently.
 *
 * Usage:
 *   npm run learning:list            # all topics/categories
 *   npm run learning:list -- dsa     # only categories whose id/slug/name matches
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(join(root, 'src/app/data', p), 'utf-8'));

const learning = read('learning.json');
const catalog = read('videos.json');

const filter = (process.argv[2] || '').toLowerCase();
const matches = (cat) =>
  !filter ||
  [cat.id, cat.slug, cat.name].some((v) => v.toLowerCase().includes(filter));

let shown = 0;
for (const [topicKey, topic] of Object.entries(learning)) {
  const cats = topic.categories.filter(matches);
  if (cats.length === 0) continue;
  console.log(`\n=== ${topic.title} (${topicKey}) ===`);
  for (const cat of cats) {
    shown++;
    console.log(`\n  ${cat.name}  [/learning/${topicKey}/${cat.slug}]`);
    cat.videos.forEach((id, i) => {
      const entry = catalog[id];
      const title = entry ? entry.title : '⚠️  MISSING FROM videos.json';
      console.log(`   ${String(i + 1).padStart(2)}. ${id.padEnd(13)}  ${title}`);
    });
  }
}

if (shown === 0) {
  console.log(`No categories matched "${filter}".`);
}
console.log('');
