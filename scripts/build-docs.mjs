import { copyFile, cp, mkdir } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const docs = new URL("../docs/", import.meta.url);
await mkdir(new URL("data/", docs), { recursive: true });
await mkdir(new URL("data/brands/", docs), { recursive: true });
await mkdir(new URL("schema/", docs), { recursive: true });
await mkdir(new URL("types/", docs), { recursive: true });
await Promise.all(["seez", "rook-and-rye", "northline-repair", "quiet-current"].map((id) => mkdir(new URL(`data/brands/${id}/`, docs), { recursive: true })));
await Promise.all([
  copyFile(new URL("src/compiler.mjs", root), new URL("compiler.js", docs)),
  copyFile(new URL("profiles/task-profiles.json", root), new URL("data/task-profiles.json", docs)),
  copyFile(new URL("profiles/task-profiles.de-CH.json", root), new URL("data/task-profiles.de-CH.json", docs)),
  copyFile(new URL("examples/catalog.json", root), new URL("data/brand-catalog.json", docs)),
  copyFile(new URL("examples/seez/brand-dna.json", root), new URL("data/brands/seez/brand-dna.json", docs)),
  copyFile(new URL("examples/seez/brand-dna.json", root), new URL("data/brands/seez.json", docs)),
  copyFile(new URL("examples/seez/brand-dna.json", root), new URL("data/seez-brand-dna.json", docs)),
  copyFile(new URL("examples/fictional/rook-and-rye/brand-dna.json", root), new URL("data/brands/rook-and-rye/brand-dna.json", docs)),
  copyFile(new URL("examples/fictional/rook-and-rye/brand-dna.json", root), new URL("data/brands/rook-and-rye.json", docs)),
  copyFile(new URL("examples/fictional/northline-repair/brand-dna.json", root), new URL("data/brands/northline-repair/brand-dna.json", docs)),
  copyFile(new URL("examples/fictional/northline-repair/brand-dna.json", root), new URL("data/brands/northline-repair.json", docs)),
  copyFile(new URL("examples/fictional/quiet-current/brand-dna.json", root), new URL("data/brands/quiet-current/brand-dna.json", docs)),
  copyFile(new URL("examples/fictional/quiet-current/brand-dna.json", root), new URL("data/brands/quiet-current.json", docs)),
  copyFile(new URL("schema/brand-dna.schema.json", root), new URL("schema.json", docs)),
  copyFile(new URL("schema/brand-dna.schema.json", root), new URL("schema/brand-dna.schema.json", docs)),
  copyFile(new URL("schema/brand-project.schema.json", root), new URL("schema/brand-project.schema.json", docs)),
  copyFile(new URL("examples/portable-brand-project.json", root), new URL("data/portable-brand-project.json", docs)),
  copyFile(new URL("types/index.d.ts", root), new URL("types/index.d.ts", docs)),
  cp(new URL("examples/seez/assets/", root), new URL("data/brands/seez/assets/", docs), { recursive: true }),
  cp(new URL("examples/fictional/rook-and-rye/assets/", root), new URL("data/brands/rook-and-rye/assets/", docs), { recursive: true }),
  cp(new URL("examples/fictional/northline-repair/assets/", root), new URL("data/brands/northline-repair/assets/", docs), { recursive: true }),
  cp(new URL("examples/fictional/quiet-current/assets/", root), new URL("data/brands/quiet-current/assets/", docs), { recursive: true }),
]);
process.stdout.write("GitHub Pages assets built.\n");
