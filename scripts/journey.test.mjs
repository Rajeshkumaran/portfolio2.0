import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import postcss from 'postcss';
import ts from 'typescript';

const source = readFileSync(new URL('../src/app/lib/journey.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
});
const { JOURNEY_ICONS, parseJourneyContent, groupJourneyMoments, formatJourneyDate } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);

const moment = (overrides = {}) => ({
  id: 'first-step',
  date: '2024-03',
  category: 'milestone',
  title: 'A beginning',
  story: 'A story to share.',
  published: true,
  ...overrides,
});

const config = (moments = [], overrides = {}) => ({
  title: 'Along the Way',
  subtitle: 'An unfolding story.',
  categories: [
    { id: 'milestone', label: 'Milestones' },
    { id: 'detour', label: 'Detours' },
  ],
  moments,
  ...overrides,
});

test('accepts an empty timeline without inventing personal events', () => {
  assert.deepEqual(parseJourneyContent(config()).moments, []);
});

test('removes unpublished entries and internal publishing fields', () => {
  const content = parseJourneyContent(config([
    { published: false, title: 'PRIVATE DRAFT', image: { src: '/private.jpg' } },
    moment(),
  ]));
  assert.equal(content.moments.length, 1);
  assert.ok(!JSON.stringify(content).includes('PRIVATE DRAFT'));
  assert.ok(!('published' in content.moments[0]));
});

test('requires explicit publication decisions', () => {
  assert.throws(() => parseJourneyContent(config([moment({ published: undefined })])), /published/);
  assert.throws(() => parseJourneyContent(config([moment({ published: 'false' })])), /published/);
});

test('validates category ids, duplicates, and references', () => {
  assert.throws(() => parseJourneyContent(config([], { categories: [] })), /categories/);
  assert.throws(() => parseJourneyContent(config([], { categories: [{ id: 'all', label: 'All' }] })), /category ids/);
  assert.throws(() => parseJourneyContent(config([], { categories: [{ id: 'travel', label: 'Travel' }, { id: 'travel', label: 'Again' }] })), /unique/);
  assert.throws(() => parseJourneyContent(config([moment({ category: 'unknown' })])), /unknown category/);
  assert.throws(() => parseJourneyContent(config([moment(), moment()])), /moment ids must be unique/);
});

test('preserves optional category icons and per-moment overrides', () => {
  for (const icon of JOURNEY_ICONS) {
    const content = parseJourneyContent(config([moment({ icon })], {
      categories: [{ id: 'milestone', label: 'Milestones', icon: 'flag' }],
    }));
    assert.equal(content.categories[0].icon, 'flag');
    assert.equal(content.moments[0].icon, icon);
  }
  const content = parseJourneyContent(config([moment()]));
  assert.ok(!('icon' in content.categories[0]));
  assert.ok(!('icon' in content.moments[0]));
});

test('rejects invalid icons with field-specific errors but excludes draft icons', () => {
  for (const icon of ['', 'rocket', null, 123]) {
    assert.throws(
      () => parseJourneyContent(config([moment({ icon })])),
      /moments\[0\]\.icon/
    );
    assert.throws(
      () => parseJourneyContent(config([], { categories: [{ id: 'milestone', label: 'Milestones', icon }] })),
      /categories\[0\]\.icon/
    );
  }
  assert.deepEqual(parseJourneyContent(config([{ published: false, icon: 'private-draft' }])).moments, []);
});

test('accepts precise and approximate dates and sorts them deterministically', () => {
  const content = parseJourneyContent(config([
    moment({ id: 'later', date: '2025' }),
    moment({ id: 'leap-day', date: '2024-02-29' }),
    moment({ id: 'earlier', date: '2023-09' }),
  ]));
  assert.deepEqual(content.moments.map((entry) => entry.id), ['earlier', 'leap-day', 'later']);
  for (const date of ['2023-02-29', '2024-02-30', '2024-04-31', '2024-13', '2024-00', '24', '2024-3', '2024-01-00']) {
    assert.throws(() => parseJourneyContent(config([moment({ date })])), /date/);
  }
});

test('rejects malformed content rather than rendering silent defaults', () => {
  for (const value of [null, [], 'invalid']) {
    assert.throws(() => parseJourneyContent(value), /expected an object/);
  }
  assert.throws(() => parseJourneyContent(config([], { title: '' })), /title/);
  assert.throws(() => parseJourneyContent(config([moment({ story: ' ' })])), /story/);
  assert.throws(() => parseJourneyContent(config([], { moments: {} })), /moments/);
});

test('validates optional reflections and local images', () => {
  const image = { src: '/journey/a-moment.jpg', alt: 'A photograph from the moment.' };
  const content = parseJourneyContent(config([moment({ reflection: 'A lesson.', image })]));
  assert.deepEqual(content.moments[0].images, [image]);
  assert.ok(!('image' in content.moments[0]));
  assert.equal(content.moments[0].reflection, 'A lesson.');
  for (const src of ['https://example.com/photo.jpg', '/elsewhere/photo.jpg', '/journey/../private.jpg', '/journey/photo.svg']) {
    assert.throws(() => parseJourneyContent(config([moment({ image: { src, alt: 'Photo' } })])), /image.src/);
  }
  assert.throws(() => parseJourneyContent(config([moment({ image: { ...image, alt: '' } })])), /image.alt/);
  assert.throws(() => parseJourneyContent(config([moment({ reflection: '' })])), /reflection/);
});

test('accepts portrait and landscape image orientations while keeping older image configs valid', () => {
  const image = { src: '/journey/a-moment.jpg', alt: 'A photograph from the moment.' };
  for (const orientation of ['portrait', 'landscape']) {
    const content = parseJourneyContent(config([moment({ image: { ...image, orientation } })]));
    assert.deepEqual(content.moments[0].images, [{ ...image, orientation }]);
  }
  assert.deepEqual(parseJourneyContent(config([moment({ image })])).moments[0].images, [image]);
  for (const orientation of ['square', 'auto', '', null, 123, []]) {
    assert.throws(
      () => parseJourneyContent(config([moment({ image: { ...image, orientation } })])),
      /moments\[0\]\.image\.orientation/
    );
  }
});

test('accepts up to three ordered photo frames with independent orientations', () => {
  const images = [
    { src: '/journey/first.jpg', alt: 'First view', orientation: 'portrait' },
    { src: '/journey/second.webp', alt: 'Second view', orientation: 'landscape' },
    { src: '/journey/third.avif', alt: 'Third view' },
  ];
  const before = JSON.stringify(images);
  for (let count = 0; count <= 3; count++) {
    const content = parseJourneyContent(config([moment({ images: images.slice(0, count) })]));
    assert.deepEqual(content.moments[0].images, images.slice(0, count));
  }
  assert.equal(JSON.stringify(images), before);
  assert.ok(!('images' in parseJourneyContent(config([moment()])).moments[0]));
  const content = parseJourneyContent(config([moment({
    images: [{ src: ' /journey/first.jpg ', alt: ' First view ', internalNote: 'PRIVATE' }],
  })]));
  assert.deepEqual(content.moments[0].images, [{ src: '/journey/first.jpg', alt: 'First view' }]);
});

test('rejects too many frames, malformed collections, and conflicting image fields', () => {
  const image = { src: '/journey/a-moment.jpg', alt: 'A photograph.' };
  assert.throws(
    () => parseJourneyContent(config([moment({ images: Array(4).fill(image) })])),
    /moments\[0\]\.images.*at most 3/
  );
  for (const images of [null, {}, 'photo.jpg', 3]) {
    assert.throws(() => parseJourneyContent(config([moment({ images })])), /images.*expected an array/);
  }
  assert.throws(
    () => parseJourneyContent(config([moment({ image, images: [] })])),
    /moments\[0\]\.images.*not both/
  );
  assert.deepEqual(parseJourneyContent(config([{
    published: false, image: null, images: Array(4).fill(null),
  }])).moments, []);
});

test('validates every photo frame with indexed field errors', () => {
  const image = { src: '/journey/a-moment.jpg', alt: 'A photograph.' };
  for (let index = 0; index < 3; index++) {
    const images = [image, image, image];
    for (const [invalid, field] of [
      [null, ''],
      [{ ...image, src: '/journey/../private.jpg' }, '.src'],
      [{ ...image, src: 'https://example.com/photo.jpg' }, '.src'],
      [{ ...image, src: '/journey/photo.svg' }, '.src'],
      [{ ...image, alt: '' }, '.alt'],
      [{ ...image, orientation: 'square' }, '.orientation'],
    ]) {
      assert.throws(
        () => parseJourneyContent(config([moment({ images: images.map((value, position) => position === index ? invalid : value) })])),
        (error) => error.message.startsWith(`Invalid journey content at moments[0].images[${index}]${field}:`)
      );
    }
  }
});

test('preserves labeled HTTPS links without serializing extra fields', () => {
  const links = [
    { label: ' Read the story ', href: ' https://example.com/story ', internalNote: 'PRIVATE' },
    { label: 'View the project', href: 'https://example.com/project' },
  ];
  const content = parseJourneyContent(config([moment({ links })]));
  assert.deepEqual(content.moments[0].links, [
    { label: 'Read the story', href: 'https://example.com/story' },
    { label: 'View the project', href: 'https://example.com/project' },
  ]);
  assert.ok(!JSON.stringify(content).includes('PRIVATE'));
  assert.ok(!('links' in parseJourneyContent(config([moment()])).moments[0]));
  assert.deepEqual(parseJourneyContent(config([moment({ links: [] })])).moments[0].links, []);
  assert.deepEqual(parseJourneyContent(config([{ published: false, links: 'unfinished' }])).moments, []);
});

test('rejects malformed links, unsafe protocols, and embedded credentials', () => {
  for (const href of [
    'javascript:alert(1)', 'data:text/html,unsafe', '//example.com',
    '/relative', 'https:example.com', 'http://example.com',
    'https://user:password@example.com', 'not a URL', '',
  ]) {
    assert.throws(
      () => parseJourneyContent(config([moment({ links: [{ label: 'Read more', href }] })])),
      /moments\[0\]\.links\[0\]\.href/
    );
  }
  assert.throws(() => parseJourneyContent(config([moment({ links: {} })])), /links.*expected an array/);
  assert.throws(() => parseJourneyContent(config([moment({ links: [null] })])), /links\[0\].*expected an object/);
  assert.throws(
    () => parseJourneyContent(config([moment({ links: [{ label: ' ', href: 'https://example.com' }] })])),
    /links\[0\]\.label/
  );
});

test('preserves configured narrative order for equal dates and reverses it for latest-first', () => {
  const { moments } = parseJourneyContent(config([
    moment({ id: 'school-results', date: '2014' }),
    moment({ id: 'joining-college', date: '2014' }),
    moment({ id: 'beginning-to-code', date: '2014' }),
  ]));
  const ids = ['school-results', 'joining-college', 'beginning-to-code'];
  assert.deepEqual(moments.map((entry) => entry.id), ids);
  assert.deepEqual(groupJourneyMoments(moments)[0].moments.map((entry) => entry.id), ids);
  assert.deepEqual(groupJourneyMoments(moments, 'all', 'newest')[0].moments.map((entry) => entry.id), [...ids].reverse());
});

test('groups, filters, and reverses stories without mutating the content', () => {
  const { moments } = parseJourneyContent(config([
    moment({ id: 'early', date: '2023-01' }),
    moment({ id: 'detour', date: '2024-01', category: 'detour' }),
    moment({ id: 'later', date: '2024-08' }),
  ]));
  const before = JSON.stringify(moments);
  assert.deepEqual(groupJourneyMoments(moments).map((group) => group.year), ['2023', '2024']);
  assert.deepEqual(groupJourneyMoments(moments, 'all', 'newest').flatMap((group) => group.moments.map((entry) => entry.id)), ['later', 'detour', 'early']);
  assert.deepEqual(groupJourneyMoments(moments, 'detour').flatMap((group) => group.moments.map((entry) => entry.id)), ['detour']);
  assert.deepEqual(groupJourneyMoments(moments, 'unused'), []);
  assert.equal(JSON.stringify(moments), before);
});

test('formats dates consistently without timezone shifts', () => {
  assert.equal(formatJourneyDate('2024'), '2024');
  assert.equal(formatJourneyDate('2024-03'), 'Mar 2024');
  assert.equal(formatJourneyDate('2024-03-01'), 'Mar 1, 2024');
});

test('the checked-in configuration validates and returns only its published moments', () => {
  const raw = JSON.parse(readFileSync(new URL('../src/app/data/journey.json', import.meta.url), 'utf8'));
  const content = parseJourneyContent(raw);
  assert.ok(content.title.length > 0);
  assert.equal(content.moments.length, raw.moments.filter((entry) => entry.published === true).length);
});

const journeyStyles = postcss.parse(readFileSync(new URL('../src/app/journey/journey.css', import.meta.url), 'utf8'));
const styleValues = (container, selector) => {
  const rule = container.nodes.find((node) => node.type === 'rule' && node.selectors.includes(selector));
  assert.ok(rule, `Missing style rule for ${selector}`);
  return Object.fromEntries(rule.nodes.filter((node) => node.type === 'decl').map((node) => [node.prop, node.value]));
};

test('keeps the alternating journey layout strictly desktop-only', () => {
  let alternatingRules = 0;
  journeyStyles.walkRules((rule) => {
    if (!rule.selector.includes('.journey-stop:nth-child(')) return;
    alternatingRules++;
    assert.equal(rule.parent.type, 'atrule', `${rule.selector} must not override the mobile layout`);
    assert.equal(rule.parent.name, 'media');
    assert.equal(rule.parent.params, '(min-width: 768px)');
  });
  assert.ok(alternatingRules > 0);
});

test('mobile journey dates and stories share the content column without character wrapping', () => {
  const mobile = journeyStyles.nodes.find((node) => node.type === 'atrule'
    && node.name === 'media' && node.params === '(max-width: 767px)');
  assert.ok(mobile);
  const meta = styleValues(mobile, '.journey-stop-meta');
  const story = styleValues(mobile, '.journey-stop .journey-story');
  assert.equal(meta['grid-column'], '2');
  assert.equal(meta['grid-row'], '1');
  assert.equal(meta['flex-direction'], 'row');
  assert.equal(meta['flex-wrap'], 'wrap');
  assert.equal(meta['text-align'], 'left');
  assert.equal(story['grid-column'], '2');
  assert.equal(story['grid-row'], '2');
  assert.equal(story['text-align'], 'left');
  assert.equal(styleValues(journeyStyles, '.journey-stop-meta')['overflow-wrap'], 'normal');
  journeyStyles.walkRules((rule) => {
    if (!rule.selectors.includes('.journey-stop-meta > *')) return;
    const minimum = rule.nodes.find((node) => node.type === 'decl' && node.prop === 'min-width');
    assert.ok(!minimum || minimum.value === '0', 'Date labels must not force a fixed minimum width');
  });
});
