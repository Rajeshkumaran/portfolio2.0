#!/usr/bin/env node
import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { compileScene } from "./compile.js";
import {
  readIR,
  readScene,
  requireExtension,
  writeJsonAtomic,
} from "./io.js";
import { renderScene } from "./render.js";
import type { Diagnostic, ValidationResult } from "./types.js";
import { validateIR } from "./validate-ir.js";
import { sceneDigest, validateScene } from "./validate-scene.js";

type Arguments = Record<string, string | boolean>;

function parseArguments(values: string[]): Arguments {
  const parsed: Arguments = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]!;
    if (!value.startsWith("--")) {
      throw new Error(`Unexpected argument: ${value}`);
    }
    const key = value.slice(2);
    const next = values[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}

function required(args: Arguments, name: string): string {
  const value = args[name];
  if (typeof value !== "string" || !value) {
    throw new Error(`Missing required --${name} argument`);
  }
  return value;
}

function optional(args: Arguments, name: string): string | undefined {
  const value = args[name];
  return typeof value === "string" ? value : undefined;
}

function printDiagnostics(result: ValidationResult): void {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

function assertValid(result: ValidationResult, stage: string): void {
  if (!result.valid) {
    const summary = result.errors
      .map((item: Diagnostic) => `[${item.code}] ${item.message}`)
      .join("\n");
    throw new Error(`${stage} failed:\n${summary}`);
  }
}

async function checkRuntime(): Promise<void> {
  const major = Number.parseInt(process.versions.node.split(".")[0]!, 10);
  if (major < 20) {
    throw new Error(`Node.js 20 or newer is required; found ${process.version}`);
  }
  const executable = chromium.executablePath();
  await access(executable);
  process.stdout.write(
    `${JSON.stringify(
      {
        valid: true,
        node: process.version,
        chromium: executable,
        cwd: process.cwd(),
      },
      null,
      2,
    )}\n`,
  );
}

async function validateIRCommand(args: Arguments): Promise<void> {
  const ir = await readIR(required(args, "input"));
  const result = validateIR(ir);
  if (optional(args, "diagnostics")) {
    await writeJsonAtomic(optional(args, "diagnostics")!, result);
  }
  printDiagnostics(result);
  assertValid(result, "IR validation");
}

async function generateCommand(args: Arguments): Promise<void> {
  const input = required(args, "input");
  const output = required(args, "output");
  requireExtension(output, ".excalidraw");
  const ir = await readIR(input);
  const irValidation = validateIR(ir);
  assertValid(irValidation, "IR validation");
  const basePath = optional(args, "base");
  const base = basePath ? await readScene(basePath) : undefined;
  const scene = compileScene(ir, base);
  const sceneValidation = validateScene(scene, ir);
  if (optional(args, "diagnostics")) {
    await writeJsonAtomic(optional(args, "diagnostics")!, {
      ir: irValidation,
      scene: sceneValidation,
    });
  }
  assertValid(sceneValidation, "Scene validation");
  await writeJsonAtomic(output, scene);
  process.stdout.write(
    `${JSON.stringify(
      {
        valid: true,
        output: resolve(output),
        digest: sceneDigest(scene),
        warnings: [...irValidation.warnings, ...sceneValidation.warnings],
      },
      null,
      2,
    )}\n`,
  );
}

async function renderCommand(args: Arguments): Promise<void> {
  const input = required(args, "input");
  const output = required(args, "output");
  requireExtension(output, ".png");
  const scale = Number.parseFloat(optional(args, "scale") ?? "2");
  if (!Number.isFinite(scale) || scale <= 0 || scale > 4) {
    throw new Error("--scale must be greater than 0 and no more than 4");
  }
  const scene = await readScene(input);
  const validation = validateScene(scene);
  assertValid(validation, "Pre-render scene validation");
  const result = await renderScene(scene, output, scale);
  process.stdout.write(
    `${JSON.stringify(
      {
        valid: true,
        input: resolve(input),
        sceneDigest: sceneDigest(scene),
        ...result,
      },
      null,
      2,
    )}\n`,
  );
}

async function validateSceneCommand(args: Arguments): Promise<void> {
  const scene = await readScene(required(args, "input"));
  const irPath = optional(args, "ir");
  const ir = irPath ? await readIR(irPath) : undefined;
  const result = validateScene(scene, ir);
  if (optional(args, "diagnostics")) {
    await writeJsonAtomic(optional(args, "diagnostics")!, result);
  }
  printDiagnostics(result);
  assertValid(result, "Scene validation");
}

function usage(): string {
  return `Usage:
  npm run check
  npm run validate:ir -- --input diagram.ir.json [--diagnostics report.json]
  npm run generate -- --input diagram.ir.json --output diagram.excalidraw [--base existing.excalidraw] [--diagnostics report.json]
  npm run render -- --input diagram.excalidraw --output diagram.png [--scale 2]
  npm run validate:scene -- --input diagram.excalidraw [--ir diagram.ir.json] [--diagnostics report.json]
`;
}

async function main(): Promise<void> {
  const command = process.argv[2];
  const args = parseArguments(process.argv.slice(3));
  switch (command) {
    case "check":
      await checkRuntime();
      break;
    case "validate-ir":
      await validateIRCommand(args);
      break;
    case "generate":
      await generateCommand(args);
      break;
    case "render":
      await renderCommand(args);
      break;
    case "validate-scene":
      await validateSceneCommand(args);
      break;
    default:
      process.stderr.write(usage());
      process.exitCode = 2;
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});

