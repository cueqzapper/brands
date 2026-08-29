# Brand DNA

Brand DNA is an open, evidence-aware brand format and context compiler for
humans, design systems and AI agents.

One `brand-dna.json` can describe the complete brand: strategy, worldview,
voice, colours, logo, layout, iconography, photography, people, motion, sound,
channels, legal constraints, quality rules and the evidence behind each
decision. Since v1.1 the same object also carries a rights-aware inventory of
the physical logo, icon, image, illustration, texture, motion, audio and
template files. A task profile then selects only the relevant parts and turns
them into an exhaustive production brief.

```text
brand-dna.json + icon profile       -> detailed icon prompt
brand-dna.json + linkedin profile   -> detailed writing brief
brand-dna.json + photography profile-> detailed casting/camera/light prompt
```

The complete reference and interactive prompt lab are published at
[cueqzapper.github.io/brands](https://cueqzapper.github.io/brands/).

The reference library contains the real SEEZ draft plus three deliberately
fictional brands: a neighbourhood bakery, an outdoor-gear repair workshop and
an editorial sound studio. Fictional names, domains, organisations, people,
products and evidence are labelled as such and must never be presented as real.

## Why another brand format?

Open formats already cover important parts:

- [Design Tokens](https://www.designtokens.org/tr/2025.10/format/) type visual
  values for tools.
- [brand.yml](https://posit-dev.github.io/brand-yml/) gives Quarto, Python and R
  a portable logo/colour/type source.
- [MRBS](https://github.com/MRBSystem/MRBS-Specification) describes a broad
  machine-readable brand system.

Brand DNA focuses on the missing runtime question: _what is the smallest exact
context an agent needs for this production task?_ It also treats provenance,
confidence and unresolved owner decisions as first-class data.

## Quick start

Requires Node.js 20 or newer.

```bash
npm install
npm test
node src/cli.mjs validate examples/seez/brand-dna.json
node src/cli.mjs compile examples/seez/brand-dna.json \
  --for icon \
  --brief "Create a 24 px icon for an approved handoff"
```

Try a different category with a complete fictional dataset:

```bash
node src/cli.mjs compile examples/fictional/quiet-current/brand-dna.json \
  --for linkedin \
  --brief "Explain why one piece of room sound stayed in a documentary edit"
```

Available commands:

```bash
brand-dna validate brand-dna.json
brand-dna profiles
brand-dna compile brand-dna.json --for photography --brief "..." --locale de-CH
brand-dna compile brand-dna.json --for linkedin --brief "..." --json
brand-dna export brand-dna.json --format brand-yml
brand-dna export brand-dna.json --format tokens-css
```

The compiler treats `meta.defaultLocale` as the source language of the Brand
DNA. If `--locale` is omitted, every packet uses that language automatically.
Requested output languages are accepted only when they are declared in
`meta.locales`; otherwise the compiler falls back to the brand default instead
of silently creating a mixed-language packet. When source and output language
differ, the packet names both and requires a faithful translation of approved
terms, facts, numbers and legal wording.

The interactive reference follows the same rule: SEEZ opens in `de-CH`, while
the fictional bakery, repair workshop and sound studio open in English. The
language selector only shows locales declared by the active Brand DNA.

## Task profiles

The v1.1 distribution includes `icon`, `logo`, `linkedin`, `photography`,
`photo-graphic`, `video`, `brochure`, `advertising`, `website` and
`presentation`.

A profile is plain JSON:

```json
{
  "id": "icon",
  "selectors": [
    "/brand/essence",
    "/visual/colors",
    "/visual/shapes",
    "/visual/iconography",
    "/assets/basePath",
    "/assets/icons",
    "/rules/accessibility"
  ],
  "instructions": ["Begin with the semantic job."],
  "productionChecklist": ["Meaning is clear at 16 px."],
  "outputContract": ["Positive prompt", "Negative prompt", "SVG spec"]
}
```

Selectors are JSON Pointers. Compaction is deterministic and inspectable: a
photography packet cannot accidentally receive LinkedIn cadence, while an icon
packet cannot silently inherit camera or casting rules.

## Physical assets

`visual` describes the rules; `assets` points to the files that may actually
be used. Each file has a role, media type, alternative text, description,
licence, rights statement and lifecycle status. Relative paths resolve against
`assets.basePath`.

```json
{
  "assets": {
    "basePath": "./assets/",
    "logos": [{
      "id": "primary-logo",
      "kind": "logo",
      "path": "logos/primary.svg",
      "mediaType": "image/svg+xml",
      "role": "Primary signature",
      "alt": "Brand name",
      "description": "Approved horizontal signature.",
      "licence": "Brand asset licence",
      "rights": "Use only in approved brand productions.",
      "status": "approved"
    }],
    "icons": [], "photography": [], "illustrations": [], "textures": [],
    "motion": [], "audio": [], "templates": []
  }
}
```

Profiles select only the relevant collections. An icon prompt receives the
approved icon masters and logo reference, a photography prompt receives images
and textures, while a complete website packet can receive the whole manifest.
The repository examples ship the actual files displayed by GitHub Pages.

## Evidence states

Every important decision can be linked to sources and marked as:

- `declared`: stated by an official source;
- `observed`: visible in an implemented asset or behaviour;
- `inferred`: a conservative creative interpretation that still needs review;
- `owner-approved`: explicitly accepted as binding.

Generated Brand DNA should start as `draft`. Never infer sensitive attributes
such as ethnicity, religion, health, sexual orientation or gender identity from
public names, faces, locations or industries. Representation can be explicit,
but it must be a deliberate editorial or owner-approved decision.

## Compatibility

- The root schema uses JSON Schema Draft 2020-12.
- Colour tokens can carry the DTCG `$type: "color"` marker.
- `brand-dna export --format brand-yml` creates a conservative Posit
  `_brand.yml` starting point.
- `brand-dna export --format tokens-css` creates semantic CSS variables.

## Repository map

```text
schema/       Brand DNA JSON Schema
profiles/     context selectors and production contracts
src/          pure compiler, exports and CLI
examples/     real reference plus fictional brands and their physical assets
docs/         GitHub Pages reference and prompt lab
test/         validation and context-isolation tests
```

## Contributing

Proposals are welcome. New fields need a concrete production use case, schema
documentation and at least one compiler or validation test. See
[CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

Code and schema are MIT licensed. Example brand data and brand assets may carry
their own stated rights; do not assume that an open schema makes a trademark or
logo free to reuse.
