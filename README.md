# Brand DNA

Brand DNA is an open, evidence-aware brand format and context compiler for
humans, design systems and AI agents.

One `brand-dna.json` can describe the complete brand: strategy, worldview,
voice, colours, logo, layout, iconography, photography, people, motion, sound,
channels, legal constraints, quality rules and the evidence behind each
decision. A task profile then selects only the relevant parts and turns them
into an exhaustive production brief.

```text
brand-dna.json + icon profile       -> detailed icon prompt
brand-dna.json + linkedin profile   -> detailed writing brief
brand-dna.json + photography profile-> detailed casting/camera/light prompt
```

The complete reference and interactive prompt lab are published at
[cueqzapper.github.io/brands](https://cueqzapper.github.io/brands/).

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

Available commands:

```bash
brand-dna validate brand-dna.json
brand-dna profiles
brand-dna compile brand-dna.json --for photography --brief "..." --locale de-CH
brand-dna compile brand-dna.json --for linkedin --brief "..." --json
brand-dna export brand-dna.json --format brand-yml
brand-dna export brand-dna.json --format tokens-css
```

## Task profiles

The v1 distribution includes `icon`, `logo`, `linkedin`, `photography`,
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
examples/     complete reference brands
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
