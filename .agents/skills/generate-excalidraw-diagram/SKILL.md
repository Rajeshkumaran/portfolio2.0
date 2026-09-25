---
name: generate-excalidraw-diagram
description: Create, revise, render, or validate editable Excalidraw diagrams when the user needs a visual architecture, sequence, flow, data model, state machine, infrastructure view, concept map, or freeform technical explanation.
---

# Generate Excalidraw Diagram

Produce an editable `.excalidraw` scene and a PNG rendered from that exact
scene. Do not claim completion until the scene passes validation and the user
approves the PNG preview.

This skill supports four modes:

- **Create** a diagram from approved text, documents, code, or conversation.
- **Revise** an existing `.excalidraw` scene without disturbing unaffected
  content.
- **Render** an existing scene to PNG.
- **Validate** a Diagram IR or Excalidraw scene.

## Establish the source scope

If the user already supplied sources, use them. If they explicitly request the
current conversation or current repository, use that scope. Otherwise ask
whether the source is supplied files, the current conversation, the current
repository, or a named subset. Never silently scan an entire repository.

Inspect the smallest source set needed for the requested purpose. Follow
definitions and relationships when necessary, but distinguish static
structure, observed behavior, documented intent, and user-approved inference.

Exclude credentials, tokens, keys, connection strings, personal data, and
secret values. Ask before including potentially sensitive identifiers such as
internal hostnames or account IDs.

When sources conflict, stop and ask whether the diagram should show the
as-is state, intended state, or both. Never merge contradictory evidence
silently.

## Approve a brief before generation

For non-trivial requests, present a brief containing:

- Purpose and audience
- Source scope and provenance
- Recommended diagram family and rationale
- Required nodes, relationships, groups, and annotations
- Exclusions and approved inferences
- Detail level and split proposal when dense
- Orientation and theme overrides
- Output paths

Let the user override the recommended family. Warn near 25 primary nodes or 40
relationships and propose an overview plus focused diagrams. Never make text
tiny to force everything onto one canvas.

Read [references/diagram-families.md](references/diagram-families.md) when
choosing notation. Read [references/ir-schema.md](references/ir-schema.md)
before writing Diagram IR.

## Generate through the deterministic pipeline

The model produces the approved brief and typed Diagram IR only. Do not
hand-author native Excalidraw element JSON.

Run commands from this skill directory:

```bash
npm run check
npm run validate:ir -- --input "<diagram.ir.json>"
npm run generate -- --input "<diagram.ir.json>" --output "<diagram.excalidraw>"
npm run render -- --input "<diagram.excalidraw>" --output "<diagram.png>"
npm run validate:scene -- --input "<diagram.excalidraw>" --ir "<diagram.ir.json>"
```

For a revision, pass `--base "<existing.excalidraw>"`. The generator preserves
matching element IDs and custom styling through stable semantic keys. Include
the full intended scene in the IR unless `preserveUnmentioned` is explicitly
approved.

If dependencies or Chromium are missing, explain the download and ask
permission before running:

```bash
npm run setup
```

Normal generation is offline. Do not fetch logos, icons, or images unless the
user approves a specific source. Embed approved assets so the scene remains
portable.

## Validate and repair

Read [references/quality-gates.md](references/quality-gates.md) for blocking
and warning conditions.

The PNG must be rendered from the delivered `.excalidraw` file. Validate:

1. Diagram IR structure and family-specific semantics.
2. Scene structure, unique IDs, bindings, finite geometry, semantic inventory,
   text size, contrast, clipping, overlap, and canvas bounds.
3. Browser rendering with fonts loaded.
4. Visual hierarchy and ambiguity with image inspection when available.

Repair deterministic geometry issues first. The model may reduce density or
improve grouping without changing approved facts. Missing facts, source
conflicts, or removal of approved content require user input.

Attempt at most three generate-render-validate repair cycles. If blocking
issues remain, preserve the failed candidate and diagnostics, leave existing
final artifacts untouched, and report failure plainly. A structurally checked
scene produced without Playwright is an **unvalidated draft**, not completion.

## Preview and revise

Open the PNG with the host image viewer when available and always report its
path. If inline viewing is unavailable, require the user to inspect the saved
file.

Accept revision feedback by visible label, semantic key, group, or region.
Summarize broad structural changes before applying them. After every revision,
rerender and rerun the full validation suite.

Preserve unaffected IDs, geometry, style, grouping, bindings, files, and app
state when editing existing scenes. Save a new version by default. Before an
approved overwrite, create timestamped backups of both source and preview.

## Deliver atomically

Use a temporary workspace for intermediate bundles, Mermaid, previews, and
failed candidates. Write final artifacts atomically and never overwrite
silently. By default deliver:

- `<name>.excalidraw`
- `<name>.png`

For approved splits, produce an overview and consistently named focused pairs.
Keep the manifest in the conversation unless a file is requested.

Completion requires all of the following:

- The delivered scene passes structural, semantic, geometry, and accessibility
  validation.
- The delivered PNG was rendered from that exact scene.
- The user explicitly approves the preview.

