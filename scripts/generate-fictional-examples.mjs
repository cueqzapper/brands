import { mkdir, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const generatedAt = "2026-08-28T12:00:00+02:00";

const assetSets = {
  "rook-and-rye": {
    icons: [["loaf", "Loaf and batch"], ["grain", "Grain provenance"], ["collect", "Collection time"], ["allergen", "Allergen information"]],
    photo: ["bread-handoff.webp", "A baker passes a dark rye loaf across a worn bakery counter."],
  },
  "northline-repair": {
    icons: [["inspect", "Inspect damage"], ["stitch", "Repair method"], ["seal", "Weather seal"], ["passed", "Named test passed"]],
    photo: ["repair-inspection.webp", "A repair technician tests the zip of a repaired outdoor jacket at a working bench."],
  },
  "quiet-current": {
    icons: [["listen", "Listen"], ["edit", "Editorial change"], ["comment", "Review comment"], ["deliver", "Delivery version"]],
    photo: ["listening-edit.webp", "A sound editor listens back and marks a decision at a quiet edit desk."],
  },
};

function asset(id, kind, path, role, alt, description, source = null) {
  return {
    id, kind, path, mediaType: path.endsWith(".svg") ? "image/svg+xml" : "image/webp",
    role, alt, description, licence: "CC0-1.0",
    rights: "Created specifically for this fictional open demonstration dataset; no real organisation or protected mark is represented.",
    source, status: "approved", tags: [kind, "fictional-demo"], variants: [],
  };
}

function buildAssets(config) {
  const set = assetSets[config.id];
  return {
    basePath: "./assets/",
    logos: [
      asset("primary-logo", "logo", "logos/primary.svg", "Primary horizontal signature", config.name, `${config.name} primary wordmark and signet.`),
      asset("brand-mark", "logo", "logos/mark.svg", "Compact signet", `${config.name} signet`, `Compact ${config.name} mark for square and small applications.`),
    ],
    icons: set.icons.map(([id, role]) => asset(id, "icon", `icons/${id}.svg`, role, `${config.name}: ${role}`, `One member of the approved ${config.name} icon family.`)),
    photography: [asset("hero-documentary", "photograph", `photography/${set.photo[0]}`, "Primary documentary image", set.photo[1], `${config.photoMoment} Built-in image generation was art-directed from the Brand DNA on 2026-08-28.`, "https://openai.com/")],
    illustrations: [asset("system-pattern", "illustration", "illustrations/pattern.svg", "Supporting brand pattern", "", `A repeatable ${config.name} pattern derived from the approved shape grammar.`)],
    textures: [], motion: [], audio: [], templates: [],
  };
}

const commonAccessibility = {
  standard: "WCAG 2.2 AA for digital work; accessible PDF practices for documents.",
  contrast: [
    "Normal text must reach at least 4.5:1.",
    "Large text and interface boundaries must reach at least 3:1.",
    "Colour can never be the only carrier of state.",
    "Use only pairings that have been measured, not guessed from appearance."
  ],
  motion: [
    "Respect prefers-reduced-motion without losing meaning.",
    "Do not autoplay essential information without controls.",
    "Avoid flashes and persistent pulses.",
    "Every animated state needs an immediate static equivalent."
  ],
  text: [
    "Keep body copy as selectable, scalable text.",
    "Use a meaningful heading hierarchy.",
    "Write links that describe their destination.",
    "Explain specialist terms at first use."
  ],
  media: [
    "Alt text describes the image's communication job.",
    "Decorative images receive empty alt text.",
    "Video includes captions and a transcript.",
    "Information remains understandable without sound."
  ]
};

const commonRepresentation = {
  sensitiveAttributePolicy: "Never infer ethnicity, religion, health, sexual orientation, gender identity or another sensitive attribute from a name, face, place or industry. Unknown remains unknown.",
  consent: "Recognisable real people require documented permission for the exact channel and context. Do not reuse customer or staff imagery as generic campaign material.",
  avoid: [
    "token casting",
    "roles assigned through gender or age stereotypes",
    "synthetic faces presented as real staff",
    "disability used as inspirational decoration",
    "children without a necessary context and explicit guardian consent"
  ]
};

function paletteColor(id, name, hex, role, meaning, use, avoid = ["decoration without a defined job"]) {
  return { id, name, hex, role, meaning, use, avoid, "$type": "color" };
}

function buildChannels(config) {
  const cta = config.cta;
  return {
    linkedin: {
      job: config.linkedinJob,
      audience: config.audience,
      format: ["one observed moment", "a short process story", "a material or craft detail", "an honest decision note"],
      structure: ["specific opening scene", "one tension", "what changed or was learned", "proof or limit", "one proportionate next step"],
      tone: config.voiceTraits.slice(0, 4),
      visual: [config.photoMoment, "one decisive crop", "live typography outside the image", `use ${config.accentName} only as a deliberate signal`],
      cta: [cta, config.secondaryCta],
      avoid: ["generic professional inspiration", "a list with no lived example", "inflated certainty", "hashtag carpet", "manufactured controversy"]
    },
    website: {
      job: `Help ${config.audience.toLowerCase()} understand the offer, proof and next step without category theatre.`,
      audience: config.audience,
      format: ["home page", "service page", "process page", "field note or case study"],
      structure: ["recognisable situation", "clear offer", "how the work happens", "evidence", "limits and practical details", "next step"],
      tone: config.voiceTraits.slice(0, 3),
      visual: [config.visualDirection, config.layoutPrinciple, config.photoMoment, `functional ${config.accentName} accents`],
      cta: [cta, config.secondaryCta],
      avoid: ["offer hidden behind atmosphere", "unverifiable counters", "generic stock scenes", "motion that delays reading"]
    },
    brochure: {
      job: "Turn the offer, process and proof into a document that can be understood and passed on without a presenter.",
      audience: config.audience,
      format: ["A4 portrait PDF", "short printed field guide", "accessible digital handout"],
      structure: ["cover with one useful sentence", "reader situation", "offer", "process", "proof", "limits", "practical details", "contact"],
      tone: [config.voiceTraits[0], config.voiceTraits[1], "source-aware"],
      visual: [config.layoutPrinciple, "large purposeful images", "real type for every word", "sources in readable marginal notes"],
      cta: [cta],
      avoid: ["decorative spreads with no information", "tiny body type", "generated text inside images", "claims without a source"]
    },
    advertising: {
      job: `Show one recognisable need and lead to ${cta.toLowerCase()}.`,
      audience: config.audience,
      format: ["static social placement", "three-frame carousel", "short vertical film"],
      structure: ["visible situation", "specific friction or desire", "credible changed state", "one action"],
      tone: [config.voiceTraits[0], config.voiceTraits[1], "unforced"],
      visual: [config.photoMoment, "one focal point", "live headline typography"],
      cta: [cta],
      avoid: ["fear as pressure", "fake testimonials", "guaranteed outcomes", "multiple offers in one placement", "synthetic urgency"]
    },
    video: {
      job: `Make the physical and emotional change behind ${config.category.toLowerCase()} understandable over time.`,
      audience: config.audience,
      format: ["20-30 second social film", "60-second process portrait", "quiet product or service sequence"],
      structure: ["real opening detail", "friction", "human action", "visible result", "restrained end frame"],
      tone: [config.voiceTraits[0], config.voiceTraits[1], "observant"],
      visual: [config.photoMoment, config.motionSignature[0], "material close-ups", "clear caption safe areas"],
      cta: [cta],
      avoid: ["trailer pacing", "montage without a legible action", "fake interfaces or labels", "music that masks speech"]
    },
    presentations: {
      job: "Support one spoken decision with visible evidence and a clear next action.",
      audience: config.audience,
      format: ["16:9 presentation", "short decision deck", "visual process walkthrough"],
      structure: ["opening situation", "tension", "point of view", "proof", "decision", "next action"],
      tone: [config.voiceTraits[0], "spoken", "specific"],
      visual: ["one idea per slide", config.layoutPrinciple, "large type", "sources beside the claim"],
      cta: [cta],
      avoid: ["document pages pasted onto slides", "tiny charts", "evidence-free market claims", "decorative roadmap theatre"]
    },
    email: {
      job: "Make one practical next step easy to understand and answer.",
      audience: "A known customer, partner or relevant enquirer.",
      format: ["short personal note", "order or project update", "decision summary"],
      structure: ["reason for writing", "the concrete matter", "one next step", "plain sign-off"],
      tone: [config.voiceTraits[0], "brief", "respectful"],
      visual: ["plain text or restrained semantic HTML"],
      cta: [cta, config.secondaryCta],
      avoid: ["newsletter chrome for a personal message", "several competing asks", "false deadlines"]
    }
  };
}

function buildDNA(config) {
  const sourceId = `source-${config.id}-fictional-brief`;
  return {
    "$schema": "https://cueqzapper.github.io/brands/schema.json",
    schemaVersion: "1.1.0",
    meta: {
      id: config.id,
      version: "1.1.0",
      status: "draft",
      createdAt: generatedAt,
      updatedAt: generatedAt,
      defaultLocale: "en",
      locales: ["en"],
      owner: "Fictional demo dataset — no real organisation",
      reviewers: ["Brand DNA maintainers"],
      reviewCycle: "Revise whenever the example is used to demonstrate a new production profile.",
      licence: "CC0-1.0. Names, organisations, products, people and evidence in this dataset are entirely fictional."
    },
    brand: {
      identity: {
        name: config.name,
        legalName: null,
        pronunciation: config.pronunciation,
        tagline: config.tagline,
        descriptor: config.descriptor,
        website: `https://${config.id}.example/`,
        origin: config.origin,
        nameMeaning: config.nameMeaning
      },
      essence: {
        oneLine: config.oneLine,
        promise: config.promise,
        personality: config.personality,
        tension: config.tension,
        archetypes: config.archetypes
      },
      worldview: {
        belief: config.belief,
        opposes: config.opposes,
        future: config.future,
        humanRole: config.humanRole,
        technologyRole: config.technologyRole,
        politicalOrSocialBoundaries: [
          "Do not turn the brand into a party-political position.",
          "Do not use anxiety, shame or social status as sales pressure.",
          "Do not romanticise labour or hide who performs it."
        ]
      }
    },
    strategy: {
      purpose: config.purpose,
      positioning: {
        category: config.category,
        audience: config.audience,
        need: config.need,
        difference: config.difference,
        proof: config.proof,
        alternatives: config.alternatives,
        pricePosition: config.pricePosition
      },
      offers: config.offers,
      audiences: config.audiences.map((audience, index) => ({ ...audience, evidenceIds: [sourceId], id: audience.id || `audience-${index + 1}` })),
      values: config.values,
      messaging: {
        masterMessage: config.masterMessage,
        messagePillars: config.messagePillars,
        ctaHierarchy: [config.cta, config.secondaryCta, "Read the process"],
        storyPattern: config.storyPattern
      }
    },
    verbal: {
      voice: {
        traits: config.voiceTraits,
        dimensions: config.voiceDimensions,
        toneByContext: {
          website: { tone: config.voiceTraits.slice(0, 3), do: ["start with a recognisable scene", "make the next step concrete"], avoid: ["category slogans", "claims with no physical or recorded proof"] },
          linkedin: { tone: [config.voiceTraits[0], "observant", "human"], do: ["follow one thought", "name the material detail"], avoid: ["generic lessons", "performative certainty"] },
          support: { tone: ["calm", "responsible", "specific"], do: ["repeat the issue", "give an owner and next update"], avoid: ["blame", "false reassurance"] },
          error: { tone: ["brief", "plain", "useful"], do: ["say what happened and what remains safe", "offer the next available action"], avoid: ["jokes during loss or payment issues", "technical codes without explanation"] }
        }
      },
      language: {
        locales: ["en"],
        defaultRegister: config.register,
        sentenceRhythm: config.rhythm,
        preferred: config.preferred,
        avoid: ["innovative", "world-class", "seamless", "game-changing", "premium solution", "unlock", "elevate", "journey"],
        terminology: config.terminology,
        formatting: ["sentence case", "short paragraphs", "contractions are welcome when natural", "lists only when they improve scanning", "no decorative all-caps paragraphs"],
        inclusiveLanguage: "Name real roles and actions. Do not invent personal characteristics or reduce an audience to a demographic stereotype."
      },
      claims: {
        allowed: config.allowedClaims,
        requiresEvidence: ["time saved", "durability", "customer numbers", "environmental impact", "comparative quality", "health or safety outcomes"],
        forbidden: ["best in the world", "guaranteed result", "zero impact", "perfect", "a customer quote without permission", "a certification that does not exist"],
        disclaimers: ["This is a fictional Brand DNA dataset. No company, product, customer or performance claim is real."]
      },
      examples: { onBrand: config.onBrand, offBrand: config.offBrand }
    },
    visual: {
      concept: {
        direction: config.visualDirection,
        rationale: config.visualRationale,
        keywords: config.visualKeywords,
        visualTension: config.visualTension
      },
      colors: {
        dtcgVersion: "2025.10",
        palette: config.palette,
        pairings: config.pairings,
        usage: config.colorUsage,
        gradients: config.gradients
      },
      typography: {
        families: config.typeFamilies,
        roles: config.typeRoles,
        scale: { display: "clamp(4rem, 12vw, 11rem)", h1: "clamp(2.8rem, 7vw, 6rem)", h2: "clamp(2rem, 4vw, 3.8rem)", body: "clamp(1rem, 1.2vw, 1.2rem)", label: "0.72rem" },
        rules: config.typeRules
      },
      logo: {
        idea: config.logoIdea,
        variants: [
          { id: "primary", asset: "assets/logos/primary.svg", foreground: config.palette[0].hex, background: "light" },
          { id: "mark", asset: "assets/logos/mark.svg", foreground: config.palette[0].hex, background: "light or dark according to the approved master" }
        ],
        clearspace: "At least the cap height of the first letter on every side.",
        minimumSize: { digitalWidth: "24 px symbol; 104 px wordmark", printWidth: "8 mm symbol; 28 mm wordmark" },
        placement: ["align to the primary content grid", "keep away from photography focal points", "use one-colour variants when contrast is uncertain"],
        do: ["use approved vector masters", "preserve spacing", "test the smallest delivered size"],
        dont: ["redraw with an image model", "stretch", "add shadows", "place over a busy detail", "use the symbol as a decorative texture"]
      },
      layout: {
        principle: config.layoutPrinciple,
        grid: config.grid,
        spacingScale: { "1": "4px", "2": "8px", "3": "12px", "4": "16px", "6": "24px", "8": "32px", "12": "48px", "16": "64px", "24": "96px" },
        density: config.density,
        composition: config.composition,
        responsive: ["preserve hierarchy, not desktop coordinates", "keep the primary action above bottom navigation", "allow text to wrap without collision", "prove zero horizontal overflow at 390 px"]
      },
      shapes: {
        geometry: config.geometry,
        corners: config.corners,
        strokes: config.strokes,
        motifs: config.motifs,
        avoid: config.shapeAvoid
      },
      iconography: {
        job: config.iconJob,
        metaphor: config.iconMetaphor,
        grid: "24 × 24 px with a 2 px optical safe area.",
        stroke: config.iconStroke,
        corners: config.iconCorners,
        detail: "One primary form and no more than one supporting detail; test at 16 px.",
        color: `One colour by default; ${config.accentName} marks only an active or selected state.`,
        opticalRules: ["centre by perceived mass", "open narrow gaps at small sizes", "round joins consistently", "align repeated elements to whole pixels where possible"],
        do: ["start from the semantic job", "use category-specific physical metaphors", "supply an accessible text label", "deliver SVG geometry"],
        dont: ["trace the logo", "use emoji anatomy", "mix outline weights", "add words or letters", "put the icon in a presentation mockup"]
      },
      illustration: {
        job: config.illustrationJob,
        style: config.illustrationStyle,
        perspective: config.illustrationPerspective,
        do: ["show a specific relationship", "keep objects physically plausible"],
        dont: ["generic floating shapes", "fictional labels or certificates", "cute characters without a narrative job"]
      },
      photography: {
        job: config.photoJob,
        subjects: config.photoSubjects,
        environment: config.photoEnvironment,
        moment: config.photoMoment,
        composition: config.photoComposition,
        camera: config.camera,
        lens: config.lens,
        light: config.light,
        palette: config.photoPalette,
        grade: config.grade,
        texture: config.texture,
        do: ["keep working detail legible", "show believable hands and tools", "leave crop-safe space deliberately", "grade a series as one shoot"],
        dont: ["posed handshake", "everyone smiling at the lens", "plastic skin", "fake text", "watermarks", "invented logos", "impossible tools", "overdriven HDR"]
      },
      motion: {
        principle: config.motionPrinciple,
        durations: { fast: "120ms", normal: "240ms", slow: "600ms", cinematic: "1200-2400ms" },
        easing: { ui: "cubic-bezier(.2,.8,.2,1)", scan: "linear", reveal: "cubic-bezier(.16,1,.3,1)" },
        signature: config.motionSignature,
        reducedMotion: "Replace spatial movement and looping signals with an immediate static state change.",
        avoid: ["hover bounce", "permanent decoration", "text moving without control", "motion that competes with the task"]
      },
      dataVisualization: {
        principle: config.dataPrinciple,
        colors: config.dataColors,
        rules: ["spell out axes and units", "show source and date", "mark estimates and incomplete series", "never use colour as the only distinction"]
      }
    },
    assets: buildAssets(config),
    representation: {
      principle: config.representationPrinciple,
      casting: config.casting,
      ...commonRepresentation
    },
    sensory: config.sensory,
    channels: buildChannels(config),
    rules: {
      universal: [
        "Keep verified facts, fictional demonstration content, creative decisions and inference visibly separate.",
        `Write ${config.name} exactly as shown; do not invent variants or sub-brands.`,
        `${config.accentName} must have a functional or narrative job.`,
        "Use real typography for readable words; image models do not create logos, labels or certificates.",
        "Show people as capable participants, not decoration.",
        "Do not publish a claim that the fictional evidence model would reject.",
        "A production is complete only after its real target size and channel have been checked."
      ],
      accessibility: commonAccessibility,
      legal: {
        trademarks: ["The name is fictional but still requires a real clearance search before commercial adoption.", "Never recreate a third-party mark in generated assets."],
        assets: ["Record the source and licence for every font, image, icon and sound.", "Keep logo masters as vectors outside image-generation prompts.", "Do not copy imagery from an unrelated real organisation into this example."],
        claims: ["Every public claim needs a real source or owner approval.", "Fictional proof cannot be reused as a real testimonial.", "Measure environmental, time and performance claims before stating them."],
        privacy: ["Do not add personal data that is unnecessary for the artifact.", "Do not infer sensitive attributes.", "Use recognisable people only with documented rights."]
      },
      quality: {
        beforeRelease: ["task and audience match", "compiled profile contains only relevant context", "facts and fiction are labelled", "language is concrete and human", "visual rules are measurable", "desktop and mobile are checked", "exports are opened and inspected", "rights and privacy are cleared"],
        failConditions: ["fiction presented as fact", "unreadable contrast", "generic category stock", "damaged text or logo", "sensitive attributes inferred as fact", "horizontal overflow at 390 px", "cut-off document content", "external publication without approval"]
      }
    },
    provenance: {
      sources: [{
        id: sourceId,
        type: "other",
        url: `https://${config.id}.example/fictional-brief`,
        title: `${config.name} fictional demonstration brief`,
        capturedAt: generatedAt,
        notes: "Synthetic source written for the open Brand DNA repository. It does not describe a real organisation, person, product, customer or result."
      }],
      decisions: [
        { path: "/brand", state: "owner-approved", confidence: 1, sourceIds: [sourceId], rationale: "Deliberately authored as the coherent strategic premise for this fictional example.", approvedBy: "Fictional demo editor", approvedAt: generatedAt },
        { path: "/verbal", state: "owner-approved", confidence: 1, sourceIds: [sourceId], rationale: "Deliberately authored to demonstrate a distinct operational voice.", approvedBy: "Fictional demo editor", approvedAt: generatedAt },
        { path: "/visual", state: "owner-approved", confidence: 1, sourceIds: [sourceId], rationale: "Deliberately authored to demonstrate task-ready visual constraints.", approvedBy: "Fictional demo editor", approvedAt: generatedAt },
        { path: "/sensory", state: "inferred", confidence: 0.8, sourceIds: [sourceId], rationale: "An exploratory extension of the fictional visual and verbal direction.", approvedBy: null, approvedAt: null }
      ],
      openQuestions: config.openQuestions
    }
  };
}

const configs = [
  {
    id: "rook-and-rye",
    name: "Rook & Rye",
    pronunciation: "rook and rye",
    tagline: "Bread for the walk home.",
    descriptor: "Neighbourhood bakery and grain workshop",
    origin: "The fictional canal town of Marrowick",
    nameMeaning: "Rook names the clever black birds around the old grain yard; rye names the grain that gives the bakery its darker, patient character.",
    oneLine: "Rook & Rye makes daily bread feel local, useful and worth crossing the street for.",
    promise: "Every loaf has a named grain, a clear bake time and a reason to be on today's shelf.",
    personality: ["warm", "plain-spoken", "observant", "earthy", "lively", "unfussy"],
    tension: "Dark, inky craft marks meet the soft warmth and slight disorder of a working bakery.",
    archetypes: ["neighbour", "maker", "keeper of daily ritual"],
    belief: "Good bread belongs to ordinary days, and people deserve to know what is in it, when it was baked and who made it.",
    opposes: ["fake rustic nostalgia", "precious food language", "anonymous ingredients", "waste hidden behind abundance", "luxury theatre around a staple"],
    future: "A neighbourhood bakery can be both a daily utility and a place where grain, time and labour remain visible.",
    humanRole: "Bakers judge fermentation, shape dough and explain what changed from one batch to the next.",
    technologyRole: "Technology records batches, allergens and demand without replacing touch, smell or the baker's judgement.",
    purpose: { why: "Daily food should carry a visible relationship to place, grain and labour.", mission: "Bake a small, useful range each day and explain it without ceremony.", vision: "Neighbourhood bread becomes more transparent, less wasteful and more connected to regional grain." },
    category: "Neighbourhood bakery, bread subscription and grain workshops",
    audience: "People who buy bread for everyday meals, nearby cafés and curious home bakers",
    need: "Fresh bread with known ingredients and reliable collection times, without boutique food theatre.",
    difference: "A short daily range, visible batch notes and practical grain workshops connect the shelf to the work behind it.",
    proof: ["Each fictional loaf card names grain, mill, bake time and allergens.", "The fictional batch board records what sold, remained and was repurposed."],
    alternatives: ["supermarket bread", "anonymous wholesale loaves", "high-end patisserie", "home baking without reliable guidance"],
    pricePosition: "Above supermarket bread, below occasion-led luxury baking; prices reflect regional grain and skilled labour.",
    offers: [
      { name: "Daily shelf", job: "Put useful bread and two seasonal extras within an easy walk.", outcome: "Customers can choose quickly from a short range with clear ingredients and bake times.", proof: ["Fictional batch cards accompany every item."], notFor: ["large event catering", "an all-day menu"] },
      { name: "Saturday grain table", job: "Help home bakers understand one grain and one technique through practice.", outcome: "A small group leaves with a baked loaf, a repeatable method and honest failure notes.", proof: ["The fictional workshop uses one shared dough at different fermentation stages."], notFor: ["professional certification", "performance cooking entertainment"] }
    ],
    audiences: [
      { id: "daily-neighbour", name: "The daily neighbour", context: "They are collecting food on the way home and have little time for explanation.", job: "Choose a loaf that fits dinner and dietary needs in under a minute.", barriers: ["unclear sell-by language", "intimidating bakery jargon", "queues"], desiredShift: "From 'Which expensive loaf am I meant to understand?' to 'I know what this is for tonight.'", language: "Plain names, ingredients and practical serving notes." },
      { id: "curious-baker", name: "The curious home baker", context: "They can follow a recipe but struggle to read fermentation and grain behaviour.", job: "Learn one physical cue they can repeat at home.", barriers: ["recipe perfectionism", "equipment anxiety", "inconsistent flour"], desiredShift: "From copying times to noticing dough.", language: "Sensory verbs and precise ranges, never mystical craft language." }
    ],
    values: [
      { name: "Daily usefulness", meaning: "Bread earns its place at breakfast, in a lunch bag and beside soup.", behaviours: ["keep the range short", "state what each loaf suits"], antiBehaviours: ["novelty for novelty's sake", "display food that is impractical to eat"] },
      { name: "Visible grain", meaning: "Ingredients, origin and variation stay legible.", behaviours: ["name the mill", "publish batch notes"], antiBehaviours: ["invent provenance", "hide substitutions"] },
      { name: "Waste is a design input", meaning: "Unsold bread changes tomorrow's plan.", behaviours: ["record remains", "repurpose safely and label it"], antiBehaviours: ["overproduce for a full-looking shelf", "make vague zero-waste claims"] }
    ],
    masterMessage: "Today’s bread, what it is for, and when it came out of the oven.",
    messagePillars: [
      { name: "Today", claim: "The range follows today's batch, not an endless menu.", proof: ["Fictional time-stamped batch board"] },
      { name: "Known grain", claim: "Every loaf names its grain and mill.", proof: ["Fictional ingredient and provenance cards"] },
      { name: "Useful knowledge", claim: "Workshops teach cues people can repeat at home.", proof: ["Fictional take-home method sheet"] }
    ],
    cta: "See today's bread",
    secondaryCta: "Book the grain table",
    storyPattern: "Open with the day and the loaf. Show grain, hands and time. End with the meal or skill it makes possible.",
    voiceTraits: ["warm", "plain", "sensory", "specific", "wry", "neighbourly"],
    voiceDimensions: [
      { axis: "useful over poetic", value: 78, instruction: "Name the bread's job before describing atmosphere." },
      { axis: "warm over polished", value: 86, instruction: "Allow human rhythm and a little flour on the sentence." },
      { axis: "sensory over technical", value: 72, instruction: "Use smell, crust, crumb and touch, then give the useful number." }
    ],
    register: "Everyday British English. Friendly without pet names, foodie performance or heritage cosplay.",
    rhythm: "Short notices and one longer sensory sentence. Sound like a person behind the counter, not a lifestyle magazine.",
    preferred: ["today", "warm", "dark crust", "soft crumb", "batch", "grain", "rest", "tear", "toast"],
    terminology: { product: "loaf, bun or pastry by its plain name", provenance: "name the actual farm or mill", workshop: "grain table", customer: "neighbour or customer", waste: "unsold bread or remaining batch" },
    allowedClaims: ["This fictional batch was baked today.", "This fictional loaf contains the listed grain and allergens.", "The grain table is a practical two-hour workshop in this fictional scenario."],
    onBrand: ["Rye tin, 08:10. Dark crust. Built for butter and soup.", "Three trays left. The apricot buns are softer today because the kitchen was warm.", "You do not need a starter with a name. You need to know what ready dough feels like."],
    offBrand: ["Elevate your morning with our artisanal masterpieces.", "An unforgettable journey through the ancient soul of grain.", "Premium baked experiences, handcrafted to perfection."],
    visualDirection: "Ink-black bakery marks, oat paper, kiln red and butter yellow around honest close-up food photography.",
    visualRationale: "The identity borrows from batch stamps and paper bags, then lets warm bread and working surfaces break the grid.",
    visualKeywords: ["batch stamp", "oat paper", "ink", "scored crust", "grease pencil", "kiln red", "morning window", "useful warmth"],
    visualTension: "Hard black marks and soft bread; a tidy information grid and a visibly active bench.",
    accentName: "kiln red",
    palette: [
      paletteColor("ink", "Bakery ink", "#171513", "foreground", "Batch marks and direct information", ["headlines", "labels", "one-colour mark"]),
      paletteColor("oat", "Oat paper", "#F1E9D5", "surface", "Warm everyday ground", ["paper", "web surfaces", "packaging"]),
      paletteColor("kiln", "Kiln red", "#C64B2F", "primary", "Heat and today’s signal", ["current batch", "CTA", "small crop marks"]),
      paletteColor("butter", "Butter yellow", "#F3C969", "secondary", "Soft morning warmth", ["workshop notes", "seasonal accent"]),
      paletteColor("rye", "Rye brown", "#694A32", "material", "Grain and crust", ["charts", "illustration", "secondary text"]),
      paletteColor("flour", "Flour white", "#FFFDF7", "on-dark", "Clean contrast", ["text on ink", "small reverse marks"])
    ],
    pairings: [{ foreground: "#171513", background: "#F1E9D5", ratio: 13.9, use: "Body text on oat" }, { foreground: "#FFFDF7", background: "#171513", ratio: 17.0, use: "Reverse text" }, { foreground: "#171513", background: "#F3C969", ratio: 10.8, use: "Workshop labels" }],
    colorUsage: ["Oat and ink carry most of the system.", "Kiln red marks what is current or actionable.", "Let bread supply the richest colour in photography."],
    gradients: [{ name: "Oven edge", css: "linear-gradient(135deg,#F1E9D5 0%,#F1E9D5 68%,#C64B2F 100%)", job: "A rare transition on workshop covers" }],
    typeFamilies: [{ family: "Fraunces", source: "Google Fonts or bundled WOFF2", weights: [600, 700], licence: "SIL Open Font License 1.1", use: "Warm display headlines" }, { family: "IBM Plex Sans", source: "Google Fonts or bundled WOFF2", weights: [400, 600], licence: "SIL Open Font License 1.1", use: "Body and navigation" }, { family: "DM Mono", source: "Google Fonts or bundled WOFF2", weights: [400, 500], licence: "SIL Open Font License 1.1", use: "Batch times and ingredients" }],
    typeRoles: { display: "Fraunces 700", heading: "Fraunces 600", body: "IBM Plex Sans 400", mono: "DM Mono 500" },
    typeRules: ["Keep display type compact and sentence case.", "Set batch times in mono.", "Use tabular numbers for quantities.", "Never curve text around bread.", "Do not simulate vintage distress on live copy."],
    logoIdea: "A rook footprint reduced to three grain-like cuts beside a sturdy wordmark; recognisable as a mark, not a bird illustration.",
    layoutPrinciple: "A practical batch ledger interrupted by one generous crop of bread or hands.",
    grid: "Six columns on desktop, four on tablet and one reading column on mobile.",
    density: "Compact for products and times; spacious for stories and workshops.",
    composition: ["time and availability lead product cards", "one large crop per view", "labels sit on a strict baseline", "allow torn or dusted edges only in photography", "keep checkout controls visually plain"],
    geometry: "Rectangles, ruled ledger lines and one three-cut rook motif.", corners: "2-4 px on functional controls; paper and image masks may remain square.", strokes: "1.5 px for UI and 2 px for marks.",
    motifs: ["three scored cuts", "batch circles", "ledger rules", "paper folds", "small time stamps"], shapeAvoid: ["wheat-sheaf clichés", "ornamental crests", "fake wax seals", "soft blobs"],
    iconJob: "Label ingredients, collection, allergens and workshop actions instantly.", iconMetaphor: "Simple objects from the bakery and table, drawn as sturdy stamped outlines.", iconStroke: "2 px with slightly squared terminals.", iconCorners: "Small 1 px softening; never bubbly.",
    illustrationJob: "Explain grain, fermentation and batch flow when photography cannot show the relationship.", illustrationStyle: "Two-colour cut-paper diagrams with stamped labels added as live type.", illustrationPerspective: "Flat side view or simple top-down process map.",
    photoJob: "Make the viewer understand today's bread, its texture and the work that shaped it.", photoSubjects: ["one baker at a real task", "hands scoring or bagging", "a loaf torn for crumb", "a customer's meal context without staged joy"], photoEnvironment: ["flour-marked bench", "morning shop window", "cooling rack and paper bags"], photoMoment: "The minute bread changes hands: scored, lifted from a rack, torn or wrapped.", photoComposition: ["close enough to read texture", "eye or bench height", "one human action", "negative space for live batch text", "occasional overhead ingredient view"], camera: "Handheld full-frame or APS-C at bench height, slight natural movement.", lens: "35 mm for place, 50-85 mm for hands and crumb; moderate depth of field.", light: "Soft morning window light with warm practical oven spill; no golden haze filter.", photoPalette: "Oat, ink and crust browns with small kiln-red objects.", grade: "Warm highlights, neutral flour whites, deep but open shadows, restrained saturation.", texture: "Crumb, paper fibres, worn wood and brushed steel remain tactile.",
    motionPrinciple: "Movement follows the daily cycle: stamp, slide, tear, wrap and clear.", motionSignature: ["a batch stamp resolving into live information", "a short paper slide", "a scored line revealing a section", "availability changing without celebration"],
    dataPrinciple: "Batch, allergens, quantities and waste records must remain plain enough to check.", dataColors: "Ink and oat as the base, kiln red for current, butter for attention, never colour alone.",
    representationPrinciple: "Show bakers and customers as ordinary skilled people in a working neighbourhood shop, never as rustic characters.",
    casting: { people: "One person or a small working pair; customers appear only when their action matters.", age: "Adults of varied working ages, roughly 20-70, chosen for the real role.", gender: "Balance a series without assigning baking, ownership or care through gender.", ethnicity: "Everyday local variety can appear through explicit editorial casting, never inference.", ability: "Keep entrances, counters and tasks believable for varied bodies; do not use disability as a story device.", roles: "The person doing the skilled action owns the frame.", wardrobe: "Washed aprons, T-shirts, knitwear and practical shoes; used, clean and credible.", behaviour: "Focused hands, quick exchanges, tasting and checking rather than camera-facing smiles." },
    sensory: { sonicIdentity: "An early shop waking up: paper, crust, tray and low conversation, never a nostalgic café soundtrack.", music: { tempo: "76-98 BPM", rhythm: "light hand percussion with space", harmony: "warm, slightly unresolved, not sentimental", timbre: ["brushed wood", "upright bass fragment", "muted piano", "paper rhythm"], avoid: ["accordion cliché", "whistling advert", "ukulele cheer", "busy café loop"] }, voiceover: { voice: "Close, adult and conversational; regional accent is welcome when genuine.", delivery: "Plain, sensory and lightly dry.", pace: "135-155 words per minute", avoid: ["heritage documentary grandeur", "food-porn whisper", "forced cosiness"] }, soundEffects: { role: "Make daily actions tangible.", palette: ["paper bag fold", "loaf crust tear", "tray set on wood"], avoid: ["exaggerated crunch", "cash-register chime", "audio on hover"] }, silence: "Leave room around the first cut of a loaf and the sentence that names its batch." },
    linkedinJob: "Share a concrete observation about bread, grain, waste or neighbourhood work.",
    openQuestions: [{ id: "packaging-stock", question: "Which paper stock keeps grease readable without adding a plastic lining?", affects: ["/visual/colors", "/rules/legal/assets"], priority: "high" }, { id: "accent-accessibility", question: "Which kiln-red pairings pass at the smallest batch-label size?", affects: ["/visual/colors", "/rules/accessibility"], priority: "medium" }, { id: "local-accent", question: "Should voice work use one recognisable local accent or vary by speaker?", affects: ["/sensory/voiceover"], priority: "low" }]
  },
  {
    id: "northline-repair",
    name: "Northline Repair",
    pronunciation: "north-line repair",
    tagline: "Keep the good gear moving.",
    descriptor: "Outdoor clothing and equipment repair workshop",
    origin: "The fictional northern city of Calder",
    nameMeaning: "Northline is the route where weather, use and repair become visible rather than hidden.",
    oneLine: "Northline Repair keeps trusted outdoor gear in use through visible, documented repairs.",
    promise: "You see the repair, its limits, its material and the test it passed before the item comes back.",
    personality: ["capable", "clear", "resourceful", "steady", "technical", "unsentimental"],
    tension: "Field abrasion and fluorescent workshop marks meet a disciplined technical grid.",
    archetypes: ["repairer", "guide", "custodian of useful objects"],
    belief: "Wear is information. A good repair respects how an object is used instead of pretending damage never happened.",
    opposes: ["disposable upgrade culture", "invisible repair claims", "outdoor hero theatre", "green claims without counts", "safety certainty beyond the test"],
    future: "Repair history becomes a normal part of owning equipment, and products are judged partly by how well they can be maintained.",
    humanRole: "Repair technicians inspect damage, choose a method and explain when replacement is safer.",
    technologyRole: "Technology records materials, repair history and tests; it does not overrule physical inspection.",
    purpose: { why: "Useful equipment should not become waste because one component failed.", mission: "Inspect, repair and document outdoor gear with methods matched to its real use.", vision: "Repairability becomes a visible product quality rather than an afterthought." },
    category: "Outdoor clothing and soft-equipment repair service",
    audience: "People who use outdoor gear regularly, rental teams and small expedition operators",
    need: "A trustworthy decision on what can be repaired, how it will perform and when replacement is the safer choice.",
    difference: "Every job receives a visible repair map, material note and test result instead of a vague 'fixed' label.",
    proof: ["Each fictional repair record names method, material and test.", "The fictional intake flow separates cosmetic, functional and safety-critical damage."],
    alternatives: ["replacement", "manufacturer return", "unrecorded home repair", "general alterations shop"],
    pricePosition: "Priced by inspection, repair class and testing rather than the retail value of the item.",
    offers: [
      { name: "Bench repair", job: "Restore a worn zip, seam, panel or fastening where a defined repair is appropriate.", outcome: "The item returns with a repair map, visible limits and completed test.", proof: ["Fictional repair record and test label."], notFor: ["climbing hardware", "damage that cannot be made safe"] },
      { name: "Fleet record", job: "Track repeat repairs across rental or field equipment.", outcome: "A team sees failure patterns and replacement decisions by item.", proof: ["Fictional item history and reason codes."], notFor: ["automatic safety certification", "inventory work without physical inspection"] }
    ],
    audiences: [
      { id: "gear-owner", name: "Regular gear owner", context: "A trusted jacket or pack has a specific failure but the rest still works.", job: "Know whether repair is sensible and what will remain visible.", barriers: ["unclear price", "fear of losing weather resistance", "long turnaround"], desiredShift: "From 'replace it just in case' to an informed repair or replacement decision.", language: "Name the part, damage, method and limit." },
      { id: "fleet-lead", name: "Rental or field-equipment lead", context: "Many numbered items return with different patterns of wear.", job: "Keep a consistent repair history and retire unsafe gear promptly.", barriers: ["missing records", "subjective descriptions", "pressure to keep everything in service"], desiredShift: "From scattered notes to a visible decision trail.", language: "Operational, countable and explicit about uncertainty." }
    ],
    values: [
      { name: "Inspect before promise", meaning: "The material and use case decide what is possible.", behaviours: ["photograph damage", "name safety limits"], antiBehaviours: ["quote certainty from a blurry image", "accept work outside scope"] },
      { name: "Repair stays visible", meaning: "A repair can look deliberate without pretending to be factory-new.", behaviours: ["choose honest patches", "record the method"], antiBehaviours: ["fake invisible results", "cosmetic cover-up"] },
      { name: "Retire responsibly", meaning: "Keeping gear moving never overrides a safety boundary.", behaviours: ["state no-repair decisions clearly", "separate salvageable parts"], antiBehaviours: ["extend unsafe use", "turn safety into a marketing claim"] }
    ],
    masterMessage: "Show us the failure. We will show you the repair, the test and the limit.",
    messagePillars: [
      { name: "Visible inspection", claim: "Damage is classified before a repair is offered.", proof: ["Fictional intake map"] },
      { name: "Documented method", claim: "Material and construction are recorded.", proof: ["Fictional repair record"] },
      { name: "Known limit", claim: "A no-repair decision is a valid outcome.", proof: ["Fictional safety boundary checklist"] }
    ],
    cta: "Start an inspection",
    secondaryCta: "See repair classes",
    storyPattern: "Begin with the worn part. Classify the failure. Show method and test. End with repair, limit or retirement.",
    voiceTraits: ["clear", "capable", "technical", "calm", "honest", "compact"],
    voiceDimensions: [
      { axis: "specific over reassuring", value: 94, instruction: "Name what was inspected and what remains unknown." },
      { axis: "technical over adventurous", value: 82, instruction: "Use outdoor context only to explain use, not to create hero drama." },
      { axis: "direct over friendly", value: 74, instruction: "Be respectful and short; never soften a safety limit." }
    ],
    register: "Plain international English with precise material and component terms.",
    rhythm: "Short diagnostic statements followed by one explanatory sentence. Use verbs and measured conditions.",
    preferred: ["inspect", "wear", "repair class", "material", "test", "limit", "return to use", "retire", "record"],
    terminology: { damage: "name the failed component", fix: "repair and named method", safe: "passed the stated test, never safe without scope", sustainable: "state the measured material or life-extension fact", customer: "owner, technician or fleet lead" },
    allowedClaims: ["This fictional job passed the test named on its repair record.", "This fictional repair remains intentionally visible.", "Northline Repair may decline work outside its fictional scope."],
    onBrand: ["Zip failure, not jacket failure. Inspection class B. Photos first.", "The patch will show. So will the stitch line and the test it passed.", "This webbing should be retired, not repaired. Here is why."],
    offBrand: ["Adventure further with our game-changing repair solutions.", "We make every item as good as new.", "Sustainability without compromise, guaranteed."],
    visualDirection: "Charcoal technical sheets, repair-tape yellow, ice blue and exposed stitch paths over field-worn material.",
    visualRationale: "The system treats every artifact like a repair record: damage, intervention and test remain visible at the same time.",
    visualKeywords: ["repair map", "field abrasion", "bar tack", "inspection light", "serial label", "tape yellow", "cold blue", "measured utility"],
    visualTension: "Rough worn surfaces and exact vector annotation; cold field light and warm repair-bench focus.",
    accentName: "repair-tape yellow",
    palette: [
      paletteColor("charcoal", "Bench charcoal", "#161C1E", "background", "Technical base", ["dark panels", "wordmark", "inspection UI"]),
      paletteColor("chalk", "Chalk white", "#F4F5EF", "surface", "Readable record", ["documents", "light UI", "reverse labels"]),
      paletteColor("tape", "Repair-tape yellow", "#F2D53C", "primary", "Intervention and active work", ["repair path", "CTA", "selected state"]),
      paletteColor("ice", "Inspection blue", "#8ED8F8", "secondary", "Measured observation", ["dimensions", "information", "focus"]),
      paletteColor("rust", "Field rust", "#A84E35", "warning", "Wear or review", ["warnings", "unresolved inspection"]),
      paletteColor("steel", "Tool steel", "#66757A", "neutral", "Equipment and secondary data", ["rules", "inactive lines", "charts"])
    ],
    pairings: [{ foreground: "#F4F5EF", background: "#161C1E", ratio: 15.6, use: "Primary text on charcoal" }, { foreground: "#161C1E", background: "#F2D53C", ratio: 12.1, use: "Active labels" }, { foreground: "#161C1E", background: "#8ED8F8", ratio: 10.4, use: "Inspection information" }],
    colorUsage: ["Charcoal and chalk carry records.", "Yellow marks intervention, never general decoration.", "Rust means unresolved or worn, never automatic failure."],
    gradients: [{ name: "Inspection sweep", css: "linear-gradient(90deg,#161C1E 0%,#253136 62%,#8ED8F8 100%)", job: "Short scanning transitions in diagnostic media" }],
    typeFamilies: [{ family: "Archivo Black", source: "Google Fonts or bundled WOFF2", weights: [400], licence: "SIL Open Font License 1.1", use: "Compressed technical statements" }, { family: "Source Sans 3", source: "Google Fonts or bundled WOFF2", weights: [400, 600], licence: "SIL Open Font License 1.1", use: "Instructions and UI" }, { family: "IBM Plex Mono", source: "Google Fonts or bundled WOFF2", weights: [400, 500], licence: "SIL Open Font License 1.1", use: "Measurements and repair records" }],
    typeRoles: { display: "Archivo Black 400", heading: "Source Sans 3 600", body: "Source Sans 3 400", mono: "IBM Plex Mono 500" },
    typeRules: ["Use short display lines.", "Set measurements and codes in mono.", "Keep units with their values.", "Use tabular figures in records.", "Do not italicise safety information."],
    logoIdea: "A north-pointing route line interrupted and rejoined by a visible bar-tack stitch.",
    layoutPrinciple: "A layered inspection sheet: object, damage, intervention and decision each have a stable lane.",
    grid: "Twelve columns on desktop, six on tablet and one stacked inspection lane on mobile.",
    density: "Dense where records need comparison, open around decisions and safety limits.",
    composition: ["annotate beside damage, never over it", "keep the repair path in one accent", "align codes and measurements", "reserve a full-width decision band", "make before and after use identical crops"],
    geometry: "Route lines, stitch bars, measurement ticks and clipped label corners.", corners: "0-2 px; clipped 6 px corners may mark inspection cards.", strokes: "1.5 px records, 2 px icons, 3 px repair paths.",
    motifs: ["broken and rejoined line", "bar tack", "measurement tick", "serial plate", "inspection cone"], shapeAvoid: ["mountain badge cliché", "shield promises", "military chevrons", "random tech hexagons"],
    iconJob: "Identify damage class, repair method, test and item status at a glance.", iconMetaphor: "Components and workshop actions drawn like field-manual symbols.", iconStroke: "2 px, square-ended with clear joins.", iconCorners: "Mostly square; small optical relief inside tight joints.",
    illustrationJob: "Explain the relationship between material layers, damage and repair method.", illustrationStyle: "Exploded technical sections with one fluorescent intervention layer.", illustrationPerspective: "Flat orthographic view; no decorative pseudo-3D.",
    photoJob: "Let a viewer inspect damage, material and repair quality before reading the caption.", photoSubjects: ["one technician inspecting", "damaged component before work", "repair in progress", "same component after testing"], photoEnvironment: ["neutral inspection table", "working sewing bench", "credible field context after repair"], photoMoment: "The exact point where damage is classified, stitched, sealed or tested.", photoComposition: ["matched before-and-after angle", "component fills the frame", "hands enter only when doing work", "scale reference without fake ruler text", "negative space for live annotation"], camera: "Stable camera at object or shoulder height; tripod for comparison records.", lens: "50-90 mm with low distortion; enough depth of field to read the failure.", light: "Large neutral inspection source plus warm task light when stitching; no dramatic rim light.", photoPalette: "Charcoal bench, actual material colours, yellow intervention markers and cool inspection light.", grade: "Neutral material colour, restrained contrast and recoverable highlights.", texture: "Abrasion, sealant, thread, weave and tool marks stay sharp and honest.",
    motionPrinciple: "Motion traces inspection and intervention in the order a technician performs them.", motionSignature: ["a route line stopping at damage and continuing after repair", "measurement ticks resolving", "a before/after crop locking into place", "a status plate changing only after test"],
    dataPrinciple: "A repair record must distinguish observation, action, test and decision without relying on colour.", dataColors: "Chalk and charcoal as base, ice for observation, yellow for action, rust for unresolved review.",
    representationPrinciple: "Show technicians and owners as practical decision-makers; outdoor identity comes from use and objects, not heroic demographics.",
    casting: { people: "One technician or owner at a real task; groups only for a fleet handoff.", age: "Adults whose age fits the real role; keep a series varied without signalling authority by age.", gender: "Do not assign technical skill or outdoor experience by gender.", ethnicity: "Choose deliberately across a series without inferring from customer or staff data.", ability: "Show adaptable benches and realistic handling where relevant, without using access as campaign decoration.", roles: "Hands belong to the person performing or receiving the repair.", wardrobe: "Plain work layers, repair apron and used outdoor clothing; no expedition costume.", behaviour: "Inspecting, measuring, sewing, testing and explaining; direct attention to the item." },
    sensory: { sonicIdentity: "Measured workshop mechanics: thread, zip, snap and test tone with field air kept at the edge.", music: { tempo: "84-112 BPM", rhythm: "precise, interrupted patterns", harmony: "spare and slightly tense until the test resolves", timbre: ["dry machine pulse", "muted metal", "short low synth", "field wind texture"], avoid: ["epic outdoor score", "trailer drums", "victory rise", "constant machine loop"] }, voiceover: { voice: "Steady adult voice with clear technical diction.", delivery: "Diagnostic, calm and honest about limits.", pace: "145-165 words per minute", avoid: ["adventure narrator", "military command", "false reassurance"] }, soundEffects: { role: "Confirm real material actions and status.", palette: ["zip test", "sewing machine stop", "fastening snap"], avoid: ["weapon-like impacts", "arcade success", "hover audio"] }, silence: "Use silence before a no-repair decision and after the named test result." },
    linkedinJob: "Share one useful repair observation, material failure pattern or honest no-repair decision.",
    openQuestions: [{ id: "safety-scope", question: "Which product categories require an external safety standard before the fictional service could accept them?", affects: ["/strategy/offers", "/rules/legal/claims"], priority: "blocking" }, { id: "status-language", question: "Which status names remain clearest to both technicians and owners?", affects: ["/verbal/language", "/visual/dataVisualization"], priority: "high" }, { id: "visible-repair-choice", question: "When should a repair deliberately contrast with the original material?", affects: ["/visual/colors", "/visual/photography"], priority: "medium" }]
  },
  {
    id: "quiet-current",
    name: "Quiet Current",
    pronunciation: "quiet current",
    tagline: "Sound that leaves room.",
    descriptor: "Editorial sound and audio post-production studio",
    origin: "The fictional riverside district of Bellweather",
    nameMeaning: "A current can carry a story without announcing itself; quiet names the space left for human attention.",
    oneLine: "Quiet Current shapes documentary and spoken-word sound without polishing away the room it came from.",
    promise: "Speech stays intelligible, place stays present and every edit has a reason.",
    personality: ["attentive", "restrained", "warm", "editorial", "patient", "exact"],
    tension: "Deep night colour and luminous waveform signals held inside calm editorial whitespace.",
    archetypes: ["listener", "editor", "keeper of atmosphere"],
    belief: "Good sound does not call attention to processing; it helps a listener notice voice, place and silence.",
    opposes: ["loudness as quality", "generic emotional scoring", "noise removal that erases place", "constant music beds", "technical language that excludes collaborators"],
    future: "Documentary and spoken-word work treats listening, accessibility and sonic consent as part of editorial craft.",
    humanRole: "Editors make narrative judgements, listen with contributors and decide what a silence means.",
    technologyRole: "Tools reveal, repair and organise audio while editorial responsibility stays with people.",
    purpose: { why: "Stories need sonic clarity without losing the air, distance and texture that make them true to their setting.", mission: "Edit, mix and document spoken-word sound with restraint and a clear editorial trail.", vision: "Careful listening becomes a visible, shareable part of how audio stories are made." },
    category: "Editorial sound, dialogue editing and audio post-production",
    audience: "Independent documentary teams, narrative podcasts and cultural producers",
    need: "Clear, emotionally honest sound with a workflow that non-audio collaborators can review.",
    difference: "Every mix includes a plain-language listening map that explains the role of voice, place, music and silence.",
    proof: ["Each fictional delivery includes a timestamped listening map.", "The fictional review method separates intelligibility, editorial change and technical repair."],
    alternatives: ["general video post-production", "automated one-click cleanup", "music-led trailer mix", "in-house edit without specialist monitoring"],
    pricePosition: "Project-priced by material length, editorial complexity, restoration needs and delivery versions.",
    offers: [
      { name: "Dialogue and place", job: "Make speech intelligible while preserving a believable sense of room and location.", outcome: "The team receives a clean editorial mix, stems and a listening map.", proof: ["Fictional timestamped review record."], notFor: ["secret voice cloning", "changing a contributor's meaning"] },
      { name: "Series sound system", job: "Give recurring episodes a coherent voice, music, loudness and review pattern.", outcome: "Editors work from reusable session, cue and delivery rules.", proof: ["Fictional template and episode audit."], notFor: ["automatic publishing", "licensing music without rights"] }
    ],
    audiences: [
      { id: "documentary-editor", name: "Documentary editor", context: "Picture and story are moving, while location recordings vary widely.", job: "Hear what can be repaired, what should remain and where editorial choices were made.", barriers: ["audio jargon", "late surprises", "fear that cleanup changes authenticity"], desiredShift: "From handing sound over as a black box to making informed listening decisions.", language: "Use timestamps, audible consequences and plain comparisons." },
      { id: "series-producer", name: "Narrative series producer", context: "Several episodes, editors and remote recordings need one coherent listening experience.", job: "Keep voice, music and delivery consistent without flattening each story.", barriers: ["version confusion", "inconsistent remote sound", "music rights"], desiredShift: "From episode-by-episode rescue to a repeatable sound system.", language: "Editorial structure first, technical specification second." }
    ],
    values: [
      { name: "Listen before cleaning", meaning: "Noise can be a problem, a place or a piece of evidence.", behaviours: ["audition in context", "name what removal changes"], antiBehaviours: ["erase atmosphere automatically", "judge from a waveform alone"] },
      { name: "Silence has a job", meaning: "Absence can carry thought, discomfort or transition.", behaviours: ["protect meaningful pauses", "remove gaps only with editorial reason"], antiBehaviours: ["fill every second", "treat pace as dead air"] },
      { name: "Review stays human", meaning: "Collaborators should understand and hear every important decision.", behaviours: ["use timestamped comparisons", "explain technical trade-offs plainly"], antiBehaviours: ["hide behind plugins", "deliver unexplained versions"] }
    ],
    masterMessage: "Let the voice arrive clearly. Keep enough room around it to believe where it came from.",
    messagePillars: [
      { name: "Voice", claim: "Intelligibility comes before sheen.", proof: ["Fictional dialogue review pass"] },
      { name: "Place", claim: "Useful room and location remain audible.", proof: ["Fictional before-and-after listening map"] },
      { name: "Reason", claim: "Major edits are explained in plain language.", proof: ["Fictional timestamped decision notes"] }
    ],
    cta: "Send a listening sample",
    secondaryCta: "Open the review method",
    storyPattern: "Begin with one sound the listener should notice. Reveal what obscures it. Show the editorial choice. End with the space that remains.",
    voiceTraits: ["attentive", "clear", "restrained", "warm", "editorial", "precise"],
    voiceDimensions: [
      { axis: "attentive over assertive", value: 91, instruction: "Describe what can be heard before stating what should change." },
      { axis: "editorial over technical", value: 79, instruction: "Lead with story effect; give the technical method after it." },
      { axis: "warm over polished", value: 70, instruction: "Keep natural cadence and avoid luxury-studio language." }
    ],
    register: "Clear editorial English. Quiet confidence, no studio mystique and no treating collaborators as technically naive.",
    rhythm: "Measured sentences with deliberate space. A short sentence may stand alone when the pause is part of the thought.",
    preferred: ["listen", "room", "voice", "place", "pause", "clear", "edit", "version", "audible"],
    terminology: { cleanup: "dialogue repair or noise reduction with named consequence", ambience: "room or location sound", silence: "pause, gap or room tone by its actual role", client: "editor, producer or contributor", AI: "name the specific tool and retained human decision" },
    allowedClaims: ["This fictional mix follows the stated delivery specification.", "This fictional decision is documented at the named timestamp.", "Quiet Current does not clone a voice without explicit, documented consent in this fictional policy."],
    onBrand: ["At 03:18, the room gets quieter. We kept the chair movement; it tells you the speaker has turned away.", "Clearer speech. Same room.", "There is no music under this answer. It does not need instructions on how to feel."],
    offBrand: ["Immersive sonic excellence that elevates every story.", "Crystal-clear audio, powered by cutting-edge AI.", "We turn content into unforgettable auditory journeys."],
    visualDirection: "Midnight violet, fog-white editorial space and a coral current line that appears only where listening changes.",
    visualRationale: "The system gives silence visible space and treats waveforms as evidence, not decoration.",
    visualKeywords: ["room tone", "editorial margin", "midnight violet", "coral current", "listening map", "soft meter", "tape note", "held silence"],
    visualTension: "Dark acoustic depth and pale paper; continuous audio and sharply edited margins.",
    accentName: "current coral",
    palette: [
      paletteColor("midnight", "Midnight violet", "#171329", "background", "Listening depth", ["studio surfaces", "film backgrounds", "wordmark"]),
      paletteColor("fog", "Room fog", "#F2F1ED", "surface", "Editorial breathing room", ["documents", "light pages", "captions"]),
      paletteColor("coral", "Current coral", "#FF6B62", "primary", "Editorial change", ["active marker", "CTA", "edit point"]),
      paletteColor("lavender", "Monitor lavender", "#B8A7FF", "secondary", "Listening focus", ["selection", "secondary data", "hover focus"]),
      paletteColor("river", "River blue", "#3B6D88", "material", "Place and room", ["location layers", "charts", "quiet panels"]),
      paletteColor("meter", "Meter green", "#8FD4B0", "status", "Within target", ["verified delivery state", "accessible success"])
    ],
    pairings: [{ foreground: "#F2F1ED", background: "#171329", ratio: 15.9, use: "Body text on midnight" }, { foreground: "#171329", background: "#FF6B62", ratio: 6.5, use: "CTA and edit marker" }, { foreground: "#171329", background: "#B8A7FF", ratio: 8.7, use: "Focus state" }],
    colorUsage: ["Midnight and fog carry most surfaces.", "Coral marks an editorial intervention, never generic energy.", "Meter green appears only after a named check passes."],
    gradients: [{ name: "Room falloff", css: "radial-gradient(circle at 38% 42%,#3B6D88 0%,#171329 58%,#0D0B16 100%)", job: "Slow atmospheric depth behind an isolated listening object" }],
    typeFamilies: [{ family: "Space Grotesk", source: "Google Fonts or bundled WOFF2", weights: [500, 600], licence: "SIL Open Font License 1.1", use: "Headlines and navigation" }, { family: "Source Serif 4", source: "Google Fonts or bundled WOFF2", weights: [400, 600], licence: "SIL Open Font License 1.1", use: "Long editorial reading" }, { family: "IBM Plex Mono", source: "Google Fonts or bundled WOFF2", weights: [400, 500], licence: "SIL Open Font License 1.1", use: "Timestamps and delivery data" }],
    typeRoles: { display: "Space Grotesk 600", heading: "Space Grotesk 500", body: "Source Serif 4 400", mono: "IBM Plex Mono 500" },
    typeRules: ["Use sentence case.", "Give long text generous leading.", "Set timestamps and version names in mono.", "Keep line length near 60-70 characters.", "Never stretch type into a fake waveform."],
    logoIdea: "Two quiet parallel lines joined by one shallow current bend; the gap is as important as the stroke.",
    layoutPrinciple: "Editorial margins act as silence; a single current line connects related moments without filling the page.",
    grid: "Eight columns on desktop, four on tablet and one generous reading column on mobile.",
    density: "Low around narrative and listening prompts; compact only in timestamps and delivery lists.",
    composition: ["protect empty margin", "align timestamps to a stable rail", "use one current line per view", "pair waveform detail with plain-language note", "let still images hold longer than expected"],
    geometry: "Long rails, shallow arcs, timestamp ticks and open-ended frames.", corners: "6 px for controls, square frames for evidence, fully rounded only for playheads.", strokes: "1 px rails and waveforms, 2 px icons, 3 px active current.",
    motifs: ["open current line", "room-tone band", "edit bracket", "timestamp rail", "held gap"], shapeAvoid: ["equaliser wallpaper", "neon nightclub waves", "music-note icons", "audio-reactive clutter"],
    iconJob: "Identify listening, edit, comment, version and delivery actions without borrowing consumer-player decoration.", iconMetaphor: "Editorial marks and simple acoustic relationships drawn with open lines.", iconStroke: "1.75 px with round joins and open terminals.", iconCorners: "Quietly rounded, never bubbly.",
    illustrationJob: "Explain voice, place, music and silence as separate but related listening layers.", illustrationStyle: "Sparse editorial diagrams with translucent bands and one coral edit mark.", illustrationPerspective: "Flat timeline or sectional listening map.",
    photoJob: "Show the concentration, place and small physical gestures behind listening and editorial sound.", photoSubjects: ["one editor listening", "a contributor in a real recording context", "hand on a physical control", "room details that remain audible in the story"], photoEnvironment: ["quiet edit room with ordinary equipment", "credible documentary location", "desk with notes and version marks"], photoMoment: "The pause before a decision: listening back, marking a time, or asking to hear it once more.", photoComposition: ["room for stillness", "subject off-centre", "screen content unreadable or replaced with approved real UI", "eye-height or seated shoulder-height camera", "negative space on the listening side"], camera: "Locked or gently handheld at seated height; movement should feel like breathing, not coverage.", lens: "40-65 mm natural perspective; shallow only enough to isolate attention.", light: "Soft side light with monitor spill kept subtle; preserve dark detail.", photoPalette: "Midnight shadows, fog paper, skin kept natural and a single coral object or edit mark.", grade: "Low saturation, open shadows, quiet warm skin and cool room separation.", texture: "Paper notes, acoustic cloth, worn controls and room surfaces remain believable.",
    motionPrinciple: "Movement follows listening: arrive, hold, mark, compare and release.", motionSignature: ["a current line pausing at an edit", "room-tone bands breathing once", "a timestamp resolving after playback stops", "two versions crossfading without a flash"],
    dataPrinciple: "Waveform, loudness and version data must support an audible editorial decision, not imply scientific certainty.", dataColors: "Fog and midnight as base, lavender for selection, coral for change, meter green only for a passed named check.",
    representationPrinciple: "Show contributors, editors and producers as people with editorial agency; listening is an action, not passive ambience.",
    casting: { people: "Usually one listener or a two-person review; larger groups only when collaboration is the actual subject.", age: "Adults across realistic editorial roles and career stages.", gender: "Do not code technical control, sensitivity or authority through gender.", ethnicity: "Choose series casting deliberately and never infer contributor identity from recordings or names.", ability: "Include varied ways of listening and communicating when relevant, with authentic input rather than inspiration framing.", roles: "The contributor retains ownership of their words; the editor is shown making accountable choices.", wardrobe: "Quiet ordinary clothing suited to the actual room or location, without creative-industry costume.", behaviour: "Listening, marking, explaining, recording or sitting with a pause; no headphone dance." },
    sensory: { sonicIdentity: "Near-field clarity with preserved room, short coral edit signals and silence treated as an active layer.", music: { tempo: "56-88 BPM when music is needed", rhythm: "sparse and asymmetrical with long rests", harmony: "open intervals, gentle tension, no automatic emotional resolution", timbre: ["soft bowed texture", "felted key", "room impulse", "low tape-like tone"], avoid: ["constant ambient bed", "inspirational piano", "cinematic swell", "lo-fi beat cliché"] }, voiceover: { voice: "Natural adult voice appropriate to the story; no default prestige accent.", delivery: "Close, thoughtful and unperformed, with complete breaths and meaningful pauses.", pace: "125-150 words per minute", avoid: ["trailer authority", "artificial whisper", "over-cleaned breaths"] }, soundEffects: { role: "Mark editorial state without entering the story world as decoration.", palette: ["soft edit tick", "short tape stop", "subtle version chime"], avoid: ["loud whoosh", "consumer notification copy", "sound on hover"] }, silence: "Silence is authored. Protect it before testimony, after difficult material and wherever a listener needs time rather than instruction." },
    linkedinJob: "Share one specific listening decision and what it changed in a story, without exposing confidential material.",
    openQuestions: [{ id: "consent-language", question: "What exact consent wording should cover restoration and synthetic voice tools?", affects: ["/rules/legal/privacy", "/verbal/claims"], priority: "blocking" }, { id: "delivery-meter", question: "Which delivery standards should meter green represent for each channel?", affects: ["/visual/colors", "/visual/dataVisualization", "/channels/video"], priority: "high" }, { id: "signature-sound", question: "Should the short coral edit signal become an audible brand signature or remain a UI-only cue?", affects: ["/sensory/soundEffects"], priority: "medium" }]
  }
];

const catalog = [
  {
    id: "seez",
    name: "SEEZ",
    kind: "real-reference",
    badge: "Real reference",
    description: "The current SEEZ company and design system, with unresolved owner decisions kept visible.",
    data: "./data/brands/seez/brand-dna.json",
    downloadName: "seez-brand-dna.json",
    displaySample: "WORK\nIN USE.",
    displayFont: "Six Caps",
    starterProfile: "photography",
    starterBrief: "Create an image that shows how a real work process becomes a testable software core."
  },
  ...configs.map((config) => ({
    id: config.id,
    name: config.name,
    kind: "fictional-demo",
    badge: "Fictional demo",
    description: config.descriptor,
    data: `./data/brands/${config.id}/brand-dna.json`,
    downloadName: `${config.id}-brand-dna.json`,
    displaySample: config.id === "rook-and-rye" ? "TODAY'S\nBATCH." : config.id === "northline-repair" ? "REPAIR.\nRECORD." : "LEAVE\nROOM.",
    displayFont: config.typeFamilies[0].family,
    starterProfile: config.id === "northline-repair" ? "icon" : config.id === "quiet-current" ? "linkedin" : "photography",
    starterBrief: config.id === "rook-and-rye"
      ? "Create a photograph for today's rye loaf, from warm rack to a neighbour's hands."
      : config.id === "northline-repair"
        ? "Create an icon and inspection label for a repaired jacket zip that passed its named test."
        : "Write a LinkedIn post about leaving a meaningful room sound in a documentary interview."
  }))
];

await Promise.all(configs.map(async (config) => {
  const directory = new URL(`examples/fictional/${config.id}/`, root);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL("brand-dna.json", directory), `${JSON.stringify(buildDNA(config), null, 2)}\n`);
}));

await writeFile(new URL("examples/catalog.json", root), `${JSON.stringify(catalog, null, 2)}\n`);
process.stdout.write(`Generated ${configs.length} fictional Brand DNA examples and catalog.\n`);
