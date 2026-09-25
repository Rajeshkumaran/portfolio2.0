import { createHash } from "node:crypto";
import type {
  Diagnostic,
  DiagramIR,
  ExcalidrawElement,
  ExcalidrawScene,
  ValidationResult,
} from "./types.js";

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

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

function isFiniteBox(element: ExcalidrawElement): boolean {
  return [element.x, element.y, element.width, element.height].every(
    Number.isFinite,
  );
}

function overlapArea(first: Box, second: Box): number {
  const width =
    Math.min(first.x + first.width, second.x + second.width) -
    Math.max(first.x, second.x);
  const height =
    Math.min(first.y + first.height, second.y + second.height) -
    Math.max(first.y, second.y);
  return Math.max(0, width) * Math.max(0, height);
}

function hexToRgb(color: string): [number, number, number] | undefined {
  const normalized = color.trim().replace(/^#/, "");
  if (!/^[a-f\d]{6}$/i.test(normalized)) {
    return undefined;
  }
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
}

function luminance([red, green, blue]: [number, number, number]): number {
  const channels = [red, green, blue].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  });
  return (
    0.2126 * channels[0]! +
    0.7152 * channels[1]! +
    0.0722 * channels[2]!
  );
}

function contrastRatio(foreground: string, background: string): number {
  const first = hexToRgb(foreground);
  const second = hexToRgb(background);
  if (!first || !second) {
    return Number.POSITIVE_INFINITY;
  }
  const bright = Math.max(luminance(first), luminance(second));
  const dark = Math.min(luminance(first), luminance(second));
  return (bright + 0.05) / (dark + 0.05);
}

function rootKey(element: ExcalidrawElement): string | undefined {
  return element.customData?.semanticKey?.split("--")[0];
}

function expectedSemanticKeys(ir: DiagramIR): string[] {
  if (ir.family === "sequence") {
    return [
      ...(ir.sequence?.participants.map((item) => item.key) ?? []),
      ...(ir.sequence?.messages.map((item) => `${item.key}--edge`) ?? []),
      ...(ir.sequence?.frames ?? []).map((item) => `${item.key}--frame`),
    ];
  }
  return [
    ...(ir.nodes ?? []).map((item) => item.key),
    ...(ir.edges ?? []).map((item) => `${item.key}--edge`),
    ...(ir.groups ?? []).map((item) => `${item.key}--group`),
    ...(ir.annotations ?? []).map((item) => `${item.key}--annotation`),
  ];
}

function textLikelyClipped(element: ExcalidrawElement): boolean {
  const text = typeof element.text === "string" ? element.text : "";
  const fontSize =
    typeof element.fontSize === "number" ? element.fontSize : 20;
  const lines = text.split("\n");
  const requiredHeight = lines.length * fontSize * 1.25;
  const requiredWidth =
    Math.max(...lines.map((line) => line.length), 1) * fontSize * 0.53;
  return requiredHeight > element.height + 3 || requiredWidth > element.width + 8;
}

export function validateScene(
  scene: ExcalidrawScene,
  ir?: DiagramIR,
): ValidationResult {
  const errors: Diagnostic[] = [];
  const warnings: Diagnostic[] = [];

  if (scene.type !== "excalidraw" || scene.version !== 2) {
    errors.push(
      diagnostic(
        "error",
        "invalid-scene-header",
        'Scene must use type "excalidraw" and version 2',
      ),
    );
  }
  if (!Array.isArray(scene.elements)) {
    errors.push(
      diagnostic("error", "invalid-elements", "Scene elements must be an array"),
    );
    return { valid: false, errors, warnings };
  }

  const ids = new Set<string>();
  const semanticKeys = new Set<string>();
  for (const element of scene.elements) {
    const key = element.customData?.semanticKey;
    if (!element.id || ids.has(element.id)) {
      errors.push(
        diagnostic(
          "error",
          "duplicate-element-id",
          `Missing or duplicate element ID: ${element.id}`,
          key,
        ),
      );
    }
    ids.add(element.id);
    if (key) {
      if (semanticKeys.has(key)) {
        errors.push(
          diagnostic(
            "error",
            "duplicate-semantic-key",
            `Duplicate semantic key: ${key}`,
            key,
          ),
        );
      }
      semanticKeys.add(key);
    }
    if (!isFiniteBox(element) || element.width < 0 || element.height < 0) {
      errors.push(
        diagnostic(
          "error",
          "invalid-geometry",
          "Element geometry must be finite and non-negative",
          key,
        ),
      );
    }
    if (element.x < 0 || element.y < 0) {
      errors.push(
        diagnostic(
          "error",
          "off-canvas",
          "Element extends beyond the normalized canvas origin",
          key,
        ),
      );
    }
    if (element.type === "text") {
      const fontSize =
        typeof element.fontSize === "number" ? element.fontSize : 0;
      if (fontSize < 16) {
        errors.push(
          diagnostic(
            "error",
            "unreadable-text",
            `Text is below the 16px minimum: ${fontSize}px`,
            key,
          ),
        );
      }
      if (textLikelyClipped(element)) {
        errors.push(
          diagnostic(
            "error",
            "clipped-text",
            "Text is likely clipped by its element bounds",
            key,
          ),
        );
      }
      const color =
        typeof element.strokeColor === "string"
          ? element.strokeColor
          : "#000000";
      const background =
        typeof scene.appState.viewBackgroundColor === "string"
          ? scene.appState.viewBackgroundColor
          : "#ffffff";
      if (contrastRatio(color, background) < 4.5) {
        errors.push(
          diagnostic(
            "error",
            "low-contrast",
            "Text contrast is below 4.5:1",
            key,
          ),
        );
      }
    }

    for (const bindingName of ["startBinding", "endBinding"] as const) {
      const binding = element[bindingName];
      if (
        binding &&
        typeof binding === "object" &&
        "elementId" in binding &&
        typeof binding.elementId === "string" &&
        !scene.elements.some((candidate) => candidate.id === binding.elementId)
      ) {
        errors.push(
          diagnostic(
            "error",
            "broken-binding",
            `${bindingName} references a missing element`,
            key,
          ),
        );
      }
    }
  }

  const shapes = scene.elements.filter(
    (element) =>
      ["rectangle", "ellipse", "diamond"].includes(element.type) &&
      element.customData?.role === "shape",
  );
  for (let index = 0; index < shapes.length; index += 1) {
    const first = shapes[index]!;
    for (const second of shapes.slice(index + 1)) {
      const area = overlapArea(first, second);
      const smaller = Math.min(
        first.width * first.height,
        second.width * second.height,
      );
      if (smaller > 0 && area / smaller > 0.08) {
        errors.push(
          diagnostic(
            "error",
            "node-overlap",
            `Nodes ${rootKey(first)} and ${rootKey(second)} materially overlap`,
            rootKey(first),
          ),
        );
      }
    }
  }

  if (ir) {
    for (const key of expectedSemanticKeys(ir)) {
      if (!semanticKeys.has(key)) {
        errors.push(
          diagnostic(
            "error",
            "missing-approved-content",
            `Scene is missing approved semantic element ${key}`,
            key,
          ),
        );
      }
    }
  }

  const edgeCount = scene.elements.filter(
    (element) => element.customData?.role === "edge",
  ).length;
  if (edgeCount > 40) {
    warnings.push(
      diagnostic(
        "warning",
        "dense-edges",
        "The scene contains more than 40 relationships",
      ),
    );
  }
  if (
    scene.elements.some((element) => element.customData?.inferred === true)
  ) {
    warnings.push(
      diagnostic(
        "warning",
        "contains-inference",
        "The scene contains approved inferred content",
      ),
    );
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function sceneDigest(scene: ExcalidrawScene): string {
  return createHash("sha256")
    .update(JSON.stringify(scene))
    .digest("hex");
}

