import { compileBrandDNA } from "./compiler.js?v=1.1.1";

const [catalog, baseProfiles, germanProfiles] = await Promise.all([
  fetch("./data/brand-catalog.json").then(assertJsonResponse),
  fetch("./data/task-profiles.json").then(assertJsonResponse),
  fetch("./data/task-profiles.de-CH.json").then(assertJsonResponse),
]);
const profiles = baseProfiles.map((profile) => ({
  ...profile,
  translations: {
    ...(profile.translations || {}),
    "de-CH": germanProfiles.find((candidate) => candidate.id === profile.id),
  },
}));
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

const LOCALE_NAMES = {
  "de-CH": "Deutsch (CH)",
  en: "English",
  "fr-CH": "Français (CH)",
  "it-CH": "Italiano (CH)",
};

const UI_COPY = {
  en: {
    referenceLibrary: "Reference library",
    libraryTitle: "Four brands. One shared contract.",
    libraryIntro: "SEEZ is the real reference. The bakery, repair workshop and sound studio are deliberately invented to show how the same schema behaves in completely different kinds of work.",
    realEvidence: "This is the only real organisation in the library; evidence and unresolved decisions stay explicit.",
    fictionalEvidence: "Everything in this dataset is invented for demonstration; it describes no real company, person, product, customer or result.",
    essence: "Essence",
    worldview: "Worldview",
    voice: "Voice",
    onBrand: "On brand",
    colour: "Colour",
    typeSystem: "Type system",
    typeSentence: (display, heading, body) => `<strong>${escapeHtml(display)}</strong> leads. <strong>${escapeHtml(heading)}</strong> structures. <strong>${escapeHtml(body)}</strong> carries the reading.`,
    photography: "Photography",
    openDecisions: "Open decisions",
    noLegalEntity: "No legal entity — fictional demonstration dataset",
    assetEyebrow: "Physical asset library",
    assetTitle: "The files behind the rules.",
    assetCount: (count) => `${count} downloadable production assets · rights stay explicit in the DNA`,
    assetGroups: { logos: "Logo masters", photography: "Photography", icons: "Icon family", illustrations: "Illustrations", textures: "Textures" },
    download: "Download file ↓",
    approved: "approved",
    completeObject: "Complete object",
    inspect: (name) => `Inspect ${name}`,
    completeFictional: "This is still a complete, schema-valid Brand DNA. Its synthetic provenance prevents invented proof from being mistaken for real evidence.",
    completeReal: "This complete draft is built from current SEEZ surfaces. Open one section at a time or download the source file.",
    section: "section",
    sections: "sections",
    downloadDna: (name) => `Download ${name} Brand DNA`,
    promptCompiler: "Prompt compiler",
    compilerTitle: "Ask for one thing. Get exactly its brand context.",
    compilerIntro: "The prompt is exhaustive inside the chosen scope. Try the same brief as an icon, LinkedIn post or photograph and inspect which DNA paths were selected.",
    target: "Production target",
    brief: "What should be made?",
    language: "Language",
    compile: "Compile context",
    compiled: "Compiled prompt",
    waiting: "Waiting for profile",
    copy: "Copy",
    copied: "Copied",
    copyFallback: "Select and copy",
    downloadPrompt: "Download",
    selectedPaths: "Selected DNA paths",
    characters: "characters",
    paths: "paths",
  },
  de: {
    referenceLibrary: "Referenzbibliothek",
    libraryTitle: "Vier Marken. Ein gemeinsamer Vertrag.",
    libraryIntro: "SEEZ ist die reale Referenz. Bäckerei, Reparaturwerkstatt und Tonstudio sind bewusst erfunden. So wird sichtbar, wie dasselbe Schema in ganz unterschiedlicher Arbeit funktioniert.",
    realEvidence: "Dies ist die einzige reale Organisation in der Bibliothek. Belege und offene Entscheide bleiben sichtbar.",
    fictionalEvidence: "Alle Angaben in diesem Datensatz sind für das Beispiel erfunden. Sie beschreiben kein reales Unternehmen, keine Person, kein Produkt, keinen Kunden und kein Ergebnis.",
    essence: "Markenkern",
    worldview: "Haltung",
    voice: "Stimme",
    onBrand: "Passt zur Marke",
    colour: "Farben",
    typeSystem: "Schriftsystem",
    typeSentence: (display, heading, body) => `<strong>${escapeHtml(display)}</strong> führt. <strong>${escapeHtml(heading)}</strong> gliedert. <strong>${escapeHtml(body)}</strong> trägt den Lesetext.`,
    photography: "Fotografie",
    openDecisions: "Offene Entscheide",
    noLegalEntity: "Keine reale Rechtseinheit — erfundener Beispieldatensatz",
    assetEyebrow: "Produktionsdateien",
    assetTitle: "Die Dateien hinter den Regeln.",
    assetCount: (count) => `${count} Dateien zum Herunterladen · die Nutzungsrechte bleiben in der Brand DNA sichtbar`,
    assetGroups: { logos: "Logo-Master", photography: "Fotografie", icons: "Icon-Familie", illustrations: "Illustrationen", textures: "Texturen" },
    download: "Datei herunterladen ↓",
    approved: "freigegeben",
    completeObject: "Vollständiges Objekt",
    inspect: (name) => `${name} vollständig anschauen`,
    completeFictional: "Auch dieses erfundene Beispiel ist eine vollständige, schema-konforme Brand DNA. Die klar markierte Herkunft verhindert, dass erfundene Belege als reale Fakten erscheinen.",
    completeReal: "Dieser vollständige Entwurf stammt aus den aktuellen SEEZ-Oberflächen. Öffne einzelne Bereiche oder lade die Quelldatei herunter.",
    section: "Bereich",
    sections: "Bereiche",
    downloadDna: (name) => `${name} Brand DNA herunterladen`,
    promptCompiler: "Prompt-Compiler",
    compilerTitle: "Eine Aufgabe. Genau der Markenkontext, den sie braucht.",
    compilerIntro: "Der Prompt ist innerhalb des gewählten Bereichs ausführlich. Vergleiche denselben Auftrag als Icon, LinkedIn-Beitrag oder Foto und prüfe, welche DNA-Pfade ausgewählt werden.",
    target: "Produktionsziel",
    brief: "Was soll entstehen?",
    language: "Ausgabesprache",
    compile: "Kontext zusammenstellen",
    compiled: "Zusammengestellter Prompt",
    waiting: "Warte auf ein Profil",
    copy: "Kopieren",
    copied: "Kopiert",
    copyFallback: "Markieren und kopieren",
    downloadPrompt: "Herunterladen",
    selectedPaths: "Ausgewählte DNA-Pfade",
    characters: "Zeichen",
    paths: "Pfade",
  },
};

function uiLanguage(locale = "en") {
  return String(locale).toLowerCase().startsWith("de") ? "de" : "en";
}

function ui() {
  return UI_COPY[uiLanguage(activeBrand?.dna?.meta?.defaultLocale)] || UI_COPY.en;
}

function localizedProfile(profile, locale) {
  const translation = profile.translations?.[locale] || profile.translations?.[uiLanguage(locale)];
  return translation ? { ...profile, ...translation } : profile;
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

const requestedBrand = new URL(window.location.href).searchParams.get("brand");
let activeBrand = library.find((entry) => entry.id === requestedBrand) || library[0];
let activePacket;
let didInitialRender = false;

function renderSummary() {
  const copy = ui();
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
  const legalStatus = identity.legalName || copy.noLegalEntity;
  const example = dna.verbal.examples.onBrand[1] || dna.verbal.examples.onBrand[0];

  summary.innerHTML = `
    <article class="essence-card">
      <span class="summary-label">${copy.essence}</span>
      <h3>${escapeHtml(essence.oneLine)}</h3>
      <p>${escapeHtml(essence.promise)}</p>
      <div class="trait-row">${essence.personality.map((trait) => `<span>${escapeHtml(trait)}</span>`).join("")}</div>
    </article>
    <article class="voice-card">
      <span class="summary-label">${copy.worldview}</span>
      <blockquote>${escapeHtml(dna.brand.worldview.belief)}</blockquote>
      <span class="summary-label">${copy.voice}</span>
      <p>${dna.verbal.voice.traits.map(escapeHtml).join(" · ")}</p>
      <div class="language-example"><small>${copy.onBrand}</small><strong>${escapeHtml(example)}</strong></div>
    </article>
    <article class="palette-card">
      <span class="summary-label">${copy.colour}</span>
      <div class="swatches">${swatches}</div>
    </article>
    <article class="type-card">
      <span class="summary-label">${copy.typeSystem}</span>
      <div class="display-type">${sample}</div>
      <p>${copy.typeSentence(dna.visual.typography.roles.display, dna.visual.typography.roles.heading, dna.visual.typography.roles.body)}</p>
    </article>
    <article class="photo-card">
      <span class="summary-label">${copy.photography}</span>
      <h3>${escapeHtml(dna.visual.photography.moment)}</h3>
      <p>${escapeHtml(dna.visual.photography.camera)} ${escapeHtml(dna.visual.photography.light)}</p>
      <small>${escapeHtml(dna.representation.sensitiveAttributePolicy)}</small>
    </article>
    <article class="questions-card">
      <span class="summary-label">${copy.openDecisions} · ${openQuestions.length}</span>
      <ul>${openQuestions.map((question) => `<li><span class="priority ${escapeHtml(question.priority)}">${escapeHtml(question.priority)}</span>${escapeHtml(question.question)}</li>`).join("")}</ul>
      <p class="status-line ${activeBrand.kind}"><span></span>${escapeHtml(legalStatus)}</p>
    </article>`;

  summary.querySelector(".display-type").style.fontFamily = `"${activeBrand.displayFont}", Manrope, sans-serif`;
}

function resolveAssetUrl(asset) {
  const dataUrl = new URL(activeBrand.data, window.location.href);
  return new URL(`${activeBrand.dna.assets?.basePath || "./assets/"}${asset.path}`, dataUrl).href;
}

function renderAssets() {
  const copy = ui();
  const assets = activeBrand.dna.assets || {};
  const groups = [
    ["logos", copy.assetGroups.logos],
    ["photography", copy.assetGroups.photography],
    ["icons", copy.assetGroups.icons],
    ["illustrations", copy.assetGroups.illustrations],
    ["textures", copy.assetGroups.textures],
  ].filter(([key]) => Array.isArray(assets[key]) && assets[key].length);
  const count = groups.reduce((total, [key]) => total + assets[key].length, 0);
  document.querySelector("#asset-count").textContent = copy.assetCount(count);
  document.querySelector("#asset-gallery").innerHTML = groups.map(([key, label]) => `
    <section class="asset-group asset-group-${escapeHtml(key)}">
      <header><span>${escapeHtml(label)}</span><small>${assets[key].length}</small></header>
      <div class="asset-grid">${assets[key].map((asset) => {
        const url = resolveAssetUrl(asset);
        return `<article class="asset-card asset-${escapeHtml(asset.kind)}">
          <a class="asset-preview" href="${escapeHtml(url)}" download aria-label="${escapeHtml(copy.download)} ${escapeHtml(asset.role)}">
            <img src="${escapeHtml(url)}" alt="${escapeHtml(asset.alt)}" loading="lazy">
          </a>
          <div class="asset-copy"><span>${escapeHtml(asset.kind)}</span><strong>${escapeHtml(asset.role)}</strong><p>${escapeHtml(asset.description)}</p><small>${escapeHtml(asset.mediaType)} · ${escapeHtml(asset.status === "approved" ? copy.approved : asset.status)}</small><a href="${escapeHtml(url)}" download>${copy.download}</a></div>
        </article>`;
      }).join("")}</div>
    </section>`).join("");
}

function renderDetails() {
  const copy = ui();
  const dnaDetails = document.querySelector("#dna-details");
  dnaDetails.replaceChildren();
  for (const [key, value] of Object.entries(activeBrand.dna)) {
    if (["$schema", "schemaVersion"].includes(key)) continue;
    const details = document.createElement("details");
    const count = value && typeof value === "object" ? Object.keys(value).length : 1;
    const summary = document.createElement("summary");
    summary.innerHTML = `<span>${escapeHtml(key)}</span><small>${count} ${count === 1 ? copy.section : copy.sections}</small><b>+</b>`;
    const pre = document.createElement("pre");
    pre.textContent = JSON.stringify(value, null, 2);
    details.append(summary, pre);
    dnaDetails.append(details);
  }
}

function compile() {
  const profile = profiles.find((candidate) => candidate.id === profileSelect.value);
  const selectedLocale = document.querySelector("#locale").value;
  const displayedProfile = localizedProfile(profile, selectedLocale);
  profileDescription.textContent = displayedProfile.description;
  activePacket = compileBrandDNA(activeBrand.dna, profiles, {
    profile: profile.id,
    brief: document.querySelector("#brief").value.trim(),
    locale: selectedLocale,
  });
  document.querySelector("#prompt code").textContent = activePacket.prompt;
  const copy = ui();
  document.querySelector("#prompt-meta").textContent = `${activeBrand.name} · ${profile.id} · ${activePacket.prompt.length.toLocaleString(activePacket.locale)} ${copy.characters} · ${activePacket.selectedPointers.length} ${copy.paths}`;
  document.querySelector("#selected-paths").innerHTML = `<span>${copy.selectedPaths}</span>${activePacket.selectedPointers.map((path) => `<code>${escapeHtml(path)}</code>`).join("")}`;
}

function renderProfileOptions(selectedId) {
  const locale = document.querySelector("#locale").value || activeBrand.dna.meta.defaultLocale;
  profileSelect.replaceChildren();
  for (const profile of profiles) {
    const option = document.createElement("option");
    option.value = profile.id;
    option.textContent = localizedProfile(profile, locale).label;
    profileSelect.append(option);
  }
  profileSelect.value = selectedId || activeBrand.starterProfile || "photography";
}

function renderLocaleOptions(preferredLocale) {
  const select = document.querySelector("#locale");
  const locales = activeBrand.dna.meta.locales?.length ? activeBrand.dna.meta.locales : [activeBrand.dna.meta.defaultLocale || "en"];
  select.replaceChildren(...locales.map((locale) => {
    const option = document.createElement("option");
    option.value = locale;
    option.textContent = LOCALE_NAMES[locale] || locale;
    return option;
  }));
  select.value = locales.includes(preferredLocale) ? preferredLocale : activeBrand.dna.meta.defaultLocale;
}

function renderKitShell() {
  const copy = ui();
  document.documentElement.lang = activeBrand.dna.meta.defaultLocale;
  const exampleHeader = document.querySelector("#example .section-head");
  exampleHeader.querySelector(".eyebrow").textContent = copy.referenceLibrary;
  exampleHeader.querySelector("h2").textContent = copy.libraryTitle;
  exampleHeader.querySelector(":scope > p").textContent = copy.libraryIntro;
  document.querySelector("#asset-library-title").textContent = copy.assetTitle;
  document.querySelector("#asset-library-title").previousElementSibling.textContent = copy.assetEyebrow;
  const complete = document.querySelector(".complete-dna > div:first-child");
  complete.querySelector(".eyebrow").textContent = copy.completeObject;
  const compilerHeader = document.querySelector("#compiler .section-head");
  compilerHeader.querySelector(".eyebrow").textContent = copy.promptCompiler;
  compilerHeader.querySelector("h2").textContent = copy.compilerTitle;
  compilerHeader.querySelector(":scope > p").textContent = copy.compilerIntro;
  document.querySelector('label[for="profile"]').textContent = copy.target;
  document.querySelector('label[for="brief"]').textContent = copy.brief;
  document.querySelector('label[for="locale"]').textContent = copy.language;
  document.querySelector("#compiler-form button[type=submit]").textContent = copy.compile;
  const promptHeader = document.querySelector(".prompt-output header span");
  promptHeader.textContent = copy.compiled;
  document.querySelector("#copy-prompt").textContent = copy.copy;
  document.querySelector("#download-prompt").textContent = copy.downloadPrompt;
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
  const copy = ui();
  renderKitShell();
  document.querySelector("#example-dataset-note").innerHTML = `
    <span class="dataset-badge ${escapeHtml(activeBrand.kind)}">${escapeHtml(activeBrand.badge)}</span>
    <div><strong>${escapeHtml(activeBrand.name)}</strong><p>${escapeHtml(activeBrand.description)} — ${isFictional ? copy.fictionalEvidence : copy.realEvidence}</p></div>`;
  document.querySelector("#complete-dna-title").textContent = copy.inspect(activeBrand.name);
  document.querySelector("#complete-dna-copy").textContent = isFictional
    ? copy.completeFictional
    : copy.completeReal;
  const download = document.querySelector("#download-dna");
  download.href = activeBrand.data;
  download.download = activeBrand.downloadName;
  download.textContent = copy.downloadDna(activeBrand.name);

  if (resetBrief) {
    document.querySelector("#brief").value = activeBrand.starterBrief;
    renderLocaleOptions(activeBrand.dna.meta.defaultLocale);
  }
  renderProfileOptions(activeBrand.starterProfile || "photography");
  renderSummary();
  renderAssets();
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
document.querySelector("#locale").addEventListener("change", () => {
  const selectedProfile = profileSelect.value;
  renderProfileOptions(selectedProfile);
  compile();
});
document.querySelector("#copy-prompt").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  const copy = ui();
  const originalLabel = button.textContent || copy.copy;
  try {
    await navigator.clipboard.writeText(activePacket.prompt);
    button.textContent = copy.copied;
  } catch {
    const textarea = Object.assign(document.createElement("textarea"), { value: activePacket.prompt, readOnly: true });
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    button.textContent = document.execCommand("copy") ? copy.copied : copy.copyFallback;
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
