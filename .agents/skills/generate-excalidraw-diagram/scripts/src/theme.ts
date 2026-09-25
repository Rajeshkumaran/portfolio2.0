import type { Theme, ThemeInput } from "./types.js";

export const DEFAULT_THEME: Theme = {
  background: "#ffffff",
  accent: "#4f46e5",
  text: "#1f2937",
  muted: "#64748b",
  surface: "#eef2ff",
  surfaceAlt: "#ecfeff",
  boundary: "#94a3b8",
  warning: "#b45309",
  font: "hand",
  density: "comfortable",
  roughness: 1,
};

export function resolveTheme(input: ThemeInput | undefined): Theme {
  return { ...DEFAULT_THEME, ...input };
}

export function fontFamily(theme: Theme): 1 | 2 {
  return theme.font === "hand" ? 1 : 2;
}

export function spacing(theme: Theme): {
  rank: number;
  node: number;
  padding: number;
  group: number;
} {
  if (theme.density === "compact") {
    return { rank: 80, node: 44, padding: 18, group: 28 };
  }
  if (theme.density === "spacious") {
    return { rank: 150, node: 90, padding: 30, group: 50 };
  }
  return { rank: 110, node: 64, padding: 24, group: 36 };
}

