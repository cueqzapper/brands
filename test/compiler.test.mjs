import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { compileBrandDNA } from "../src/compiler.mjs";
import { exportBrandYml, exportTokensCss } from "../src/exports.mjs";

const dna = JSON.parse(await readFile(new URL("../examples/seez/brand-dna.json", import.meta.url)));
const fictionalDnas = await Promise.all([
  "rook-and-rye",
  "northline-repair",
  "quiet-current",
].map(async (id) => JSON.parse(await readFile(new URL(`../examples/fictional/${id}/brand-dna.json`, import.meta.url)))));
const catalog = JSON.parse(await readFile(new URL("../examples/catalog.json", import.meta.url)));
const profiles = JSON.parse(await readFile(new URL("../profiles/task-profiles.json", import.meta.url)));
const schema = JSON.parse(await readFile(new URL("../schema/brand-dna.schema.json", import.meta.url)));

test("all examples validate against Brand DNA 1.0", () => {
  const ajv = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  for (const example of [dna, ...fictionalDnas]) {
    assert.equal(validate(example), true, `${example.meta.id}: ${JSON.stringify(validate.errors, null, 2)}`);
  }
});

test("catalog distinguishes the real reference from fictional demos", () => {
  assert.deepEqual(catalog.map(({ id, kind }) => [id, kind]), [
    ["seez", "real-reference"],
    ["rook-and-rye", "fictional-demo"],
    ["northline-repair", "fictional-demo"],
    ["quiet-current", "fictional-demo"],
  ]);
  for (const example of fictionalDnas) {
    assert.match(example.meta.owner, /fictional/i);
    assert.match(example.brand.identity.website, /\.example\/$/);
    assert.doesNotMatch(JSON.stringify(example), /SEEZ|seez\.ch|Systems GmbH/);
  }
});

test("fictional examples compile distinct task packets", () => {
  for (const example of fictionalDnas) {
    for (const profile of ["icon", "linkedin", "photography"]) {
      const packet = compileBrandDNA(example, profiles, { profile, brief: "Produce one fictional demonstration artifact." });
      assert.match(packet.prompt, new RegExp(example.brand.identity.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      assert.ok(packet.prompt.length > 2500, `${example.meta.id}/${profile} prompt is unexpectedly thin`);
    }
  }
});

test("all distributed profiles compile exhaustive packets", () => {
  for (const profile of profiles) {
    const packet = compileBrandDNA(dna, profiles, { profile: profile.id, brief: "Produce one test artifact." });
    assert.equal(packet.profile.id, profile.id);
    assert.ok(packet.prompt.length > 2500, `${profile.id} prompt is unexpectedly thin`);
    assert.match(packet.prompt, /Production checklist/);
    assert.match(packet.prompt, /unresolved decisions/i);
  }
});

test("icon context excludes photography, people, sound and LinkedIn", () => {
  const packet = compileBrandDNA(dna, profiles, { profile: "icon", brief: "A handoff icon." });
  assert.ok(packet.context.visual.iconography);
  assert.equal(packet.context.visual.photography, undefined);
  assert.equal(packet.context.representation, undefined);
  assert.equal(packet.context.sensory, undefined);
  assert.equal(packet.context.channels, undefined);
  assert.doesNotMatch(packet.prompt, /camera height/i);
});

test("photography context contains casting and camera but no LinkedIn cadence", () => {
  const packet = compileBrandDNA(dna, profiles, { profile: "photography", brief: "A workshop portrait." });
  assert.ok(packet.context.visual.photography);
  assert.ok(packet.context.representation.casting);
  assert.equal(packet.context.channels, undefined);
  assert.match(packet.prompt, /lens/i);
  assert.match(packet.prompt, /sensitive/i);
  assert.doesNotMatch(packet.prompt, /Hashtag-Teppich/);
});

test("LinkedIn context contains voice and channel but no camera or sonic rules", () => {
  const packet = compileBrandDNA(dna, profiles, { profile: "linkedin", brief: "Write about a real handoff." });
  assert.ok(packet.context.verbal.voice);
  assert.ok(packet.context.channels.linkedin);
  assert.equal(packet.context.visual.photography, undefined);
  assert.equal(packet.context.sensory, undefined);
  assert.match(packet.prompt, /evidence/i);
});

test("portable exports include core SEEZ tokens", () => {
  const yaml = exportBrandYml(dna);
  assert.match(yaml, /name: "SEEZ"/);
  assert.match(yaml, /mint: "#23EAC3"/);
  assert.match(yaml, /base: "Inter"/);
  const css = exportTokensCss(dna);
  assert.match(css, /--brand-color-mint: #23EAC3/);
  assert.match(css, /--brand-space-24: 96px/);
});
