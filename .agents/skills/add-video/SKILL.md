---
name: add-video
description: Add a learning video to the Rajeshkumaran/portfolio2.0 repository. Use when the user wants to publish, catalog, or add a video to the portfolio learning hub.
---

Add one educational video to the `Rajeshkumaran/portfolio2.0` learning hub.

This skill may be invoked from any directory, but it must never modify the
invoking repository unless that repository is the verified portfolio
repository.

## Resolve the repository

Resolve the target repository in this order:

1. The path in `PORTFOLIO_REPO`, when set.
2. The current Git worktree, if its remote matches
   `Rajeshkumaran/portfolio2.0`.
3. `/Users/rajesh/workspace/personal_projects/portfolio2.0`.

Do not search the filesystem.

Before making changes, verify that:

- The path is a Git repository.
- A configured remote resolves to `Rajeshkumaran/portfolio2.0`.
- SSH and HTTPS remote aliases are treated equivalently.
- `src/app/data/videos.json`, `src/app/data/learning.json`,
  `scripts/add-video.mjs`, and `package.json` exist.

Reject forks, unrelated repositories, and ambiguous matches unless the user
explicitly approves an override.

Run every command against the resolved repository path. Never change branches,
files, commits, or remotes in the directory from which the skill was invoked.

## Check repository safety

Before gathering content:

1. Inspect the current branch and worktree status.
2. Fetch remote state without changing the worktree or history.
3. Report whether the current branch is ahead, behind, or diverged.
4. Never clone, pull, merge, rebase, reset, stash, or discard changes without
   explicit approval.

Unrelated modified or untracked files may remain, but warn the user and never
stage or commit them. Stop if either data file or another file this workflow
must edit already has uncommitted changes.

## Collect input

Collect these required fields together:

- Video URL
- Original title
- Original description

The URL must be an absolute `https://` URL.

## Normalize and verify the URL

Normalize the URL without changing its destination:

- Remove known tracking parameters.
- Resolve safe short-form redirects when possible.
- Preserve meaningful query parameters.
- Show both submitted and stored URLs in the preview when they differ.

Determine the platform and catalog ID:

- YouTube: extract the 11-character video ID.
- Instagram: derive a stable URL-safe ID when needed.
- Other platforms: propose a stable lowercase platform-based ID containing
  only letters, numbers, underscores, and hyphens.

Never silently replace an existing catalog ID.

Attempt to verify that the URL is publicly reachable. If verification fails or
the video appears private, explain what could not be verified and require a
separate confirmation before continuing. Ordinary preview approval does not
waive this warning.

For non-YouTube and non-Instagram URLs, use `--video-url`. These entries open
through an external **Watch video** link and are not embedded inline. Clearly
disclose this behavior in the preview.

## Detect duplicates

Block the operation when the catalog already contains the same ID or canonical
URL.

Also inspect existing titles and descriptions for likely semantic duplicates.
Show any likely match with its title and category, then require explicit
approval to continue. Semantic similarity is a warning, not an automatic
rejection.

## Use metadata conservatively

Public metadata may be used to determine:

- Canonical URL and platform
- Video ID
- `short` or `long` format
- Original publication date
- Topic and category relevance
- Roadmap position

Do not silently copy a creator-written title or description. The user-supplied
title and description remain the editorial source of truth.

If the original publication date cannot be determined reliably, ask the user.
Do not substitute the date the video is added.

Infer `short` or `long` when reliable. Otherwise ask the user.

## Rewrite the copy

Preserve the user's factual meaning, language, and claims. Never invent facts,
benefits, technologies, examples, or learning outcomes. Do not translate
without approval or add clickbait, emojis, or unsupported promotional language.

Rewrite the title to be:

- Professional and educational
- Clear to a broad professional audience
- Accessible to beginners
- Precise about the main concept
- Written in title case
- Ideally 45-70 characters

Lead with the educational concept rather than the platform or creator. Exceed
the target length only when shortening would damage accuracy.

Rewrite the description as one or two concise sentences, ideally 140-280
characters. State what the viewer will learn and why the concept matters or
where it applies. Preserve precise technical terms and briefly explain
specialized terms when useful.

The description is used for page metadata and structured video data, so prefer
a unique, keyword-led opening.

## Recommend topic, category, and position

The top-level topics are `tech` and `finance`. Read the current categories from
`src/app/data/learning.json`.

Recommend exactly one topic and category with a one-line rationale. Ask the
user when confidence is low, the content reasonably spans categories, or no
existing category is suitable.

Prefer the closest existing category. If the user rejects every suitable
category, propose a new category with:

- Topic
- ID
- Slug
- Name
- Blurb
- Position within the topic

Do not create it without separate approval. An approved category and its first
video are one atomic preview, diff, commit, and push.

Category order defines the learning sequence and previous/next navigation.
Recommend an educational 1-based insertion position based on prerequisite
complexity and neighboring lessons. Show the preceding and following video
titles and let the user override the position.

## Preview before editing

Before changing any file, show:

| Field | Proposed value |
|---|---|
| Submitted URL | Original input |
| Stored URL | Canonical URL |
| Platform behavior | Inline playback or external link |
| Video ID | Catalog key |
| Title | Rewritten title |
| Description | Rewritten description |
| Language | Preserved language |
| Format | `short` or `long` |
| Publication date | Original publication date |
| Topic | `tech` or `finance` |
| Category | ID and name |
| Category rationale | Why it fits |
| Position | 1-based roadmap position |
| Previous video | Neighbor title or none |
| Next video | Neighbor title or none |
| Files changed | Exact repository-relative paths |

Ask whether the preview is approved. Do not change files before approval.

If rejected, ask which fields should change and accept guidance such as
shorter, more technical, more beginner-friendly, less promotional, different
category, or different position. Revise only rejected fields and show the full
preview again.

If no feedback is supplied, produce a meaningfully different version rather
than superficial synonym substitutions. After three rejected editorial
variants, collect structured preferences for tone, length, technical depth,
audience, and disliked wording.

Continue until approved.

## Prepare the branch

After preview approval, prepare a safe branch.

When on the default branch, create:

```text
content/add-video-<id>
```

If the branch already exists locally or remotely, inspect whether it contains
the same video and ask before resuming it. Otherwise propose a numeric suffix
such as `content/add-video-<id>-2`.

Use an existing non-default branch only when it is safe and clearly related to
the requested change. Do not switch branches when doing so would overwrite or
conflict with existing work.

## Apply the change

For an approved new category, update `src/app/data/learning.json` first with
the approved category definition.

Then run the repository's existing publishing script:

```bash
npm run video:add -- \
  --id "<id>" \
  --title "<approved title>" \
  --format "<short-or-long>" \
  --topic "<tech-or-finance>" \
  --category "<category-id-or-slug>" \
  --description "<approved description>" \
  --published "<YYYY-MM-DD>" \
  --position "<1-based-position>" \
  <platform-link-option>
```

Use exactly one primary platform option:

```text
--youtube "<url>"
--instagram "<url>"
--video-url "<url>"
```

Quote every user-derived command argument safely. Do not duplicate the
script's catalog-writing logic manually.

## Validate

Run:

```bash
npm run learning:list -- "<category-id-or-slug>"
npm run build
```

Also verify that:

- Both JSON files parse successfully.
- The catalog contains the expected entry.
- The selected category references the ID exactly once.
- The roadmap position matches the approved preview.
- No unrelated files were modified by the workflow.
- Generic URLs appear as external links.
- YouTube and Instagram behavior remains unchanged.

Block failures caused by the change. For a clearly pre-existing unrelated
failure, show the evidence and require explicit approval before continuing.
Never describe failed validation as successful.

## Approve the exact diff

After editing and validation, show the exact Git diff and changed-file list.
Require a second explicit approval before committing or pushing.

If the diff differs materially from the approved preview, explain why and
return to preview approval.

## Commit and push

Stage only the approved files and use:

```text
content: add video <id>
```

Follow active repository and environment requirements for commit trailers.
Never amend, squash, reset, or discard an existing commit unless explicitly
requested.

Push the approved content branch to its configured upstream remote. Never
force-push.

Retry once only when a push failure is clearly transient. Otherwise preserve
the local commit and report the branch, commit SHA, exact failure, and safe
recovery action. Do not claim that publication succeeded.

Do not open or merge a pull request unless explicitly requested.

## Report completion

Report:

- Final title
- Video ID
- Topic and category
- Roadmap position
- Inline-playable or external-link behavior
- Branch name
- Commit SHA
- Validation result
- Push result

Only report success after the approved commit has been pushed.
