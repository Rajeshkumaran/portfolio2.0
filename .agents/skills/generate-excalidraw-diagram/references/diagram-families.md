# Diagram family contracts

Use these defaults unless the approved brief says otherwise.

## Architecture and system context

Use a lightweight C4-inspired vocabulary: people, systems, services or
containers, explicit ownership or trust boundaries, and labeled directional
relationships. Claim formal C4 compliance only when the user requests it and
the source supports the requested level.

## Sequence and interaction

Preserve chronological vertical order. Support participants, activation spans,
synchronous and asynchronous messages, returns, notes, and `alt`, `opt`, and
`loop` frames. Do not invent return messages.

## Flowchart and process

Use terminators, processes, decisions, data or storage, and connectors
consistently. Keep one dominant direction. Label every decision edge. Route
loops visibly without crossing labels.

## Data model and entity relationship

Use crow's-foot-style cardinality labels. Show entities, primary keys, foreign
keys, optionality, and named relationships. Hide non-key attributes in overview
mode unless the brief requires them.

## State machine

Require an initial state. Show final states when applicable. Label transitions
with known events, guards, and actions. Distinguish composite states. Report
unreachable states and unknown transition triggers instead of inventing them.

## Infrastructure and network

Use vendor-neutral shapes by default. Group components by region, network,
subnet, trust zone, or runtime boundary. Use approved official vendor icons
only when requested and embeddable.

## Concept map

Use short relationship phrases on edges. Distinguish hierarchy from
association. Choose one central concept or an explicit multi-root structure.
Do not create unlabeled spider-web links.

## Freeform explanation

Mixed shapes, callouts, and small motifs are allowed, but the diagram still
needs a clear reading order, semantic grouping, accessible encodings, and all
normal quality checks.

