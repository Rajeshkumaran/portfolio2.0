import "@excalidraw/excalidraw/index.css";
import {
  exportToBlob,
  restoreAppState,
  restoreElements,
} from "@excalidraw/excalidraw";

interface BrowserScene {
  elements: readonly Record<string, unknown>[];
  appState: Record<string, unknown>;
  files: Record<string, unknown>;
}

interface BrowserRenderResult {
  base64: string;
  byteLength: number;
}

declare global {
  interface Window {
    renderExcalidrawScene: (
      scene: BrowserScene,
      scale: number,
    ) => Promise<BrowserRenderResult>;
  }
}

window.renderExcalidrawScene = async (scene, scale) => {
  await document.fonts.ready;
  const elements = restoreElements(scene.elements, null, {
    refreshDimensions: true,
    repairBindings: true,
    normalizeIndices: true,
  });
  const appState = restoreAppState(scene.appState, null);
  const blob = await exportToBlob({
    elements,
    appState: {
      ...appState,
      exportBackground: true,
      exportScale: scale,
    },
    files: scene.files,
    mimeType: "image/png",
    getDimensions: (width: number, height: number) => ({
      width: Math.ceil(width * scale),
      height: Math.ceil(height * scale),
      scale,
    }),
  });
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return { base64: btoa(binary), byteLength: bytes.length };
};

