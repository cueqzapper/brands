import { copyFile, mkdir } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const docs = new URL("../docs/", import.meta.url);
await mkdir(new URL("data/", docs), { recursive: true });
await Promise.all([
  copyFile(new URL("src/compiler.mjs", root), new URL("compiler.js", docs)),
  copyFile(new URL("profiles/task-profiles.json", root), new URL("data/task-profiles.json", docs)),
  copyFile(new URL("examples/seez/brand-dna.json", root), new URL("data/seez-brand-dna.json", docs)),
  copyFile(new URL("schema/brand-dna.schema.json", root), new URL("schema.json", docs)),
]);
process.stdout.write("GitHub Pages assets built.\n");
