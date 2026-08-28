function yamlString(value) {
  return JSON.stringify(value ?? "");
}

export function exportBrandYml(dna) {
  const identity = dna.brand?.identity || {};
  const visual = dna.visual || {};
  const colors = visual.colors?.palette || [];
  const type = visual.typography || {};
  const lines = [
    "# Generated from Brand DNA. Review asset paths before use.",
    "meta:",
    `  name: ${yamlString(identity.name)}`,
    `  link: ${yamlString(identity.website)}`,
    "color:",
    "  palette:",
  ];
  for (const color of colors) lines.push(`    ${color.id}: ${yamlString(color.hex)}`);
  const roles = Object.fromEntries(colors.map((color) => [color.role, color.id]));
  if (roles.foreground) lines.push(`  foreground: ${roles.foreground}`);
  if (roles.background) lines.push(`  background: ${roles.background}`);
  if (roles.primary) lines.push(`  primary: ${roles.primary}`);
  lines.push("typography:", "  fonts:");
  for (const font of type.families || []) {
    lines.push(`    - family: ${yamlString(font.family)}`, `      source: ${yamlString(font.source || "file")}`);
  }
  if (type.roles?.body) lines.push(`  base: ${yamlString(type.roles.body)}`);
  if (type.roles?.heading) lines.push("  headings:", `    family: ${yamlString(type.roles.heading)}`);
  if (type.roles?.mono) lines.push(`  monospace: ${yamlString(type.roles.mono)}`);
  return `${lines.join("\n")}\n`;
}

export function exportTokensCss(dna) {
  const colors = dna.visual?.colors?.palette || [];
  const lines = [":root {"];
  for (const color of colors) lines.push(`  --brand-color-${color.id}: ${color.hex};`);
  const spacing = dna.visual?.layout?.spacingScale || {};
  for (const [name, value] of Object.entries(spacing)) lines.push(`  --brand-space-${name}: ${value};`);
  lines.push("}");
  return `${lines.join("\n")}\n`;
}
