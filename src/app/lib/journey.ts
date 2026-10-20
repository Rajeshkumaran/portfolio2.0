export const JOURNEY_ICONS = [
  'pin', 'flag', 'turn', 'compass', 'heart', 'mountain', 'briefcase', 'book',
  'star', 'plane', 'dumbbell', 'trophy', 'bike', 'motorbike', 'car', 'code',
] as const;
export type JourneyIcon = (typeof JOURNEY_ICONS)[number];

export type JourneyCategory = {
  id: string;
  label: string;
  icon?: JourneyIcon;
};

export type JourneyImage = {
  src: string;
  alt: string;
  orientation?: 'portrait' | 'landscape';
};

export type JourneyMoment = {
  id: string;
  date: string;
  category: string;
  title: string;
  story: string;
  reflection?: string;
  icon?: JourneyIcon;
  images?: JourneyImage[];
  links?: { label: string; href: string }[];
};

export type JourneyContent = {
  title: string;
  subtitle: string;
  categories: JourneyCategory[];
  moments: JourneyMoment[];
};

export type JourneyOrder = 'oldest' | 'newest';

const fail = (field: string, reason: string): never => {
  throw new Error(`Invalid journey content at ${field}: ${reason}`);
};

const record = (value: unknown, field: string): Record<string, unknown> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return fail(field, 'expected an object');
  }
  return value as Record<string, unknown>;
};

const text = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || !value.trim()) {
    return fail(field, 'expected non-empty text');
  }
  return value.trim();
};

const identifier = (value: unknown, field: string): string => {
  const result = text(value, field);
  if (!/^[a-z][a-z0-9-]*$/.test(result)) {
    return fail(field, 'use a lowercase id with letters, numbers, and hyphens');
  }
  return result;
};

const isJourneyIcon = (value: string): value is JourneyIcon =>
  JOURNEY_ICONS.some((icon) => icon === value);

const iconValue = (value: unknown, field: string): JourneyIcon => {
  const icon = text(value, field);
  if (!isJourneyIcon(icon)) return fail(field, `choose one of: ${JOURNEY_ICONS.join(', ')}`);
  return icon;
};

const dateValue = (value: unknown, field: string): string => {
  const date = text(value, field);
  if (!/^[1-9]\d{3}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?)?$/.test(date)) {
    return fail(field, 'expected YYYY, YYYY-MM, or YYYY-MM-DD');
  }
  if (date.length === 10) {
    const parsed = new Date(`${date}T00:00:00Z`);
    if (parsed.toISOString().slice(0, 10) !== date) {
      return fail(field, 'the calendar date does not exist');
    }
  }
  return date;
};

const linkValue = (value: unknown, field: string): string => {
  const href = text(value, field);
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return fail(field, 'use an absolute HTTPS URL');
  }
  if (!href.startsWith('https://') || url.protocol !== 'https:' || url.username || url.password) {
    return fail(field, 'use an absolute HTTPS URL without embedded credentials');
  }
  return href;
};

const imageValue = (value: unknown, field: string): JourneyImage => {
  const image = record(value, field);
  const src = text(image.src, `${field}.src`);
  if (!/^\/journey\/[a-zA-Z0-9/_.-]+\.(?:jpe?g|png|webp|avif)$/.test(src) || src.split('/').includes('..')) {
    return fail(`${field}.src`, 'use a local image under /journey/, such as /journey/a-moment.jpg');
  }
  const result: JourneyImage = { src, alt: text(image.alt, `${field}.alt`) };
  if (image.orientation !== undefined) {
    const orientation = text(image.orientation, `${field}.orientation`);
    if (orientation !== 'portrait' && orientation !== 'landscape') {
      return fail(`${field}.orientation`, 'choose portrait or landscape');
    }
    result.orientation = orientation;
  }
  return result;
};

export function parseJourneyContent(value: unknown): JourneyContent {
  const config = record(value, 'journey');
  const title = text(config.title, 'title');
  const subtitle = text(config.subtitle, 'subtitle');
  if (!Array.isArray(config.categories) || !config.categories.length) {
    return fail('categories', 'provide at least one category');
  }
  const categoryIds = new Set<string>();
  const categories = config.categories.map((value, index) => {
    const field = `categories[${index}]`;
    const category = record(value, field);
    const id = identifier(category.id, `${field}.id`);
    if (id === 'all' || categoryIds.has(id)) {
      return fail(`${field}.id`, 'category ids must be unique and cannot be "all"');
    }
    categoryIds.add(id);
    return {
      id,
      label: text(category.label, `${field}.label`),
      ...(category.icon !== undefined ? { icon: iconValue(category.icon, `${field}.icon`) } : {}),
    };
  });
  if (!Array.isArray(config.moments)) {
    return fail('moments', 'expected an array');
  }
  const ids = new Set<string>();
  const moments: JourneyMoment[] = [];
  config.moments.forEach((value, index) => {
    const field = `moments[${index}]`;
    const moment = record(value, field);
    if (typeof moment.published !== 'boolean') {
      return fail(`${field}.published`, 'explicitly set true or false');
    }
    if (!moment.published) return;

    const id = identifier(moment.id, `${field}.id`);
    if (ids.has(id)) return fail(`${field}.id`, 'moment ids must be unique');
    ids.add(id);
    const category = text(moment.category, `${field}.category`);
    if (!categoryIds.has(category)) {
      return fail(`${field}.category`, `unknown category "${category}"`);
    }
    const entry: JourneyMoment = {
      id,
      date: dateValue(moment.date, `${field}.date`),
      category,
      title: text(moment.title, `${field}.title`),
      story: text(moment.story, `${field}.story`),
    };
    if (moment.reflection !== undefined) {
      entry.reflection = text(moment.reflection, `${field}.reflection`);
    }
    if (moment.icon !== undefined) {
      entry.icon = iconValue(moment.icon, `${field}.icon`);
    }
    if (moment.links !== undefined) {
      if (!Array.isArray(moment.links)) return fail(`${field}.links`, 'expected an array');
      entry.links = moment.links.map((value, index) => {
        const linkField = `${field}.links[${index}]`;
        const link = record(value, linkField);
        return {
          label: text(link.label, `${linkField}.label`),
          href: linkValue(link.href, `${linkField}.href`),
        };
      });
    }
    if (moment.image !== undefined && moment.images !== undefined) {
      return fail(`${field}.images`, 'use images or the legacy image field, not both');
    }
    if (moment.images !== undefined) {
      if (!Array.isArray(moment.images)) return fail(`${field}.images`, 'expected an array');
      if (moment.images.length > 3) return fail(`${field}.images`, 'provide at most 3 images per moment');
      entry.images = moment.images.map((image, index) => imageValue(image, `${field}.images[${index}]`));
    } else if (moment.image !== undefined) {
      entry.images = [imageValue(moment.image, `${field}.image`)];
    }
    moments.push(entry);
  });
  return {
    title,
    subtitle,
    categories,
    moments: moments.sort((a, b) => a.date.localeCompare(b.date)),
  };
}

export function groupJourneyMoments(
  moments: readonly JourneyMoment[],
  category = 'all',
  order: JourneyOrder = 'oldest'
): { year: string; moments: JourneyMoment[] }[] {
  const sorted = moments
    .filter((moment) => category === 'all' || moment.category === category)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (order === 'newest') sorted.reverse();
  const groups: { year: string; moments: JourneyMoment[] }[] = [];
  for (const moment of sorted) {
    const year = moment.date.slice(0, 4);
    const previous = groups[groups.length - 1];
    if (previous?.year === year) previous.moments.push(moment);
    else groups.push({ year, moments: [moment] });
  }
  return groups;
}

export function formatJourneyDate(date: string): string {
  if (date.length === 4) return date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    ...(date.length === 10 ? { day: 'numeric' as const } : {}),
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date.length === 7 ? `${date}-01` : date}T00:00:00Z`));
}
