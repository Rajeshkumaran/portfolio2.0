import { stableId, stableSeed, versionNonce } from "./ids.js";
import { layoutDiagram } from "./layout.js";
import { fontFamily, resolveTheme } from "./theme.js";
import type {
  AnnotationIR,
  DiagramIR,
  ExcalidrawElement,
  ExcalidrawScene,
  LayoutEdge,
  LayoutNode,
  Point,
  SequenceFrameIR,
  Theme,
} from "./types.js";

const SOURCE = "https://github.com/Rajeshkumaran/portfolio2.0";
const CREATED_AT = 1;

interface CompileContext {
  namespace: string;
  theme: Theme;
  previous: Map<string, ExcalidrawElement>;
}

function semanticKey(key: string, role: string): string {
  return role === "shape" ? key : `${key}--${role}`;
}

function common(
  context: CompileContext,
  key: string,
  role: string,
  type: string,
  x: number,
  y: number,
  width: number,
  height: number,
  inferred = false,
): ExcalidrawElement {
  const elementKey = semanticKey(key, role);
  const previous = context.previous.get(elementKey);
  return {
    id: previous?.id ?? stableId(context.namespace, elementKey),
    type,
    x,
    y,
    width,
    height,
    angle: 0,
    strokeColor: inferred ? context.theme.warning : context.theme.text,
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: inferred ? "dashed" : "solid",
    roughness: context.theme.roughness,
    opacity: 100,
    groupIds: [],
    frameId: null,
    index: null,
    roundness: type === "rectangle" ? { type: 3 } : null,
    seed: stableSeed(context.namespace, elementKey),
    version: 1,
    versionNonce: versionNonce(context.namespace, elementKey),
    isDeleted: false,
    boundElements: null,
    updated: CREATED_AT,
    link: null,
    locked: false,
    customData: { semanticKey: elementKey, role, inferred },
  };
}

function shapeType(node: LayoutNode): "rectangle" | "ellipse" | "diamond" {
  if (node.kind === "decision") {
    return "diamond";
  }
  if (
    node.kind === "terminator" ||
    node.kind === "initial" ||
    node.kind === "final" ||
    node.kind === "person"
  ) {
    return "ellipse";
  }
  return "rectangle";
}

function nodeText(node: LayoutNode): string {
  if (node.attributes?.length) {
    return [
      node.label,
      ...node.attributes.map((attribute) => {
        const marker = attribute.key ? `${attribute.key} ` : "";
        const optional = attribute.optional ? "?" : "";
        const type = attribute.type ? `: ${attribute.type}` : "";
        return `${marker}${attribute.name}${optional}${type}`;
      }),
    ].join("\n");
  }
  return [node.label, ...(node.details ?? [])].join("\n");
}

function makeText(
  context: CompileContext,
  key: string,
  role: string,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  options: {
    fontSize?: number;
    color?: string;
    align?: "left" | "center";
    inferred?: boolean;
  } = {},
): ExcalidrawElement {
  const fontSize = options.fontSize ?? 20;
  const maxCharacters = Math.max(4, Math.floor(width / (fontSize * 0.56)));
  const wrappedText = text
    .split("\n")
    .flatMap((line) => {
      const words = line.split(/\s+/).filter(Boolean);
      if (words.length === 0) {
        return [""];
      }
      const lines: string[] = [];
      let current = "";
      for (const word of words) {
        if (!current) {
          current = word;
        } else if (`${current} ${word}`.length <= maxCharacters) {
          current = `${current} ${word}`;
        } else {
          lines.push(current);
          current = word;
        }
      }
      lines.push(current);
      return lines;
    })
    .join("\n");
  return {
    ...common(
      context,
      key,
      role,
      "text",
      x,
      y,
      width,
      height,
      options.inferred,
    ),
    strokeColor: options.color ?? context.theme.text,
    backgroundColor: "transparent",
    text: wrappedText,
    fontSize,
    fontFamily: fontFamily(context.theme),
    textAlign: options.align ?? "center",
    verticalAlign: "middle",
    containerId: null,
    originalText: text,
    autoResize: false,
    lineHeight: 1.25,
  };
}

function makeNode(
  context: CompileContext,
  node: LayoutNode,
): ExcalidrawElement[] {
  const type = shapeType(node);
  const shape = common(
    context,
    node.key,
    "shape",
    type,
    node.x,
    node.y,
    node.width,
    node.height,
    node.inferred,
  );
  shape.backgroundColor =
    node.style?.backgroundColor ??
    (node.kind === "external"
      ? context.theme.surfaceAlt
      : context.theme.surface);
  shape.strokeColor =
    node.style?.strokeColor ??
    (node.inferred ? context.theme.warning : context.theme.accent);
  shape.strokeStyle =
    node.style?.strokeStyle ?? (node.inferred ? "dashed" : "solid");
  if (node.kind === "initial") {
    shape.backgroundColor = context.theme.text;
    shape.strokeColor = context.theme.text;
    return [shape];
  }
  if (node.kind === "final") {
    shape.backgroundColor = context.theme.background;
    shape.strokeWidth = 4;
    return [shape];
  }

  const text = nodeText(node);
  const label = makeText(
    context,
    node.key,
    "label",
    text,
    node.x + 16,
    node.y + 12,
    node.width - 32,
    node.height - 24,
    {
      fontSize: node.attributes?.length ? 17 : 20,
      align: node.attributes?.length ? "left" : "center",
      inferred: node.inferred,
    },
  );
  return [shape, label];
}

function edgeBounds(points: Point[]): {
  x: number;
  y: number;
  width: number;
  height: number;
  relative: [number, number][];
} {
  const origin = points[0] ?? { x: 0, y: 0 };
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return {
    x: origin.x,
    y: origin.y,
    width: Math.max(1, Math.max(...xs) - Math.min(...xs)),
    height: Math.max(1, Math.max(...ys) - Math.min(...ys)),
    relative: points.map((point) => [point.x - origin.x, point.y - origin.y]),
  };
}

function makeArrow(
  context: CompileContext,
  edge: LayoutEdge,
  nodeIds: Map<string, string>,
  options: { endArrowhead?: "arrow" | null; role?: string } = {},
): ExcalidrawElement[] {
  const bounds = edgeBounds(edge.points);
  const role = options.role ?? "edge";
  const arrow = {
    ...common(
      context,
      edge.key,
      role,
      "arrow",
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
      edge.inferred,
    ),
    points: bounds.relative,
    lastCommittedPoint: null,
    startBinding: nodeIds.has(edge.from)
      ? { elementId: nodeIds.get(edge.from), focus: 0, gap: 8 }
      : null,
    endBinding: nodeIds.has(edge.to)
      ? { elementId: nodeIds.get(edge.to), focus: 0, gap: 8 }
      : null,
    startArrowhead: null,
    endArrowhead: options.endArrowhead === undefined ? "arrow" : options.endArrowhead,
    elbowed: edge.points.length > 2,
  };

  const label = [
    edge.fromCardinality,
    edge.label,
    edge.toCardinality,
  ]
    .filter(Boolean)
    .join("  ");
  if (!label) {
    return [arrow];
  }
  const width = Math.min(300, Math.max(80, label.length * 8.5 + 24));
  return [
    arrow,
    makeText(
      context,
      edge.key,
      "edge-label",
      label,
      edge.labelPoint.x - width / 2,
      edge.labelPoint.y - 18,
      width,
      36,
      { fontSize: 16, inferred: edge.inferred },
    ),
  ];
}

function makeGroup(
  context: CompileContext,
  group: {
    key: string;
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    inferred?: boolean;
  },
): ExcalidrawElement[] {
  const boundary = common(
    context,
    group.key,
    "group",
    "rectangle",
    group.x,
    group.y,
    group.width,
    group.height,
    group.inferred,
  );
  boundary.backgroundColor = "transparent";
  boundary.strokeColor = group.inferred
    ? context.theme.warning
    : context.theme.boundary;
  boundary.strokeStyle = "dashed";
  const label = makeText(
    context,
    group.key,
    "group-label",
    group.label,
    group.x + 12,
    group.y + 6,
    Math.min(group.width - 24, Math.max(140, group.label.length * 11 + 12)),
    32,
    { fontSize: 18, align: "left", inferred: group.inferred },
  );
  return [boundary, label];
}

function makeAnnotation(
  context: CompileContext,
  annotation: AnnotationIR,
  nodeByKey: Map<string, LayoutNode>,
  ordinal: number,
): ExcalidrawElement[] {
  const target = annotation.target
    ? nodeByKey.get(annotation.target)
    : undefined;
  const x = target ? target.x + target.width + 36 : 80;
  const y = target ? target.y + ordinal * 76 : 80 + ordinal * 110;
  const width = 220;
  const height = Math.max(
    92,
    Math.ceil(annotation.label.length / 22) * 24 + 32,
  );
  const box = common(
    context,
    annotation.key,
    "annotation",
    "rectangle",
    x,
    y,
    width,
    height,
    annotation.inferred,
  );
  box.backgroundColor =
    annotation.kind === "warning" ? "#fff7ed" : "#fef9c3";
  box.strokeColor =
    annotation.kind === "warning"
      ? context.theme.warning
      : context.theme.boundary;
  return [
    box,
    makeText(
      context,
      annotation.key,
      "annotation-label",
      annotation.label,
      x + 12,
      y + 10,
      width - 24,
      height - 20,
      { fontSize: 16, align: "left", inferred: annotation.inferred },
    ),
  ];
}

function frameRange(
  frame: SequenceFrameIR,
  messageY: Map<string, number>,
): { y: number; height: number } {
  const from = messageY.get(frame.fromMessage) ?? 180;
  const to = messageY.get(frame.toMessage) ?? from;
  return { y: Math.min(from, to) - 38, height: Math.abs(to - from) + 82 };
}

function compileSequence(
  context: CompileContext,
  ir: DiagramIR,
): ExcalidrawElement[] {
  const sequence = ir.sequence!;
  const left = 100;
  const participantGap = 260;
  const top = ir.title ? 120 : 70;
  const headerWidth = 180;
  const headerHeight = 64;
  const messageGap = 88;
  const bottom = top + 140 + Math.max(1, sequence.messages.length) * messageGap;
  const elements: ExcalidrawElement[] = [];
  const participantX = new Map<string, number>();
  const participantIds = new Map<string, string>();
  const messageY = new Map<string, number>();

  sequence.participants.forEach((participant, index) => {
    const center = left + index * participantGap + headerWidth / 2;
    participantX.set(participant.key, center);
    const node: LayoutNode = {
      key: participant.key,
      label: participant.label,
      kind: "participant",
      inferred: participant.inferred,
      x: center - headerWidth / 2,
      y: top,
      width: headerWidth,
      height: headerHeight,
    };
    const nodeElements = makeNode(context, node);
    elements.push(...nodeElements);
    participantIds.set(participant.key, nodeElements[0]!.id);

    const lifeline: LayoutEdge = {
      key: `${participant.key}-lifeline`,
      from: participant.key,
      to: participant.key,
      points: [
        { x: center, y: top + headerHeight },
        { x: center, y: bottom },
      ],
      labelPoint: { x: center, y: (top + headerHeight + bottom) / 2 },
      inferred: participant.inferred,
    };
    const [line] = makeArrow(context, lifeline, new Map(), {
      endArrowhead: null,
      role: "lifeline",
    });
    line!.strokeStyle = "dashed";
    elements.push(line!);
  });

  for (const [index, message] of sequence.messages.entries()) {
    const y = top + 130 + index * messageGap;
    messageY.set(message.key, y);
    const fromX = participantX.get(message.from)!;
    const toX = participantX.get(message.to)!;
    const edge: LayoutEdge = {
      key: message.key,
      from: message.from,
      to: message.to,
      label: message.label,
      kind: message.kind,
      inferred: message.inferred,
      points: [
        { x: fromX, y },
        { x: toX, y },
      ],
      labelPoint: { x: (fromX + toX) / 2, y },
    };
    const arrowElements = makeArrow(context, edge, participantIds, {
      endArrowhead: message.kind === "return" ? null : "arrow",
    });
    if (message.kind === "return") {
      arrowElements[0]!.strokeStyle = "dashed";
    }
    elements.push(...arrowElements);
    if (message.activate) {
      const activation = common(
        context,
        message.key,
        "activation",
        "rectangle",
        toX - 7,
        y + 10,
        14,
        52,
        message.inferred,
      );
      activation.backgroundColor = context.theme.surfaceAlt;
      elements.push(activation);
    }
  }

  for (const frame of sequence.frames ?? []) {
    const range = frameRange(frame, messageY);
    const x = left - 40;
    const right =
      left + (sequence.participants.length - 1) * participantGap + headerWidth;
    const boundary = common(
      context,
      frame.key,
      "frame",
      "rectangle",
      x,
      range.y,
      right - x,
      range.height,
    );
    boundary.strokeColor = context.theme.boundary;
    boundary.strokeStyle = "dashed";
    elements.push(
      boundary,
      makeText(
        context,
        frame.key,
        "frame-label",
        `${frame.kind} · ${frame.label}`,
        x + 12,
        range.y + 8,
        Math.min(300, frame.label.length * 10 + 90),
        28,
        { fontSize: 16, align: "left" },
      ),
    );
  }

  return elements;
}

function previousElements(scene: ExcalidrawScene | undefined): Map<string, ExcalidrawElement> {
  const entries = (scene?.elements ?? [])
    .map((element) => [element.customData?.semanticKey, element] as const)
    .filter(
      (entry): entry is readonly [string, ExcalidrawElement] =>
        typeof entry[0] === "string",
    );
  return new Map(entries);
}

function applyBaseGeometry(
  ir: DiagramIR,
  base: ExcalidrawScene | undefined,
): DiagramIR {
  if (!base || ir.family === "sequence") {
    return ir;
  }
  const previous = previousElements(base);
  return {
    ...ir,
    nodes: (ir.nodes ?? []).map((node) => {
      const element = previous.get(node.key);
      if (!element || element.type === "text") {
        return node;
      }
      return { ...node, x: element.x, y: element.y };
    }),
  };
}

export function compileScene(
  input: DiagramIR,
  base?: ExcalidrawScene,
): ExcalidrawScene {
  const ir = applyBaseGeometry(input, base);
  const context: CompileContext = {
    namespace: ir.name,
    theme: resolveTheme(ir.theme),
    previous: previousElements(base),
  };
  const elements: ExcalidrawElement[] = [];

  if (ir.title) {
    elements.push(
      makeText(context, "diagram-title", "title", ir.title, 80, 28, 720, 44, {
        fontSize: 30,
        align: "left",
      }),
    );
  }

  if (ir.family === "sequence") {
    elements.push(...compileSequence(context, ir));
  } else {
    const layout = layoutDiagram(ir);
    const nodeByKey = new Map(layout.nodes.map((node) => [node.key, node]));

    for (const group of layout.groups) {
      elements.push(...makeGroup(context, group));
    }
    const nodeIds = new Map<string, string>();
    for (const node of layout.nodes) {
      const nodeElements = makeNode(context, node);
      elements.push(...nodeElements);
      nodeIds.set(node.key, nodeElements[0]!.id);
    }
    for (const edge of layout.edges) {
      elements.push(...makeArrow(context, edge, nodeIds));
    }
    for (const [index, annotation] of (ir.annotations ?? []).entries()) {
      elements.push(
        ...makeAnnotation(context, annotation, nodeByKey, index),
      );
    }
  }

  if (base && ir.preserveUnmentioned) {
    const generatedKeys = new Set(
      elements.map((element) => element.customData?.semanticKey),
    );
    for (const element of base.elements) {
      if (!generatedKeys.has(element.customData?.semanticKey)) {
        elements.push(element);
      }
    }
  }

  return {
    type: "excalidraw",
    version: 2,
    source: SOURCE,
    elements,
    appState: {
      ...(base?.appState ?? {}),
      viewBackgroundColor: context.theme.background,
      gridSize: null,
      gridStep: 5,
      gridModeEnabled: false,
      zenModeEnabled: false,
    },
    files: { ...(base?.files ?? {}) },
  };
}
