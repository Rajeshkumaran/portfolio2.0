import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { compileScene } from "../src/compile.js";
import { renderScene } from "../src/render.js";
import { fixtures } from "./family-fixtures.js";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const goldenPath = resolve(testDirectory, "golden", "flowchart.png");

test("renders a deterministic golden PNG", async () => {
  const temporary = await mkdtemp(join(tmpdir(), "excalidraw-render-test-"));
  try {
    const output = join(temporary, "flowchart.png");
    const fixture = fixtures.find((item) => item.family === "flowchart")!;
    await renderScene(compileScene(fixture), output, 2);
    const actual = await readFile(output);
    if (process.env.UPDATE_GOLDEN === "1") {
      await writeFile(goldenPath, actual);
    }
    const expected = await readFile(goldenPath);
    assert.deepEqual(actual, expected);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

