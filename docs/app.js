import { compileBrandDNA } from "./compiler.js?v=1.0.0";

const [catalog, profiles] = await Promise.all([
  fetch("./data/brand-catalog.json").then(assertJsonResponse),
  fetch("./data/task-profiles.json").then(assertJsonResponse),
]);
const library = await Promise.all(catalog.map(async (entry) => ({
  ...entry,
  dna: await fetch(entry.data).then(assertJsonResponse),
})));

function assertJsonResponse(response) {
  if (!response.ok) throw new Error(`Could not load ${response.url}: ${response.status}`);
  return response.json();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function readableInk(hex) {
  const value = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((index) => Number.parseInt(value.slice(index, index + 2), 16) / 255);
  const linear = [r, g, b].map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return (0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]) > 0.46 ? "#151918" : "#ffffff";
}

const contractSections = [
  ["Identity", "Name, essence, promise, worldview and the tensions that make the brand recognisable."],
  ["Strategy", "Purpose, position, offers, audiences, values, messages and proof."],
  ["Language", "Voice dimensions, tone by context, vocabulary, formatting, claims and examples."],
  ["Visual", "Concept, colour, type, logo, grid, shapes, icons, illustration, photography and motion."],
  ["People", "Casting, representation, consent and a strict boundary against sensitive-attribute inference."],
  ["Sensory", "Music, voiceover, sound effects, pacing and deliberate silence."],
  ["Channels", "Different jobs and structures for web, LinkedIn, advertising, video, print and slides."],
  ["Rules", "Accessibility, legal constraints, quality gates, fail conditions and provenance."],
];

const contractGrid = document.querySelector("#contract-grid");
contractSections.forEach(([title, text], index) => {
  const article = document.createElement("article");
  article.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p>`;
  contractGrid.append(article);
});

const brandPicker = document.querySelector("#brand-picker");
for (const [index, entry] of library.entries()) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.brand = entry.id;
  button.className = "brand-choice";
  button.innerHTML = `<span class="choice-index">${String(index + 1).padStart(2, "0")}</span><span><b>${escapeHtml(entry.name)}</b><small>${escapeHtml(entry.description)}</small></span><em class="dataset-badge ${entry.kind}">${escapeHtml(entry.badge)}</em>`;
  brandPicker.append(button);
}

const profileSelect = document.querySelector("#profile");
const profileDescription = document.querySelector("#profile-description");
for (const profile of profiles) {
  const option = document.createElement("option");
  option.value = profile.id;
  option.textContent = profile.label;
  profileSelect.append(option);
}

const requestedBrand = new URL(window.location.href).searchParams.get("brand");
let activeBrand = library.find((entry) => entry.id === requestedBrand) || library[0];
let activePacket;
let didInitialRender = false;

function renderSummary() {
  const dna = activeBrand.dna;
  const identity = dna.brand.identity;
  const essence = dna.brand.essence;
  const palette = dna.visual.colors.palette;
  const openQuestions = dna.provenance.openQuestions;
  const summary = document.querySelector("#brand-summary");
  const swatches = palette.slice(0, 6).map((color) => `
    <div style="--swatch:${escapeHtml(color.hex)};--ink:${readableInk(color.hex)}">
      <span>${escapeHtml(color.name)}</span><code>${escapeHtml(color.hex)}</code>
    </div>`).join("");
  const sample = activeBrand.displaySample.split("\n").map(escapeHtml).join("<br>");
  const legalStatus = identity.legalName || "No legal entity — fictional demonstration dataset";
  const example = dna.verbal.examples.onBrand[1] || dna.verbal.examples.onBrand[0];

  summary.innerHTML = `
    <article class="essence-card">
      <span class="summary-label">Essence</span>
      <h3>${escapeHtml(essence.oneLine)}</h3>
      <p>${escapeHtml(essence.promise)}</p>
      <div class="trait-row">${essence.personality.map((trait) => `<span>${escapeHtml(trait)}</span>`).join("")}</div>
    </article>
    <article class="voice-card">
      <span class="summary-label">Worldview</span>
      <blockquote>${escapeHtml(dna.brand.worldview.belief)}</blockquote>
      <span class="summary-label">Voice</span>
      <p>${dna.verbal.voice.traits.map(escapeHtml).join(" · ")}</p>
      <div class="language-example"><small>On brand</small><strong>${escapeHtml(example)}</strong></div>
    </article>
    <article class="palette-card">
      <span class="summary-label">Colour</span>
      <div class="swatches">${swatches}</div>
    </article>
    <article class="type-card">
      <span class="summary-label">Type system</span>
      <div class="display-type">${sample}</div>
      <p><strong>${escapeHtml(dna.visual.typography.roles.display)}</strong> leads. <strong>${escapeHtml(dna.visual.typography.roles.heading)}</strong> structures. <strong>${escapeHtml(dna.visual.typography.roles.body)}</strong> carries the reading.</p>
    </article>
    <article class="photo-card">
      <span class="summary-label">Photography</span>
      <h3>${escapeHtml(dna.visual.photography.moment)}</h3>
      <p>${escapeHtml(dna.visual.photography.camera)} ${escapeHtml(dna.visual.photography.light)}</p>
      <small>${escapeHtml(dna.representation.sensitiveAttributePolicy)}</small>
    </article>
    <article class="questions-card">
      <span class="summary-label">Open decisions · ${openQuestions.length}</span>
      <ul>${openQuestions.map((question) => `<li><span class="priority ${escapeHtml(question.priority)}">${escapeHtml(question.priority)}</span>${escapeHtml(question.question)}</li>`).join("")}</ul>
      <p class="status-line ${activeBrand.kind}"><span></span>${escapeHtml(legalStatus)}</p>
    </article>`;

  summary.querySelector(".display-type").style.fontFamily = `"${activeBrand.displayFont}", Manrope, sans-serif`;
}

function renderDetails() {
  const dnaDetails = document.querySelector("#dna-details");
  dnaDetails.replaceChildren();
  for (const [key, value] of Object.entries(activeBrand.dna)) {
    if (["$schema", "schemaVersion"].includes(key)) continue;
    const details = document.createElement("details");
    const count = value && typeof value === "object" ? Object.keys(value).length : 1;
    const summary = document.createElement("summary");
    summary.innerHTML = `<span>${escapeHtml(key)}</span><small>${count} section${count === 1 ? "" : "s"}</small><b>+</b>`;
    const pre = document.createElement("pre");
    pre.textContent = JSON.stringify(value, null, 2);
    details.append(summary, pre);
    dnaDetails.append(details);
  }
}

function compile() {
  const profile = profiles.find((candidate) => candidate.id === profileSelect.value);
  profileDescription.textContent = profile.description;
  activePacket = compileBrandDNA(activeBrand.dna, profiles, {
    profile: profile.id,
    brief: document.querySelector("#brief").value.trim(),
    locale: document.querySelector("#locale").value,
  });
  document.querySelector("#prompt code").textContent = activePacket.prompt;
  document.querySelector("#prompt-meta").textContent = `${activeBrand.name} · ${profile.id} · ${activePacket.prompt.length.toLocaleString("en")} characters · ${activePacket.selectedPointers.length} paths`;
  document.querySelector("#selected-paths").innerHTML = `<span>Selected DNA paths</span>${activePacket.selectedPointers.map((path) => `<code>${escapeHtml(path)}</code>`).join("")}`;
}

function activateBrand(id, { resetBrief = true } = {}) {
  activeBrand = library.find((entry) => entry.id === id) || library[0];
  const palette = activeBrand.dna.visual.colors.palette;
  const primary = palette.find((color) => color.role === "primary") || palette[0];
  const surface = palette.find((color) => color.role === "surface") || palette[1] || palette[0];
  const exampleSection = document.querySelector("#example");
  exampleSection.style.setProperty("--demo-accent", primary.hex);
  exampleSection.style.setProperty("--demo-accent-ink", readableInk(primary.hex));
  exampleSection.style.setProperty("--demo-surface", surface.hex);

  for (const button of brandPicker.querySelectorAll("button")) {
    const selected = button.dataset.brand === activeBrand.id;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  }

  const isFictional = activeBrand.kind === "fictional-demo";
  document.querySelector("#example-dataset-note").innerHTML = `
    <span class="dataset-badge ${escapeHtml(activeBrand.kind)}">${escapeHtml(activeBrand.badge)}</span>
    <div><strong>${escapeHtml(activeBrand.name)}</strong><p>${escapeHtml(activeBrand.description)} — ${isFictional ? "Everything in this dataset is invented for demonstration; it describes no real company, person, product, customer or result." : "This is the only real organisation in the library; evidence and unresolved decisions stay explicit."}</p></div>`;
  document.querySelector("#complete-dna-title").textContent = `Inspect ${activeBrand.name}`;
  document.querySelector("#complete-dna-copy").textContent = isFictional
    ? "This is still a complete, schema-valid Brand DNA. Its synthetic provenance prevents invented proof from being mistaken for real evidence."
    : "This complete draft is built from current SEEZ surfaces. Open one section at a time or download the source file.";
  const download = document.querySelector("#download-dna");
  download.href = activeBrand.data;
  download.download = activeBrand.downloadName;
  download.textContent = `Download ${activeBrand.name} Brand DNA`;

  if (resetBrief) {
    document.querySelector("#brief").value = activeBrand.starterBrief;
    profileSelect.value = activeBrand.starterProfile || "photography";
  }
  renderSummary();
  renderDetails();
  compile();

  if (didInitialRender) {
    const url = new URL(window.location.href);
    url.searchParams.set("brand", activeBrand.id);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }
  didInitialRender = true;
}

brandPicker.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-brand]");
  if (button) activateBrand(button.dataset.brand);
});
document.querySelector("#compiler-form").addEventListener("submit", (event) => { event.preventDefault(); compile(); });
profileSelect.addEventListener("change", compile);
document.querySelector("#locale").addEventListener("change", compile);
document.querySelector("#copy-prompt").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  const originalLabel = button.textContent || "Copy";
  try {
    await navigator.clipboard.writeText(activePacket.prompt);
    button.textContent = "Copied";
  } catch {
    const textarea = Object.assign(document.createElement("textarea"), { value: activePacket.prompt, readOnly: true });
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    button.textContent = document.execCommand("copy") ? "Copied" : "Select and copy";
    textarea.remove();
  }
  setTimeout(() => { button.textContent = originalLabel; }, 1200);
});
document.querySelector("#download-prompt").addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([activePacket.prompt], { type: "text/markdown;charset=utf-8" }));
  const anchor = Object.assign(document.createElement("a"), { href: url, download: `${activeBrand.id}-${activePacket.profile.id}-brand-prompt.md` });
  anchor.click();
  URL.revokeObjectURL(url);
});

activateBrand(activeBrand.id, { resetBrief: true });
