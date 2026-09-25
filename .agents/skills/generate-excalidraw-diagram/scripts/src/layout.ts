import dagre from "@dagrejs/dagre";
import { resolveTheme, spacing } from "./theme.js";
import type {
  DiagramIR,
  LayoutEdge,
  LayoutGroup,
  LayoutNode,
  LayoutResult,
  NodeIR,
  Point,
} from "./types.js";

const MIN_NODE_WIDTH = 170;
const MIN_NODE_HEIGHT = 76;
const CANVAS_MARGIN = 80;

function longestLine(lines: string[]): number {
  return Math.max(...lines.map((line) => line.length), 1);
}

function nodeLines(node: NodeIR): string[] {
  if (node.attributes?.length) {
    return [
      node.label,
      ...node.attributes.map((attribute) => {
        const marker = attribute.key ? `${attribute.key} ` : "";
        const optional = attribute.optional ? "?" : "";
        const type = attribute.type ? `: ${attribute.type}` : "";
        return `${marker}${attribute.name}${optional}${type}`;
      }),
    ];
  }
  return [node.label, ...(node.details ?? [])];
}

export function measureNode(node: NodeIR): {
  width: number;
  height: number;
} {
  if (node.kind === "initial" || node.kind === "final") {
    return { width: 42, height: 42 };
  }
  const lines = nodeLines(node);
  const longest = longestLine(lines);
  const width = Math.max(
    MIN_NODE_WIDTH,
    Math.min(360, longest * 9.5 + 44),
    node.width ?? 0,
  );
  const usableCharacters = Math.max(12, Math.floor((width - 44) / 9.5));
  const wrappedLineCount = lines.reduce(
    (count, line) => count + Math.max(1, Math.ceil(line.length / usableCharacters)),
    0,
  );
  const height = Math.max(
    MIN_NODE_HEIGHT,
    42 + Math.max(0, wrappedLineCount - 1) * 24,
    node.height ?? 0,
  );
  return { width, height };
}

function normalizePoints(points: Point[]): Point[] {
  if (points.length < 2) {
    return points;
  }
  const result: Point[] = [points[0]!];
  for (const point of points.slice(1)) {
    const previous = result.at(-1)!;
    if (previous.x !== point.x || previous.y !== point.y) {
      result.push(point);
    }
  }
  return result;
}

function midpoint(points: Point[]): Point {
  if (points.length === 0) {
    return { x: 0, y: 0 };
  }
  const middle = Math.floor((points.length - 1) / 2);
  const first = points[middle]!;
  const second = points[Math.min(middle + 1, points.length - 1)]!;
  return { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
}

function boundsForMembers(
  members: string[],
  nodes: Map<string, LayoutNode>,
  padding: number,
): Pick<LayoutGroup, "x" | "y" | "width" | "height"> {
  const selected = members
    .map((key) => nodes.get(key))
    .filter((node): node is LayoutNode => node !== undefined);
  if (selected.length === 0) {
    return { x: CANVAS_MARGIN, y: CANVAS_MARGIN, width: 240, height: 160 };
  }
  const minX = Math.min(...selected.map((node) => node.x));
  const minY = Math.min(...selected.map((node) => node.y));
  const maxX = Math.max(
    ...selected.map((node) => node.x + node.width),
    minX + 200,
  );
  const maxY = Math.max(
    ...selected.map((node) => node.y + node.height),
    minY + 120,
  );
  return {
    x: minX - padding,
    y: minY - padding - 24,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2 + 24,
  };
}

export function layoutDiagram(ir: DiagramIR): LayoutResult {
  const theme = resolveTheme(ir.theme);
  const gaps = spacing(theme);
  const graph = new dagre.graphlib.Graph({ multigraph: true });
  graph.setGraph({
    rankdir: ir.orientation ?? (ir.family === "architecture" ? "LR" : "TB"),
    ranksep: gaps.rank,
    nodesep: gaps.node,
    edgesep: 24,
    marginx: CANVAS_MARGIN,
    marginy: CANVAS_MARGIN,
    acyclicer: "greedy",
    ranker: "network-simplex",
  });
  graph.setDefaultEdgeLabel(() => ({}));

  const sourceNodes = [...(ir.nodes ?? [])].sort((a, b) =>
    a.key.localeCompare(b.key),
  );
  for (const node of sourceNodes) {
    graph.setNode(node.key, measureNode(node));
  }
  for (const edge of [...(ir.edges ?? [])].sort((a, b) =>
    a.key.localeCompare(b.key),
  )) {
    graph.setEdge(edge.from, edge.to, { semanticKey: edge.key }, edge.key);
  }
  dagre.layout(graph);

  let nodes = sourceNodes.map<LayoutNode>((node) => {
    const measured = measureNode(node);
    const laidOut = graph.node(node.key) as {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    return {
      ...node,
      width: measured.width,
      height: measured.height,
      x: node.x ?? laidOut.x - measured.width / 2,
      y: node.y ?? laidOut.y - measured.height / 2,
    };
  });

  const minX = Math.min(...nodes.map((node) => node.x), 0);
  const minY = Math.min(...nodes.map((node) => node.y), 0);
  const shiftX = minX < CANVAS_MARGIN ? CANVAS_MARGIN - minX : 0;
  const shiftY = minY < CANVAS_MARGIN ? CANVAS_MARGIN - minY : 0;
  nodes = nodes.map((node) => ({
    ...node,
    x: node.x + shiftX,
    y: node.y + shiftY,
  }));
  const nodeMap = new Map(nodes.map((node) => [node.key, node]));

  const edges = (ir.edges ?? []).map<LayoutEdge>((edge) => {
    const laidOut = graph.edge({
      v: edge.from,
      w: edge.to,
      name: edge.key,
    }) as { points?: Point[] };
    const points = normalizePoints(
      (laidOut.points ?? []).map((point) => ({
        x: point.x + shiftX,
        y: point.y + shiftY,
      })),
    );
    const from = nodeMap.get(edge.from)!;
    const to = nodeMap.get(edge.to)!;
    const fallback =
      ir.orientation === "LR"
        ? [
            { x: from.x + from.width, y: from.y + from.height / 2 },
            { x: to.x, y: to.y + to.height / 2 },
          ]
        : [
            { x: from.x + from.width / 2, y: from.y + from.height },
            { x: to.x + to.width / 2, y: to.y },
          ];
    const routed = points.length >= 2 ? points : fallback;
    return { ...edge, points: routed, labelPoint: midpoint(routed) };
  });

  const groups = (ir.groups ?? []).map<LayoutGroup>((group) => ({
    ...group,
    ...boundsForMembers(group.members, nodeMap, gaps.group),
  }));

  const allRight = [
    ...nodes.map((node) => node.x + node.width),
    ...groups.map((group) => group.x + group.width),
  ];
  const allBottom = [
    ...nodes.map((node) => node.y + node.height),
    ...groups.map((group) => group.y + group.height),
  ];

  return {
    nodes,
    edges,
    groups,
    width: Math.max(...allRight, 640) + CANVAS_MARGIN,
    height: Math.max(...allBottom, 480) + CANVAS_MARGIN,
  };
}
