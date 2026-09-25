import assert from "node:assert/strict";
import test from "node:test";
import { compileScene } from "../src/compile.js";
import { validateIR } from "../src/validate-ir.js";
import { validateScene } from "../src/validate-scene.js";
import { fixtures } from "./family-fixtures.js";

for (const fixture of fixtures) {
  test(`generates valid ${fixture.family} scene`, () => {
    const irValidation = validateIR(fixture);
    assert.equal(
      irValidation.valid,
      true,
      JSON.stringify(irValidation.errors, null, 2),
    );
    const scene = compileScene(fixture);
    const sceneValidation = validateScene(scene, fixture);
    assert.equal(
      sceneValidation.valid,
      true,
      JSON.stringify(sceneValidation.errors, null, 2),
    );
  });
}

test("preserves stable IDs during revision", () => {
  const fixture = fixtures.find((item) => item.family === "architecture")!;
  const original = compileScene(fixture);
  const revised = compileScene(
    {
      ...fixture,
      nodes: fixture.nodes!.map((node) =>
        node.key === "service"
          ? { ...node, label: "Revised application service" }
          : node,
      ),
    },
    original,
  );
  const originalByKey = new Map(
    original.elements.map((element) => [
      element.customData?.semanticKey,
      element.id,
    ]),
  );
  for (const element of revised.elements) {
    assert.equal(
      element.id,
      originalByKey.get(element.customData?.semanticKey),
    );
  }
});

test("rejects an unlabeled flowchart decision", () => {
  const fixture = fixtures.find((item) => item.family === "flowchart")!;
  const invalid = {
    ...fixture,
    edges: fixture.edges!.map((edge) =>
      edge.from === "approved" ? { ...edge, label: "" } : edge,
    ),
  };
  const result = validateIR(invalid);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.code === "unlabeled-decision"));
});

