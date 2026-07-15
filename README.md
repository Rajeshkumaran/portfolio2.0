This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learning hub content

Videos live in two data files under `src/app/data/`:

- **`videos.json`** — the flat catalog, keyed by the 11-character YouTube id. Holds each video's `title`, `format` (`short` | `long`), `description`, `publishedAt`, and optional links.
- **`learning.json`** — topics (`tech`, `finance`) → categories → an ordered `videos` array of ids.

A video only appears on the site (page, sitemap, and SEO metadata/JSON-LD) when it's in **both** files: the catalog entry supplies the metadata, and the id must be referenced in a category's `videos` array — that reference is what actually renders it (see `src/app/lib/learning.ts`).

### Publishing a new video

Use the helper script, which updates both files, validates the topic/category, prevents duplicates, and preserves formatting:

```bash
npm run video:add -- \
  --id VIDEO_ID \
  --title "Video title" \
  --format short \            # or long
  --topic tech \              # tech | finance
  --category system-design \  # a category id or slug
  --description "One or two sentences summarising the video." \
  --published 2026-07-15      # optional, defaults to today
```

Then regenerate the static output:

```bash
npm run build
```

Extra flags: `--position N` places the video at a 1-based step in the roadmap (default: append); `--instagram`, `--youtube`, and `--github` add links. For an Instagram-only video, pass a non-YouTube id together with `--instagram <url>`.

The `description` feeds both the page's `<meta description>` (clamped to 160 characters) and the JSON-LD `VideoObject.description` (full text) — write a unique, keyword-led summary so crawlers grasp the gist immediately.

Preview a category's roadmap order at any time:

```bash
npm run learning:list -- <category id or slug>
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
