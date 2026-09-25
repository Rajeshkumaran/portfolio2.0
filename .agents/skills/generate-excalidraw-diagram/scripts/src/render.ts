import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { chromium } from "playwright";
import { writeBufferAtomic } from "./io.js";
import type { ExcalidrawScene } from "./types.js";

export interface RenderResult {
  output: string;
  byteLength: number;
  scale: number;
}

async function bundleRenderer(directory: string): Promise<{
  javascript: string;
  css: string;
}> {
  const source = resolve(
    fileURLToPath(new URL(".", import.meta.url)),
    "browser-renderer.ts",
  );
  await build({
    entryPoints: [source],
    bundle: true,
    platform: "browser",
    format: "iife",
    target: ["chrome120"],
    conditions: ["production", "browser", "default"],
    outdir: directory,
    entryNames: "renderer",
    assetNames: "assets/[name]-[hash]",
    loader: {
      ".woff": "dataurl",
      ".woff2": "dataurl",
      ".ttf": "dataurl",
      ".svg": "dataurl",
      ".png": "dataurl",
    },
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    logLevel: "silent",
  });
  const javascript = await readFile(join(directory, "renderer.js"), "utf8");
  let css = "";
  try {
    css = await readFile(join(directory, "renderer.css"), "utf8");
  } catch {
    // The package version may inline all required styles.
  }
  return { javascript, css };
}

export async function renderScene(
  scene: ExcalidrawScene,
  output: string,
  scale = 2,
): Promise<RenderResult> {
  const temporary = await mkdtemp(join(tmpdir(), "excalidraw-skill-"));
  try {
    const bundle = await bundleRenderer(temporary);
    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage({
        viewport: { width: 1600, height: 1200 },
        deviceScaleFactor: 1,
      });
      await page.setContent(
        "<!doctype html><html><head></head><body></body></html>",
      );
      if (bundle.css) {
        await page.addStyleTag({ content: bundle.css });
      }
      await page.addScriptTag({ content: bundle.javascript });
      const result = await page.evaluate(
        async ({ payload, exportScale }) =>
          window.renderExcalidrawScene(payload, exportScale),
        { payload: scene, exportScale: scale },
      );
      const bytes = Buffer.from(result.base64, "base64");
      if (bytes.length !== result.byteLength || bytes.length < 100) {
        throw new Error("Renderer returned an invalid PNG payload");
      }
      await writeBufferAtomic(output, bytes);
      return { output: resolve(output), byteLength: bytes.length, scale };
    } finally {
      await browser.close();
    }
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}
