export const DIAGRAM_FAMILIES = [
  "architecture",
  "sequence",
  "flowchart",
  "data-model",
  "state-machine",
  "infrastructure",
  "concept-map",
  "freeform",
] as const;

export type DiagramFamily = (typeof DIAGRAM_FAMILIES)[number];
export type Orientation = "TB" | "LR";

export interface ThemeInput {
  mode?: "light";
  background?: string;
  accent?: string;
  text?: string;
  muted?: string;
  surface?: string;
  surfaceAlt?: string;
  boundary?: string;
  warning?: string;
  font?: "hand" | "sans";
  density?: "compact" | "comfortable" | "spacious";
  roughness?: 0 | 1 | 2;
}

export interface AttributeIR {
  name: string;
  type?: string;
  key?: "PK" | "FK" | "UK";
  optional?: boolean;
}

export interface NodeIR {
  key: string;
  label: string;
  kind?: string;
  details?: string[];
  attributes?: AttributeIR[];
  group?: string;
  inferred?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  style?: {
    strokeColor?: string;
    backgroundColor?: string;
    strokeStyle?: "solid" | "dashed" | "dotted";
  };
}

export interface EdgeIR {
  key: string;
  from: string;
  to: string;
  label?: string;
  kind?: string;
  fromCardinality?: string;
  toCardinality?: string;
  inferred?: boolean;
}

export interface GroupIR {
  key: string;
  label: string;
  kind?: string;
  members: string[];
  parent?: string;
  inferred?: boolean;
}

export interface AnnotationIR {
  key: string;
  label: string;
  target?: string;
  kind?: "note" | "warning";
  inferred?: boolean;
}

export interface SequenceParticipantIR {
  key: string;
  label: string;
  inferred?: boolean;
}

export interface SequenceMessageIR {
  key: string;
  from: string;
  to: string;
  label: string;
  kind?: "sync" | "async" | "return";
  activate?: boolean;
  inferred?: boolean;
}

export interface SequenceFrameIR {
  key: string;
  kind: "alt" | "opt" | "loop";
  label: string;
  fromMessage: string;
  toMessage: string;
}

export interface SequenceIR {
  participants: SequenceParticipantIR[];
  messages: SequenceMessageIR[];
  frames?: SequenceFrameIR[];
}

export interface DiagramIR {
  version: 1;
  name: string;
  title?: string;
  family: DiagramFamily;
  orientation?: Orientation;
  theme?: ThemeInput;
  nodes?: NodeIR[];
  edges?: EdgeIR[];
  groups?: GroupIR[];
  annotations?: AnnotationIR[];
  sequence?: SequenceIR;
  preserveUnmentioned?: boolean;
}

export interface Theme {
  background: string;
  accent: string;
  text: string;
  muted: string;
  surface: string;
  surfaceAlt: string;
  boundary: string;
  warning: string;
  font: "hand" | "sans";
  density: "compact" | "comfortable" | "spacious";
  roughness: 0 | 1 | 2;
}

export interface Point {
  x: number;
  y: number;
}

export interface LayoutNode extends NodeIR {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutEdge extends EdgeIR {
  points: Point[];
  labelPoint: Point;
}

export interface LayoutGroup extends GroupIR {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutResult {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  groups: LayoutGroup[];
  width: number;
  height: number;
}

export type ExcalidrawElement = Record<string, unknown> & {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  customData?: {
    semanticKey?: string;
    role?: string;
    inferred?: boolean;
    source?: string[];
  };
};

export interface ExcalidrawScene {
  type: "excalidraw";
  version: 2;
  source: string;
  elements: ExcalidrawElement[];
  appState: Record<string, unknown>;
  files: Record<string, unknown>;
}

export type DiagnosticSeverity = "error" | "warning";

export interface Diagnostic {
  severity: DiagnosticSeverity;
  code: string;
  message: string;
  semanticKey?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Diagnostic[];
  warnings: Diagnostic[];
}

