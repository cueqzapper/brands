export const BRAND_PROJECT_ARTIFACT_KINDS = Object.freeze([
  "website",
  "business-card",
  "label",
  "social",
  "icon-set",
  "backgrounds",
  "photography",
  "decorative",
]);

export const BRAND_PROJECT_READINESS_STATES = Object.freeze([
  "planned",
  "draft",
  "review",
  "ready",
  "blocked",
  "deprecated",
]);

export const BRAND_PROJECT_DELIVERY_STATES = Object.freeze([
  "not-requested",
  "prepared",
  "delivered",
  "accepted",
  "rejected",
]);

function decodePointerSegment(segment) {
  if (/~(?:[^01]|$)/.test(segment)) throw new TypeError(`Invalid JSON Pointer escape in segment: ${segment}`);
  return segment.replaceAll("~1", "/").replaceAll("~0", "~");
}

export function getByJsonPointer(document, pointer) {
  if (pointer === "") return document;
  if (typeof pointer !== "string" || !pointer.startsWith("/")) {
    throw new TypeError(`JSON Pointer must be empty or start with "/": ${String(pointer)}`);
  }

  let current = document;
  for (const rawSegment of pointer.slice(1).split("/")) {
    const segment = decodePointerSegment(rawSegment);
    if (current === null || typeof current !== "object" || !Object.hasOwn(current, segment)) {
      throw new ReferenceError(`Brand DNA has no value at JSON Pointer ${pointer}`);
    }
    current = current[segment];
  }
  return current;
}

export function resolveBrandProjectTokens(project, brandDna) {
  return Object.fromEntries(Object.entries(project.tokens).map(([name, binding]) => [
    name,
    getByJsonPointer(brandDna, binding.source.pointer),
  ]));
}

export function resolveArtifactBindings(project, artifactId, brandDna) {
  const artifact = project.artifacts.find((candidate) => candidate.id === artifactId);
  if (!artifact) throw new ReferenceError(`Brand Project has no artifact with id ${artifactId}`);
  return artifact.bindings.map((binding) => ({
    target: binding.target,
    source: binding.source,
    mode: binding.mode,
    required: binding.required,
    value: getByJsonPointer(brandDna, binding.source.pointer),
  }));
}
