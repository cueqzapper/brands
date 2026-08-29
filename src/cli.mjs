#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { compileBrandDNA } from "./compiler.mjs";
import { exportBrandYml, exportTokensCss } from "./exports.mjs";

const root = new URL("../", import.meta.url);

async function readJson(path) {
  return JSON.parse(await readFile(resolve(path), "utf8"));
}

async function profiles() {
  const [base, german] = await Promise.all([
    readFile(new URL("../profiles/task-profiles.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../profiles/task-profiles.de-CH.json", import.meta.url), "utf8").then(JSON.parse),
  ]);
  return base.map((profile) => ({
    ...profile,
    translations: {
      ...(profile.translations || {}),
      "de-CH": german.find((candidate) => candidate.id === profile.id),
    },
  }));
}

function option(args, name, fallback = "") {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

function usage() {
  return `Brand DNA\n\n` +
    `  brand-dna validate <brand-dna.json>\n` +
    `  brand-dna profiles\n` +
    `  brand-dna compile <brand-dna.json> --for <profile> [--brief <text>] [--locale de-CH] [--json]\n` +
    `  brand-dna export <brand-dna.json> --format brand-yml|tokens-css\n`;
}

async function validate(data) {
  const schema = JSON.parse(await readFile(new URL("../schema/brand-dna.schema.json", import.meta.url), "utf8"));
  const ajv = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true });
  addFormats(ajv);
  const check = ajv.compile(schema);
  return { valid: check(data), errors: check.errors || [] };
}

async function main() {
  const [command, file, ...args] = process.argv.slice(2);
  if (!command || command === "help" || command === "--help") {
    process.stdout.write(usage());
    return;
  }
  if (command === "profiles") {
    for (const profile of await profiles()) process.stdout.write(`${profile.id}\t${profile.label}\n`);
    return;
  }
  if (!file) throw new Error(`Missing Brand DNA file.\n\n${usage()}`);
  const data = await readJson(file);
  if (command === "validate") {
    const result = await validate(data);
    if (!result.valid) {
      process.stderr.write(`${JSON.stringify(result.errors, null, 2)}\n`);
      process.exitCode = 1;
      return;
    }
    process.stdout.write(`${resolve(file)} is valid Brand DNA ${data.schemaVersion}.\n`);
    return;
  }
  if (command === "compile") {
    const packet = compileBrandDNA(data, await profiles(), {
      profile: option(args, "--for", "icon"),
      brief: option(args, "--brief"),
      locale: option(args, "--locale", data.meta?.defaultLocale || "en"),
      detail: option(args, "--detail", "exhaustive"),
    });
    process.stdout.write(args.includes("--json") ? `${JSON.stringify(packet, null, 2)}\n` : `${packet.prompt}\n`);
    return;
  }
  if (command === "export") {
    const format = option(args, "--format", "brand-yml");
    if (format === "brand-yml") process.stdout.write(exportBrandYml(data));
    else if (format === "tokens-css") process.stdout.write(exportTokensCss(data));
    else throw new Error("--format must be brand-yml or tokens-css");
    return;
  }
  throw new Error(`Unknown command '${command}'.\n\n${usage()}`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
