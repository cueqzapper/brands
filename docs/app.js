import { compileBrandDNA } from "./compiler.js?v=1.0.0";

const [dna, profiles] = await Promise.all([
  fetch("./data/seez-brand-dna.json").then((response) => response.json()),
  fetch("./data/task-profiles.json").then((response) => response.json()),
]);

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
  article.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><h3>${title}</h3><p>${text}</p>`;
  contractGrid.append(article);
});

const brandSummary = document.querySelector("#brand-summary");
const identity = dna.brand.identity;
const essence = dna.brand.essence;
const palette = dna.visual.colors.palette;
const openQuestions = dna.provenance.openQuestions;
brandSummary.innerHTML = `
  <article class="essence-card">
    <span class="summary-label">Essence</span>
    <h3>${essence.oneLine}</h3>
    <p>${essence.promise}</p>
    <div class="trait-row">${essence.personality.map((trait) => `<span>${trait}</span>`).join("")}</div>
  </article>
  <article class="voice-card">
    <span class="summary-label">Worldview</span>
    <blockquote>${dna.brand.worldview.belief}</blockquote>
    <span class="summary-label">Voice</span>
    <p>${dna.verbal.voice.traits.join(" · ")}</p>
    <div class="language-example"><small>On brand</small><strong>${dna.verbal.examples.onBrand[1]}</strong></div>
  </article>
  <article class="palette-card">
    <span class="summary-label">Colour</span>
    <div class="swatches">${palette.slice(0, 6).map((color) => `<div style="--swatch:${color.hex};--ink:${["paper","light-text"].includes(color.id) ? "#1a1a1a" : "#fff"}"><span>${color.name}</span><code>${color.hex}</code></div>`).join("")}</div>
  </article>
  <article class="type-card">
    <span class="summary-label">Type system</span>
    <div class="display-type">WORK<br>IN USE.</div>
    <p><strong>Six Caps</strong> makes the statement. <strong>League Gothic</strong> marks chapters. <strong>Inter</strong> explains the work.</p>
  </article>
  <article class="photo-card">
    <span class="summary-label">Photography</span>
    <h3>${dna.visual.photography.moment}</h3>
    <p>${dna.visual.photography.camera} ${dna.visual.photography.light}</p>
    <small>${dna.representation.sensitiveAttributePolicy}</small>
  </article>
  <article class="questions-card">
    <span class="summary-label">Open decisions · ${openQuestions.length}</span>
    <ul>${openQuestions.map((question) => `<li><span class="priority ${question.priority}">${question.priority}</span>${question.question}</li>`).join("")}</ul>
    <p class="status-line"><span></span>${identity.legalName}</p>
  </article>`;

const dnaDetails = document.querySelector("#dna-details");
for (const [key, value] of Object.entries(dna)) {
  if (["$schema", "schemaVersion"].includes(key)) continue;
  const details = document.createElement("details");
  const count = value && typeof value === "object" ? Object.keys(value).length : 1;
  details.innerHTML = `<summary><span>${key}</span><small>${count} section${count === 1 ? "" : "s"}</small><b>+</b></summary><pre>${JSON.stringify(value, null, 2)}</pre>`;
  dnaDetails.append(details);
}

const profileSelect = document.querySelector("#profile");
const profileDescription = document.querySelector("#profile-description");
for (const profile of profiles) {
  const option = document.createElement("option");
  option.value = profile.id;
  option.textContent = profile.label;
  profileSelect.append(option);
}
profileSelect.value = "photography";

let activePacket;
function compile() {
  const profile = profiles.find((candidate) => candidate.id === profileSelect.value);
  profileDescription.textContent = profile.description;
  activePacket = compileBrandDNA(dna, profiles, {
    profile: profile.id,
    brief: document.querySelector("#brief").value.trim(),
    locale: document.querySelector("#locale").value,
  });
  document.querySelector("#prompt code").textContent = activePacket.prompt;
  document.querySelector("#prompt-meta").textContent = `${profile.id} · ${activePacket.prompt.length.toLocaleString("en")} characters · ${activePacket.selectedPointers.length} paths`;
  document.querySelector("#selected-paths").innerHTML = `<span>Selected DNA paths</span>${activePacket.selectedPointers.map((path) => `<code>${path}</code>`).join("")}`;
}

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
  const anchor = Object.assign(document.createElement("a"), { href: url, download: `seez-${activePacket.profile.id}-brand-prompt.md` });
  anchor.click();
  URL.revokeObjectURL(url);
});
compile();
