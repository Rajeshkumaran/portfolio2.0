import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import type { DiagramIR, ExcalidrawScene } from "./types.js";

export async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(resolve(path), "utf8")) as T;
}

export async function readIR(path: string): Promise<DiagramIR> {
  return readJson<DiagramIR>(path);
}

export async function readScene(path: string): Promise<ExcalidrawScene> {
  return readJson<ExcalidrawScene>(path);
}

export async function writeJsonAtomic(
  path: string,
  value: unknown,
): Promise<void> {
  const absolute = resolve(path);
  await mkdir(dirname(absolute), { recursive: true });
  const temporary = `${absolute}.tmp-${process.pid}-${Date.now()}`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, absolute);
}

export async function writeBufferAtomic(
  path: string,
  value: Buffer,
): Promise<void> {
  const absolute = resolve(path);
  await mkdir(dirname(absolute), { recursive: true });
  const temporary = `${absolute}.tmp-${process.pid}-${Date.now()}`;
  await writeFile(temporary, value);
  await rename(temporary, absolute);
}

export function requireExtension(path: string, extension: string): void {
  if (extname(path).toLowerCase() !== extension) {
    throw new Error(`Expected ${extension} output path: ${path}`);
  }
}

