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

const LABELS_DE = {
  brand: "Markenidentität",
  strategy: "Strategie und Bedeutung",
  verbal: "Sprachliche Identität",
  visual: "Visuelle Identität",
  representation: "Menschen und Repräsentation",
  sensory: "Klang, Musik und Stimme",
  channels: "Verhalten je Kanal",
  rules: "Übergreifende Regeln",
  provenance: "Quellen und offene Entscheide",
  assets: "Produktionsdateien",
  logos: "Freigegebene Logos",
  icons: "Freigegebene Icons",
  textures: "Freigegebene Texturen",
  illustrations: "Freigegebene Illustrationen",
  templates: "Produktionsvorlagen",
  identity: "Kernidentität",
  essence: "Markenkern",
  worldview: "Weltbild und Haltung",
  positioning: "Positionierung",
  audiences: "Zielgruppen",
  values: "Werte im Verhalten",
  messaging: "Botschaftensystem",
  voice: "Stimme",
  language: "Sprachregeln",
  claims: "Aussagen und Belege",
  logo: "Logosystem",
  colors: "Farbsystem",
  typography: "Typografie",
  layout: "Layout und Komposition",
  shapes: "Formensprache",
  iconography: "Ikonografie",
  illustration: "Illustration",
  photography: "Fotografie",
  motion: "Bewegung",
  linkedin: "LinkedIn",
  video: "Video",
  brochure: "Broschüre und Druck",
  advertising: "Werbung",
  presentations: "Präsentationen",
  website: "Website",
  universal: "Verbindliche Regeln",
  accessibility: "Barrierefreiheit",
  legal: "Recht und Nutzungsrechte",
  quality: "Qualitätsprüfungen",
  openQuestions: "Offene Fragen",
};

const PROMPT_COPY = {
  en: {
    title: "Brand production brief",
    producing: (label, brandName) => `You are producing a ${label.toLowerCase()} for **${brandName}**. Treat the Brand DNA below as the authoritative creative context for this task. Follow explicit rules before inferred preferences. Never turn an inference into a public fact.`,
    task: "Task",
    noBrief: "No additional brief was supplied. Define the smallest useful deliverable that satisfies this profile.",
    outputLanguage: "Output language",
    sourceLanguage: "Brand DNA source language",
    detail: "Detail level",
    detailValues: { exhaustive: "exhaustive" },
    profileId: "Profile id",
    translation: "When source and output language differ, translate meaning faithfully. Preserve approved terminology, names, claims, numbers and legal wording; flag anything that cannot be translated safely.",
    method: "Working method",
    methodItems: [
      "Resolve the communicative job before choosing style.",
      "Use only the Brand DNA sections included below; missing information is an open decision, not permission to invent.",
      "Make every visual, verbal and technical choice traceable to a supplied rule, value, audience need or channel constraint.",
      "Keep verified facts, creative direction and hypotheses visibly separate.",
      "Check the finished work against every production and quality item before returning it.",
    ],
    selected: "Selected Brand DNA",
    direction: "Profile-specific production direction",
    checklist: "Production checklist",
    response: "Required response",
    finish: "Return the finished production-ready result first, followed by a short compliance note that names unresolved decisions. Do not repeat the entire Brand DNA and do not pad the answer with generic branding advice.",
    yes: "yes",
    no: "no",
    missing: "not specified",
  },
  de: {
    title: "Produktionsbrief der Marke",
    producing: (label, brandName) => `Du erstellst ${label} für **${brandName}**. Behandle die folgende Brand DNA als verbindlichen kreativen Kontext. Explizite Regeln stehen vor abgeleiteten Vorlieben. Mache aus einer Annahme nie eine öffentliche Tatsache.`,
    task: "Aufgabe",
    noBrief: "Es wurde kein zusätzlicher Auftrag mitgegeben. Definiere das kleinste sinnvolle Ergebnis, das dieses Profil erfüllt.",
    outputLanguage: "Ausgabesprache",
    sourceLanguage: "Quellsprache der Brand DNA",
    detail: "Detailgrad",
    detailValues: { exhaustive: "ausführlich" },
    profileId: "Profil-ID",
    translation: "Wenn Quell- und Ausgabesprache nicht übereinstimmen, übersetze den Sinn präzise. Übernimm freigegebene Begriffe, Namen, Aussagen, Zahlen und rechtliche Formulierungen unverändert. Markiere alles, was sich nicht sicher übersetzen lässt.",
    method: "Arbeitsweise",
    methodItems: [
      "Kläre zuerst die kommunikative Aufgabe. Wähle erst danach den Stil.",
      "Nutze nur die unten ausgewählten Teile der Brand DNA. Fehlende Angaben sind offene Entscheide und keine Erlaubnis, etwas zu erfinden.",
      "Leite jeden visuellen, sprachlichen und technischen Entscheid aus einer Regel, einem Wert, einem Bedürfnis der Zielgruppe oder einer Vorgabe des Kanals ab.",
      "Halte belegte Fakten, kreative Richtung und Hypothesen sichtbar auseinander.",
      "Prüfe das fertige Ergebnis vor der Rückgabe gegen alle Produktions- und Qualitätskriterien.",
    ],
    selected: "Ausgewählte Brand DNA",
    direction: "Produktionsvorgaben für dieses Profil",
    checklist: "Produktionsprüfung",
    response: "Erwartetes Ergebnis",
    finish: "Gib zuerst das fertige, produktionsreife Ergebnis zurück. Danach folgt eine kurze Prüfung mit den noch offenen Entscheiden. Wiederhole nicht die vollständige Brand DNA und fülle die Antwort nicht mit allgemeinen Markentipps.",
    yes: "ja",
    no: "nein",
    missing: "nicht angegeben",
  },
  fr: {
    title: "Brief de production de la marque",
    producing: (label, brandName) => `Vous produisez ${label} pour **${brandName}**. Considérez la Brand DNA ci-dessous comme le contexte créatif de référence. Les règles explicites priment sur les préférences déduites. Ne présentez jamais une déduction comme un fait public.`,
    task: "Tâche",
    noBrief: "Aucun brief supplémentaire n’a été fourni. Définissez le livrable utile le plus simple qui respecte ce profil.",
    outputLanguage: "Langue de sortie",
    sourceLanguage: "Langue source de la Brand DNA",
    detail: "Niveau de détail",
    detailValues: { exhaustive: "exhaustif" },
    profileId: "Identifiant du profil",
    translation: "Si les langues source et cible diffèrent, traduisez le sens avec précision. Conservez la terminologie approuvée, les noms, les affirmations, les chiffres et les formulations juridiques; signalez tout élément qui ne peut pas être traduit de manière sûre.",
    method: "Méthode de travail",
    methodItems: [
      "Définissez le rôle de communication avant de choisir le style.",
      "Utilisez uniquement les sections de Brand DNA fournies ci-dessous; une information manquante reste une décision ouverte.",
      "Reliez chaque choix visuel, verbal et technique à une règle, une valeur, un besoin du public ou une contrainte du canal.",
      "Séparez clairement les faits vérifiés, la direction créative et les hypothèses.",
      "Contrôlez le résultat final avec chaque critère de production et de qualité avant de le rendre.",
    ],
    selected: "Brand DNA sélectionnée",
    direction: "Directives de production propres au profil",
    checklist: "Contrôle de production",
    response: "Réponse attendue",
    finish: "Présentez d’abord le résultat final prêt à produire, puis une courte note de conformité qui nomme les décisions encore ouvertes. Ne répétez pas toute la Brand DNA et évitez les conseils de marque génériques.",
    yes: "oui",
    no: "non",
    missing: "non spécifié",
  },
  it: {
    title: "Brief di produzione del marchio",
    producing: (label, brandName) => `Stai producendo ${label} per **${brandName}**. Considera la Brand DNA seguente come contesto creativo vincolante. Le regole esplicite hanno la precedenza sulle preferenze dedotte. Non trasformare mai una deduzione in un fatto pubblico.`,
    task: "Compito",
    noBrief: "Non è stato fornito un brief aggiuntivo. Definisci il risultato utile più piccolo che soddisfi questo profilo.",
    outputLanguage: "Lingua di uscita",
    sourceLanguage: "Lingua sorgente della Brand DNA",
    detail: "Livello di dettaglio",
    detailValues: { exhaustive: "esaustivo" },
    profileId: "ID del profilo",
    translation: "Se la lingua sorgente e quella di uscita differiscono, traduci il significato con precisione. Mantieni terminologia approvata, nomi, affermazioni, numeri e formulazioni legali; segnala ciò che non può essere tradotto in modo sicuro.",
    method: "Metodo di lavoro",
    methodItems: [
      "Chiarisci il compito comunicativo prima di scegliere lo stile.",
      "Usa soltanto le sezioni della Brand DNA incluse qui sotto; le informazioni mancanti restano decisioni aperte.",
      "Collega ogni scelta visiva, verbale e tecnica a una regola, un valore, un bisogno del pubblico o un vincolo del canale.",
      "Separa chiaramente fatti verificati, direzione creativa e ipotesi.",
      "Verifica il lavoro finito rispetto a ogni criterio di produzione e qualità prima di restituirlo.",
    ],
    selected: "Brand DNA selezionata",
    direction: "Indicazioni di produzione specifiche del profilo",
    checklist: "Controllo di produzione",
    response: "Risposta richiesta",
    finish: "Restituisci prima il risultato finito e pronto per la produzione, seguito da una breve nota di conformità che indichi le decisioni ancora aperte. Non ripetere l’intera Brand DNA e non aggiungere consigli generici sul branding.",
    yes: "sì",
    no: "no",
    missing: "non specificato",
  },
};

function languageCode(locale = "en") {
  return String(locale).toLowerCase().split("-")[0];
}

function promptCopy(locale) {
  return PROMPT_COPY[languageCode(locale)] || PROMPT_COPY.en;
}

export function resolveLocale(brandDna, requestedLocale) {
  const defaultLocale = brandDna?.meta?.defaultLocale || "en";
  const locales = Array.isArray(brandDna?.meta?.locales) && brandDna.meta.locales.length
    ? brandDna.meta.locales
    : [defaultLocale];
  if (!requestedLocale) return defaultLocale;
  const exact = locales.find((locale) => locale.toLowerCase() === String(requestedLocale).toLowerCase());
  if (exact) return exact;
  const sameLanguage = locales.find((locale) => languageCode(locale) === languageCode(requestedLocale));
  return sameLanguage || defaultLocale;
}

function localizedProfile(profile, locale) {
  const translations = profile.translations || {};
  const translation = translations[locale] || translations[languageCode(locale)];
  return translation ? { ...profile, ...structuredClone(translation), translations: structuredClone(translations) } : structuredClone(profile);
}

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

function humanize(key, locale = "en") {
  const labels = languageCode(locale) === "de" ? LABELS_DE : LABELS;
  if (labels[key]) return labels[key];
  return String(key)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (character) => character.toUpperCase());
}

function renderScalar(value, locale = "en") {
  const copy = promptCopy(locale);
  if (typeof value === "boolean") return value ? copy.yes : copy.no;
  if (value === null || value === undefined || value === "") return copy.missing;
  return String(value);
}

function renderValue(value, level = 3, locale = "en") {
  if (Array.isArray(value)) {
    if (!value.length) return `- ${promptCopy(locale).missing}`;
    return value
      .map((item) => {
        if (item && typeof item === "object") {
          return `- ${Object.entries(item)
            .map(([key, nested]) => {
              if (Array.isArray(nested)) return `${humanize(key, locale)}: ${nested.map((item) => renderScalar(item, locale)).join("; ")}`;
              if (nested && typeof nested === "object") return `${humanize(key, locale)}: ${JSON.stringify(nested)}`;
              return `${humanize(key, locale)}: ${renderScalar(nested, locale)}`;
            })
            .join(" | ")}`;
        }
        return `- ${renderScalar(item, locale)}`;
      })
      .join("\n");
  }
  if (value && typeof value === "object") {
    const blocks = [];
    for (const [key, nested] of Object.entries(value)) {
      const heading = "#".repeat(Math.min(level, 6));
      if (nested && typeof nested === "object") {
        blocks.push(`${heading} ${humanize(key, locale)}\n\n${renderValue(nested, level + 1, locale)}`);
      } else {
        blocks.push(`- **${humanize(key, locale)}:** ${renderScalar(nested, locale)}`);
      }
    }
    return blocks.join("\n\n");
  }
  return renderScalar(value, locale);
}

export function renderPromptPacket(packet) {
  const { profile, brief, locale, sourceLocale, detail, brandName, context } = packet;
  const copy = promptCopy(locale);
  const checklist = profile.productionChecklist.map((item) => `- [ ] ${item}`).join("\n");
  const outputs = profile.outputContract.map((item) => `- ${item}`).join("\n");
  const contextBlocks = Object.entries(context)
    .map(([key, value]) => `## ${humanize(key, locale)}\n\n${renderValue(value, 3, locale)}`)
    .join("\n\n");

  return `# ${copy.title}: ${profile.label}\n\n` +
    `${copy.producing(profile.label, brandName)}\n\n` +
    `## ${copy.task}\n\n${brief || copy.noBrief}\n\n` +
    `- **${copy.outputLanguage}:** ${locale}\n` +
    `- **${copy.sourceLanguage}:** ${sourceLocale}\n` +
    `- **${copy.detail}:** ${copy.detailValues?.[detail] || detail}\n` +
    `- **${copy.profileId}:** ${profile.id}\n\n` +
    `${sourceLocale !== locale ? `${copy.translation}\n\n` : ""}` +
    `## ${copy.method}\n\n` +
    `${copy.methodItems.map((item, index) => `${index + 1}. ${item}`).join("\n")}\n\n` +
    `## ${copy.selected}\n\n${contextBlocks}\n\n` +
    `## ${copy.direction}\n\n${profile.instructions.map((item) => `- ${item}`).join("\n")}\n\n` +
    `## ${copy.checklist}\n\n${checklist}\n\n` +
    `## ${copy.response}\n\n${outputs}\n\n` +
    copy.finish;
}

export function compileBrandDNAWithProfile(brandDna, profile, options = {}) {
  const detail = options.detail || DEFAULT_DETAIL;
  const sourceLocale = brandDna?.meta?.defaultLocale || "en";
  const requestedLocale = options.locale || sourceLocale;
  const locale = resolveLocale(brandDna, requestedLocale);
  const brandName = brandDna?.brand?.identity?.name || "Unnamed brand";
  const context = selectBrandContext(brandDna, profile);
  const selectedProfile = localizedProfile(profile, locale);
  const packet = {
    schemaVersion: brandDna.schemaVersion,
    compiledAt: new Date().toISOString(),
    profile: selectedProfile,
    brandName,
    brief: options.brief || "",
    locale,
    sourceLocale,
    requestedLocale,
    localeFallback: locale !== requestedLocale,
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
