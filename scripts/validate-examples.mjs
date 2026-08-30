import { readdir, readFile } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = new URL("../", import.meta.url);
const schema = JSON.parse(await readFile(new URL("schema/brand-dna.schema.json", root)));
const projectSchema = JSON.parse(await readFile(new URL("schema/brand-project.schema.json", root)));
const ajv = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true });
addFormats(ajv);
const validate = ajv.compile(schema);
const validateProject = ajv.compile(projectSchema);

async function findBrandDNA(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const url = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directory);
    if (entry.isDirectory()) return findBrandDNA(url);
    return entry.name === "brand-dna.json" ? [url] : [];
  }));
  return nested.flat();
}

const files = await findBrandDNA(new URL("examples/", root));
for (const file of files) {
  const dna = JSON.parse(await readFile(file));
  if (!validate(dna)) {
    process.stderr.write(`${file.pathname}\n${JSON.stringify(validate.errors, null, 2)}\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write(`${dna.brand.identity.name}: valid Brand DNA ${dna.schemaVersion}\n`);
  }
}

const project = JSON.parse(await readFile(new URL("examples/portable-brand-project.json", root)));
if (!validateProject(project)) {
  process.stderr.write(`portable-brand-project.json\n${JSON.stringify(validateProject.errors, null, 2)}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`${project.project.name}: valid Brand Project ${project.schemaVersion}\n`);
}

if (!process.exitCode) process.stdout.write(`Validated ${files.length} complete Brand DNA examples and 1 Brand Project.\n`);
