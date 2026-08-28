import { copyFile, mkdir } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const docs = new URL("../docs/", import.meta.url);
await mkdir(new URL("data/", docs), { recursive: true });
await mkdir(new URL("data/brands/", docs), { recursive: true });
await mkdir(new URL("schema/", docs), { recursive: true });
await Promise.all([
  copyFile(new URL("src/compiler.mjs", root), new URL("compiler.js", docs)),
  copyFile(new URL("profiles/task-profiles.json", root), new URL("data/task-profiles.json", docs)),
  copyFile(new URL("examples/catalog.json", root), new URL("data/brand-catalog.json", docs)),
  copyFile(new URL("examples/seez/brand-dna.json", root), new URL("data/brands/seez.json", docs)),
  copyFile(new URL("examples/fictional/rook-and-rye/brand-dna.json", root), new URL("data/brands/rook-and-rye.json", docs)),
  copyFile(new URL("examples/fictional/northline-repair/brand-dna.json", root), new URL("data/brands/northline-repair.json", docs)),
  copyFile(new URL("examples/fictional/quiet-current/brand-dna.json", root), new URL("data/brands/quiet-current.json", docs)),
  copyFile(new URL("schema/brand-dna.schema.json", root), new URL("schema.json", docs)),
  copyFile(new URL("schema/brand-dna.schema.json", root), new URL("schema/brand-dna.schema.json", docs)),
]);
process.stdout.write("GitHub Pages assets built.\n");
