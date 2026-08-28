const DEFAULT_DETAIL = "exhaustive";

const LABELS = {
  brand: "Brand identity",
  strategy: "Strategy and meaning",
  verbal: "Verbal identity",
  visual: "Visual identity",
  representation: "People and representation",
  sensory: "Sound, music and voice",
  channels: "Channel behaviour",
  rules: "Universal rules",
  provenance: "Evidence and open decisions",
  assets: "Production assets",
  logos: "Approved logo assets",
  icons: "Approved icon assets",
  textures: "Approved textures",
  illustrations: "Approved illustrations",
  templates: "Production templates",
  identity: "Core identity",
  essence: "Essence",
  worldview: "Worldview and ideology",
  positioning: "Positioning",
  audiences: "Audiences",
  values: "Values in behaviour",
  messaging: "Messaging system",
  voice: "Voice",
  language: "Language rules",
  claims: "Claims and proof",
  logo: "Logo system",
  colors: "Colour system",
  typography: "Typography",
  layout: "Layout and composition",
  shapes: "Shape grammar",
  iconography: "Iconography",
  illustration: "Illustration",
  photography: "Photography",
  motion: "Motion",
  linkedin: "LinkedIn",
  video: "Video",
  brochure: "Brochure and print",
  advertising: "Advertising",
  presentations: "Presentations",
  website: "Website",
  universal: "Non-negotiable rules",
  accessibility: "Accessibility",
  legal: "Legal and rights",
  quality: "Quality gates",
  openQuestions: "Open questions",
};

function pointerParts(pointer) {
  if (!pointer || pointer === "/") return [];
  return pointer
    .split("/")
    .slice(1)
    .map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~"));
}

function readPointer(source, pointer) {
  let value = source;
  for (const part of pointerParts(pointer)) {
    if (value === null || typeof value !== "object" || !(part in value)) {
      return undefined;
    }
    value = value[part];
  }
  return value;
}

function writePointer(target, pointer, value) {
  const parts = pointerParts(pointer);
  if (!parts.length) return value;
  let cursor = target;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
    cursor = cursor[part];
  }
  cursor[parts.at(-1)] = structuredClone(value);
  return target;
}

export function selectBrandContext(brandDna, profile) {
  if (!brandDna || typeof brandDna !== "object") {
    throw new TypeError("brandDna must be an object");
  }
  if (!profile || !Array.isArray(profile.selectors)) {
    throw new TypeError("profile.selectors must be an array of JSON Pointers");
  }
  let selected = {};
  for (const pointer of profile.selectors) {
    const value = readPointer(brandDna, pointer);
    if (value !== undefined) selected = writePointer(selected, pointer, value);
  }
  return selected;
}

function humanize(key) {
  if (LABELS[key]) return LABELS[key];
  return String(key)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (character) => character.toUpperCase());
}

function renderScalar(value) {
  if (typeof value === "boolean") return value ? "yes" : "no";
  if (value === null || value === undefined || value === "") return "not specified";
  return String(value);
}

function renderValue(value, level = 3) {
  if (Array.isArray(value)) {
    if (!value.length) return "- not specified";
    return value
      .map((item) => {
        if (item && typeof item === "object") {
          return `- ${Object.entries(item)
            .map(([key, nested]) => {
              if (Array.isArray(nested)) return `${humanize(key)}: ${nested.map(renderScalar).join("; ")}`;
              if (nested && typeof nested === "object") return `${humanize(key)}: ${JSON.stringify(nested)}`;
              return `${humanize(key)}: ${renderScalar(nested)}`;
            })
            .join(" | ")}`;
        }
        return `- ${renderScalar(item)}`;
      })
      .join("\n");
  }
  if (value && typeof value === "object") {
    const blocks = [];
    for (const [key, nested] of Object.entries(value)) {
      const heading = "#".repeat(Math.min(level, 6));
      if (nested && typeof nested === "object") {
        blocks.push(`${heading} ${humanize(key)}\n\n${renderValue(nested, level + 1)}`);
      } else {
        blocks.push(`- **${humanize(key)}:** ${renderScalar(nested)}`);
      }
    }
    return blocks.join("\n\n");
  }
  return renderScalar(value);
}

export function renderPromptPacket(packet) {
  const { profile, brief, locale, detail, brandName, context } = packet;
  const checklist = profile.productionChecklist.map((item) => `- [ ] ${item}`).join("\n");
  const outputs = profile.outputContract.map((item) => `- ${item}`).join("\n");
  const contextBlocks = Object.entries(context)
    .map(([key, value]) => `## ${humanize(key)}\n\n${renderValue(value, 3)}`)
    .join("\n\n");

  return `# Brand production brief: ${profile.label}\n\n` +
    `You are producing a ${profile.label.toLowerCase()} for **${brandName}**. ` +
    `Treat the Brand DNA below as the authoritative creative context for this task. ` +
    `Follow explicit rules before inferred preferences. Never turn an inference into a public fact.\n\n` +
    `## Task\n\n${brief || "No additional brief was supplied. Define the smallest useful deliverable that satisfies this profile."}\n\n` +
    `- **Output language:** ${locale}\n` +
    `- **Detail level:** ${detail}\n` +
    `- **Profile id:** ${profile.id}\n\n` +
    `## Working method\n\n` +
    `1. Resolve the communicative job before choosing style.\n` +
    `2. Use only the Brand DNA sections included below; missing information is an open decision, not permission to invent.\n` +
    `3. Make every visual, verbal and technical choice traceable to a supplied rule, value, audience need or channel constraint.\n` +
    `4. Keep verified facts, creative direction and hypotheses visibly separate.\n` +
    `5. Check the finished work against every production and quality item before returning it.\n\n` +
    `## Selected Brand DNA\n\n${contextBlocks}\n\n` +
    `## Profile-specific production direction\n\n${profile.instructions.map((item) => `- ${item}`).join("\n")}\n\n` +
    `## Production checklist\n\n${checklist}\n\n` +
    `## Required response\n\n${outputs}\n\n` +
    `Return the finished production-ready result first, followed by a short compliance note that names unresolved decisions. ` +
    `Do not repeat the entire Brand DNA and do not pad the answer with generic branding advice.`;
}

export function compileBrandDNAWithProfile(brandDna, profile, options = {}) {
  const detail = options.detail || DEFAULT_DETAIL;
  const locale = options.locale || brandDna?.meta?.defaultLocale || "en";
  const brandName = brandDna?.brand?.identity?.name || "Unnamed brand";
  const context = selectBrandContext(brandDna, profile);
  const packet = {
    schemaVersion: brandDna.schemaVersion,
    compiledAt: new Date().toISOString(),
    profile: structuredClone(profile),
    brandName,
    brief: options.brief || "",
    locale,
    detail,
    selectedPointers: [...profile.selectors],
    context,
  };
  packet.prompt = renderPromptPacket(packet);
  return packet;
}

export function compileBrandDNA(brandDna, profiles, options = {}) {
  const profileId = options.profile || "icon";
  const profile = profiles.find((candidate) => candidate.id === profileId);
  if (!profile) {
    throw new RangeError(`Unknown profile '${profileId}'. Available: ${profiles.map(({ id }) => id).join(", ")}`);
  }
  return compileBrandDNAWithProfile(brandDna, profile, options);
}
