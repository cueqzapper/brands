import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import {
  assertValidBrandDNA,
  BRAND_PROJECT_ARTIFACT_KINDS,
  getByJsonPointer,
  resolveArtifactBindings,
  resolveBrandProjectTokens,
  validateBrandDNA,
} from "../src/index.mjs";

const [brandSchema, projectSchema, brandDna, project] = await Promise.all([
  readFile(new URL("../schema/brand-dna.schema.json", import.meta.url)).then(JSON.parse),
  readFile(new URL("../schema/brand-project.schema.json", import.meta.url)).then(JSON.parse),
  readFile(new URL("../examples/seez/brand-dna.json", import.meta.url)).then(JSON.parse),
  readFile(new URL("../examples/portable-brand-project.json", import.meta.url)).then(JSON.parse),
]);

function validator(schema) {
  const ajv = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true });
  addFormats(ajv);
  return ajv.compile(schema);
}

test("portable Brand Project validates and covers every standard artifact kind", () => {
  const validate = validator(projectSchema);
  assert.equal(validate(project), true, JSON.stringify(validate.errors, null, 2));
  assert.deepEqual(new Set(project.artifacts.map(({ kind }) => kind)), new Set(BRAND_PROJECT_ARTIFACT_KINDS));
});

test("existing Brand DNA stays valid while 1.2 requires a signet, wordmark and lockup", () => {
  const validate = validator(brandSchema);
  assert.equal(validate(brandDna), true, JSON.stringify(validate.errors, null, 2));

  const version12 = structuredClone(brandDna);
  version12.schemaVersion = "1.2.0";
  version12.visual.logo.components = {
    signet: { id: "primary-signet", assetId: "logo-ink", description: "Independent brand signet", use: "Compact marks and icons", status: "approved" },
    wordmark: { id: "primary-wordmark", assetId: "logo-ink", description: "Primary wordmark", use: "Brand naming", status: "approved" },
    lockups: [{ id: "primary-horizontal", assetId: "logo-ink", composition: ["signet", "wordmark"], orientation: "horizontal", use: "Default combined logo", status: "approved" }],
  };
  assert.equal(validate(version12), true, JSON.stringify(validate.errors, null, 2));

  delete version12.visual.logo.components.signet;
  assert.equal(validate(version12), false);
  assert.ok(validate.errors.some(({ instancePath, keyword }) => instancePath.includes("/visual/logo/components") && keyword === "required"));
});

test("public validator returns portable errors and assert helper fails closed", () => {
  assert.deepEqual(validateBrandDNA(brandDna), { valid: true, errors: [] });
  const invalid = structuredClone(brandDna);
  delete invalid.visual.colors.palette[0].meaning;
  const result = validateBrandDNA(invalid);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(({ instancePath, keyword }) => (
    instancePath.includes("/visual/colors/palette/0") && keyword === "required"
  )));
  assert.throws(() => assertValidBrandDNA(invalid), (error) => (
    error.code === "INVALID_BRAND_DNA" && Array.isArray(error.validationErrors)
  ));
});

test("strict manifests reject secret-bearing or undeclared transport fields", () => {
  const validate = validator(projectSchema);
  for (const field of ["accessToken", "apiKey", "signedUrl"]) {
    const unsafe = structuredClone(project);
    unsafe.artifacts[0].editor[field] = "must-not-travel";
    assert.equal(validate(unsafe), false, `${field} unexpectedly passed`);
  }

  const remote = structuredClone(project);
  remote.artifacts[0].document.path = "https://example.com/document.json?token=secret";
  assert.equal(validate(remote), false, "remote or signed URLs must not be portable document paths");

  const traversal = structuredClone(project);
  traversal.artifacts[0].document.path = "../outside/document.json";
  assert.equal(validate(traversal), false, "portable document paths must stay inside their package");
});

test("package exports expose the project runtime", async () => {
  const projectRuntime = await import("@cueqzapper/brands/project");
  const rootRuntime = await import("@cueqzapper/brands");
  assert.equal(projectRuntime.resolveBrandProjectTokens, rootRuntime.resolveBrandProjectTokens);
});

test("tokens and artifact bindings always resolve from the current Brand DNA", () => {
  const changed = structuredClone(brandDna);
  assert.equal(resolveBrandProjectTokens(project, brandDna)["color.primary"], "#23EAC3");
  assert.equal(resolveArtifactBindings(project, "website-main", brandDna)[0].value, "#23EAC3");

  changed.visual.colors.palette[0].hex = "#00FFAA";
  assert.equal(resolveBrandProjectTokens(project, changed)["color.primary"], "#00FFAA");
  assert.equal(resolveArtifactBindings(project, "website-main", changed)[0].value, "#00FFAA");
  assert.equal(resolveArtifactBindings(project, "label-main", changed)[0].value, "#00FFAA");
  assert.equal(resolveArtifactBindings(project, "icon-set-main", changed)[0].value, "#00FFAA");
});

test("JSON Pointer resolves escaped keys and fails closed for missing values", () => {
  assert.equal(getByJsonPointer({ "a/b": { "~key": 7 } }, "/a~1b/~0key"), 7);
  assert.throws(() => getByJsonPointer(brandDna, "/visual/colors/missing"), /no value/);
  assert.throws(() => getByJsonPointer(brandDna, "visual/colors"), /must be empty or start/);
  assert.throws(() => getByJsonPointer(brandDna, "/visual/~2bad"), /Invalid JSON Pointer escape/);
});
