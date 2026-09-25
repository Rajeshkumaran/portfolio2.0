import { DIAGRAM_FAMILIES } from "./types.js";
import type {
  Diagnostic,
  DiagramIR,
  EdgeIR,
  NodeIR,
  ValidationResult,
} from "./types.js";

const KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function diagnostic(
  severity: "error" | "warning",
  code: string,
  message: string,
  semanticKey?: string,
): Diagnostic {
  return semanticKey === undefined
    ? { severity, code, message }
    : { severity, code, message, semanticKey };
}

function validateNode(node: NodeIR, errors: Diagnostic[]): void {
  if (!KEY_PATTERN.test(node.key)) {
    errors.push(
      diagnostic(
        "error",
        "invalid-key",
        `Node key must be kebab-case: ${node.key}`,
        node.key,
      ),
    );
  }
  if (!node.label.trim()) {
    errors.push(
      diagnostic("error", "empty-label", "Node label is empty", node.key),
    );
  }
  if (
    [node.x, node.y, node.width, node.height].some(
      (value) => value !== undefined && !Number.isFinite(value),
    )
  ) {
    errors.push(
      diagnostic(
        "error",
        "invalid-geometry",
        "Node geometry must contain finite numbers",
        node.key,
      ),
    );
  }
}

function requireEdgeLabels(
  edges: EdgeIR[],
  errors: Diagnostic[],
  reason: string,
): void {
  for (const edge of edges) {
    if (!edge.label?.trim()) {
      errors.push(
        diagnostic("error", "missing-edge-label", reason, edge.key),
      );
    }
  }
}

export function validateIR(ir: DiagramIR): ValidationResult {
  const errors: Diagnostic[] = [];
  const warnings: Diagnostic[] = [];

  if (ir.version !== 1) {
    errors.push(
      diagnostic("error", "unsupported-ir-version", "IR version must be 1"),
    );
  }
  if (!KEY_PATTERN.test(ir.name ?? "")) {
    errors.push(
      diagnostic(
        "error",
        "invalid-name",
        "Diagram name must be a kebab-case identifier",
      ),
    );
  }
  if (!DIAGRAM_FAMILIES.includes(ir.family)) {
    errors.push(
      diagnostic(
        "error",
        "unsupported-family",
        `Unsupported diagram family: ${String(ir.family)}`,
      ),
    );
  }

  const nodes = ir.nodes ?? [];
  const edges = ir.edges ?? [];
  const groups = ir.groups ?? [];
  const annotations = ir.annotations ?? [];
  const allKeys = [
    ...nodes.map((item) => item.key),
    ...edges.map((item) => item.key),
    ...groups.map((item) => item.key),
    ...annotations.map((item) => item.key),
  ];

  if (ir.family === "sequence") {
    const sequence = ir.sequence;
    if (!sequence || sequence.participants.length < 2) {
      errors.push(
        diagnostic(
          "error",
          "sequence-participants",
          "Sequence diagrams require at least two participants",
        ),
      );
    } else {
      allKeys.push(
        ...sequence.participants.map((item) => item.key),
        ...sequence.messages.map((item) => item.key),
        ...(sequence.frames ?? []).map((item) => item.key),
      );
      const participants = new Set(
        sequence.participants.map((item) => item.key),
      );
      const messages = new Set(sequence.messages.map((item) => item.key));
      for (const message of sequence.messages) {
        if (!participants.has(message.from) || !participants.has(message.to)) {
          errors.push(
            diagnostic(
              "error",
              "unknown-participant",
              `Message ${message.key} references an unknown participant`,
              message.key,
            ),
          );
        }
        if (!message.label.trim()) {
          errors.push(
            diagnostic(
              "error",
              "missing-message-label",
              "Sequence messages require labels",
              message.key,
            ),
          );
        }
      }
      for (const frame of sequence.frames ?? []) {
        if (
          !messages.has(frame.fromMessage) ||
          !messages.has(frame.toMessage)
        ) {
          errors.push(
            diagnostic(
              "error",
              "unknown-frame-message",
              `Frame ${frame.key} references an unknown message`,
              frame.key,
            ),
          );
        }
      }
    }
  } else if (nodes.length === 0) {
    errors.push(
      diagnostic(
        "error",
        "missing-nodes",
        "Non-sequence diagrams require at least one node",
      ),
    );
  }

  const seen = new Set<string>();
  for (const key of allKeys) {
    if (!KEY_PATTERN.test(key)) {
      errors.push(
        diagnostic(
          "error",
          "invalid-key",
          `Semantic key must be kebab-case: ${key}`,
          key,
        ),
      );
    }
    if (seen.has(key)) {
      errors.push(
        diagnostic(
          "error",
          "duplicate-key",
          `Duplicate semantic key: ${key}`,
          key,
        ),
      );
    }
    seen.add(key);
  }

  for (const node of nodes) {
    validateNode(node, errors);
  }

  const nodeKeys = new Set(nodes.map((node) => node.key));
  for (const edge of edges) {
    if (!nodeKeys.has(edge.from) || !nodeKeys.has(edge.to)) {
      errors.push(
        diagnostic(
          "error",
          "unknown-edge-node",
          `Edge ${edge.key} references an unknown node`,
          edge.key,
        ),
      );
    }
  }
  for (const group of groups) {
    for (const member of group.members) {
      if (!nodeKeys.has(member)) {
        errors.push(
          diagnostic(
            "error",
            "unknown-group-member",
            `Group ${group.key} references unknown member ${member}`,
            group.key,
          ),
        );
      }
    }
  }
  for (const annotation of annotations) {
    if (annotation.target && !nodeKeys.has(annotation.target)) {
      errors.push(
        diagnostic(
          "error",
          "unknown-annotation-target",
          `Annotation ${annotation.key} references unknown target ${annotation.target}`,
          annotation.key,
        ),
      );
    }
  }

  if (ir.family === "flowchart") {
    const decisions = new Set(
      nodes.filter((node) => node.kind === "decision").map((node) => node.key),
    );
    for (const edge of edges.filter((item) => decisions.has(item.from))) {
      if (!edge.label?.trim()) {
        errors.push(
          diagnostic(
            "error",
            "unlabeled-decision",
            "Every decision branch must be labeled",
            edge.key,
          ),
        );
      }
    }
  }
  if (ir.family === "data-model") {
    for (const edge of edges) {
      if (!edge.fromCardinality || !edge.toCardinality) {
        errors.push(
          diagnostic(
            "error",
            "missing-cardinality",
            "Data-model relationships require cardinality at both ends",
            edge.key,
          ),
        );
      }
    }
  }
  if (ir.family === "state-machine") {
    const initials = nodes.filter((node) => node.kind === "initial");
    if (initials.length !== 1) {
      errors.push(
        diagnostic(
          "error",
          "initial-state",
          "State machines require exactly one initial state",
        ),
      );
    }
    requireEdgeLabels(
      edges,
      errors,
      "State transitions require known event, guard, or action labels",
    );
  }
  if (ir.family === "concept-map") {
    requireEdgeLabels(
      edges,
      errors,
      "Concept-map relationships require short relationship phrases",
    );
  }

  if (nodes.length > 25 || edges.length > 40) {
    warnings.push(
      diagnostic(
        "warning",
        "dense-diagram",
        "The diagram exceeds the preferred density threshold; propose a split",
      ),
    );
  }
  for (const item of [
    ...nodes,
    ...edges,
    ...groups,
    ...annotations,
    ...(ir.sequence?.participants ?? []),
    ...(ir.sequence?.messages ?? []),
  ]) {
    if (item.inferred) {
      warnings.push(
        diagnostic(
          "warning",
          "approved-inference",
          "Approved inferred content will use a distinct dashed style",
          item.key,
        ),
      );
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

