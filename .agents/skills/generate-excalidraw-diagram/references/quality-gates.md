# Quality gates

## Blocking failures

- Invalid Diagram IR or Excalidraw top-level structure
- Duplicate semantic keys or element IDs
- Missing approved nodes, relationships, messages, groups, or annotations
- Edges or bindings referencing missing elements
- NaN, infinite, negative-size, or off-canvas geometry
- Text below the configured minimum readable size
- Text likely clipped by its container
- Material node overlap
- Connector paths through node interiors
- Required relationships without labels
- Flowchart decision branches without labels
- Data-model relationships without cardinality
- State machines without an initial state
- Sequence messages referencing unknown participants
- Text/background contrast below 4.5:1
- Semantic meaning conveyed only by color
- Browser render failure or fonts not loaded

## Warnings

- Moderate edge crossings
- Uneven whitespace or non-critical alignment variance
- Dense scenes approaching the split threshold
- Long labels that reduce scanability
- Approved inferred content
- Missing optional image-model review

## Repair order

1. Normalize dimensions and canvas origin.
2. Increase node or group spacing.
3. Move edge labels and reroute connectors.
4. Expand containers and text boxes.
5. Reduce approved secondary detail or propose a split.

Never repair a missing fact by inventing it. Never delete approved content to
make validation pass without user approval.

