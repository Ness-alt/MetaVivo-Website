# MetaVivo Website — Skeleton Build Design

**Date:** 2026-02-04
**Phase:** Skeleton (structure + content first, brand skin later)

---

## Objective

Build a fully functional skeleton site driven by Sanity CMS. All singleton pages use a Page Builder pattern so content can be reordered and updated from the CMS without code changes. Brand colors and typography are applied later via a single CSS file swap (the "Token Bridge").

---

## Stack

| Layer | Tool |
|---|---|
| Framework | Astro (SSG) |
| Styling | Tailwind CSS v4 |
| UI Components | Starwind UI (primitives + pro blocks) |
| CMS | Sanity (fresh project) + TypeGen for TS types |
| Portable Text | `astro-portabletext` + custom `PortableText.astro` |
| Images | `@sanity/image-url` + custom `SanityImage.astro` |
| Design | Figma wireframe |
| Theme tokens | Starwind Theme Designer → `src/styles/starwind.css` |

---

## Project Structure

```
metavivo-website/
├── astro.config.mjs              # Astro + Tailwind v4 config
├── src/
│   ├── styles/
│   │   └── starwind.css          # Starwind theme tokens (the "Token Bridge")
│   ├── lib/
│   │   └── sanity.ts             # Sanity client
│   ├── layouts/
│   │   └── Layout.astro          # Nav + Footer wrapping all pages
│   ├── components/
│   │   ├── PageBuilder.astro     # Switchboard — maps module _type → component
│   │   ├── SchemaOrg.astro       # Generates JSON-LD structured data from props
│   │   ├── PortableText.astro    # Renders Sanity Portable Text → Starwind-styled HTML
│   │   ├── SanityImage.astro     # Handles image URL generation, sizing, lazy load (prevents CLS)
│   │   └── blocks/               # All reusable page modules
│   │       ├── Hero.astro
│   │       ├── TextBlock.astro
│   │       ├── TwoColumn.astro
│   │       ├── CardGrid.astro
│   │       ├── ContentWithImage.astro
│   │       ├── PressFeed.astro
│   │       ├── PressReleaseFeed.astro
│   │       └── CtaBanner.astro
│   └── pages/
│       ├── index.astro           # Home — Phase 1 landing page
│       ├── about.astro           # Singleton stub (unpublished until ready)
│       ├── science.astro         # Singleton stub
│       ├── careers.astro         # Singleton stub
│       ├── contact.astro         # Singleton stub
│       ├── press.astro           # Listing page — all pressItems
│       ├── news/
│       │   ├── index.astro       # Listing page — all pressReleases
│       │   └── [slug].astro      # Individual press release page
│       └── [...]                 # Legal pages (termsOfService, privacyPolicy, disclosures)
└── studio/                       # Sanity Studio (fresh project)
    └── schemaTypes/
```

---

## Sanity Schema

### Site Settings (Global Singleton)

A single `siteSettings` document controls everything shared across the site. The marketing team can update nav links, footer columns, and global defaults without code changes.

```
{
  _type: 'siteSettings',
  siteName: string,                 // e.g. "MetaVivo"
  defaultOgImage: image,            // fallback OG image for pages without one
  favicon: image,
  nav: {
    links: [{ label, url }],        // main nav links (About, Science, News, etc.)
    ctaButton: { label, url }       // primary CTA in the nav bar
  },
  footer: {
    tagline: string,                // e.g. "MetaVivo pioneers immune therapies..."
    columns: [                      // each column is a label + list of links
      { heading, links: [{ label, url }] }
    ]
  }
}
```

### Singleton Pages

Each singleton shares the same pattern: a unique `_type`, SEO fields, an `ogImage`, and a `modules` array that drives the Page Builder.

```
{
  _type: 'home' | 'about' | 'science' | 'careers' | 'contact' | ...,
  title: string,            // internal CMS label
  slug: slug,               // URL path (auto-populated from title, editable)
  seoTitle: string,         // optional SEO override
  seoDescription: string,   // optional SEO override
  ogImage: image,           // social share cover image
  modules: [module]         // ordered array — Page Builder content
}
```

### Module Object Types

These are the reusable blocks that live inside the `modules` array. The marketing team adds, removes, and reorders them in Sanity.

| Module `_type` | Fields |
|---|---|
| `hero` | `title`, `subtitle`, `body`, `primaryButton`, `secondaryButton`, `image` |
| `textBlock` | `heading`, `body`, `backgroundImage` (optional) |
| `twoColumn` | `label`, `heading`, `body`, `images[]`, `bulletList[]` |
| `cardGrid` | `heading`, `subtitle`, `cards[]` → each: `title`, `body` |
| `contentWithImage` | `label`, `heading`, `subtitle`, `image` |
| `pressFeed` | `heading`, `limit` (number — pulls latest N from `pressItem`) |
| `pressReleaseFeed` | `heading`, `limit` (number — pulls latest N from `pressRelease`) |
| `ctaBanner` | `heading`, `primaryButton`, `secondaryButton`, `image` |

### Shared Object: Button

Used by `hero`, `ctaBanner`, and any future module that needs a link.

```
{ label: string, url: string, openInNewTab: boolean }
```

### Collection Types

| Type | Fields | Has own page? |
|---|---|---|
| `pressItem` | `publicationLogo`, `headline`, `url`, `summary` (optional) | No — links externally |
| `pressRelease` | `title`, `slug` (auto from title), `body` (portable text), `publishedAt`, `ogImage` | Yes — `/news/[slug]` |

### Listing Pages (`/press`, `/news`)

These are NOT Page Builder pages. They are simple Astro pages that query and list their respective collections. No `modules` array needed.

---

## Data Flow

```
Sanity (CMS)                        Astro (Frontend)
─────────────                       ────────────────
home document          →            pages/index.astro
  └── modules[]                       └── GROQ fetches document + modules
        ├── { _type: 'hero' }           └── passes modules[] to PageBuilder.astro
        ├── { _type: 'textBlock' }            └── switches on _type
        ├── { _type: 'pressFeed' }                  ├── <Hero />
        └── { _type: 'ctaBanner' }                  ├── <TextBlock />
                                                    ├── <PressFeed />  ← secondary query for pressItems
                                                    └── <CtaBanner />
```

**PageBuilder.astro** is the single switchboard. Every singleton page fetches its `modules` array and hands it off here. No page-specific layout logic in Astro.

**`pressFeed` and `pressReleaseFeed`** are the only modules with secondary queries — they fetch the latest N items from their respective collections. All other modules are self-contained.

**Unpublished pages:** Singleton stubs exist in Sanity as drafts. The Astro page returns 404 if the document isn't published. To launch a page, just publish it in Sanity — no code change needed.

---

## Component Patterns

All blocks are props-driven, stateless, and built on Starwind primitives + pro blocks.

| Module | Starwind Approach |
|---|---|
| `hero` | Starwind Hero block — title, subtitle, body, primary + secondary buttons, image |
| `textBlock` | Text layout block — heading + body + optional background image |
| `twoColumn` | Two-column layout block — left: text stack, right: image grid + bullet list |
| `cardGrid` | Card grid block — 3-col row of cards (title + body). Arrow icon on first card per wireframe |
| `contentWithImage` | Content + image block — label, heading, subtitle, full-width image |
| `pressFeed` | Horizontal card list — headline + optional summary + publication logo (right-aligned) |
| `pressReleaseFeed` | Same card pattern as pressFeed, links to `/news/[slug]` |
| `ctaBanner` | CTA block — heading, primary + secondary buttons, image |

### Shared Primitives

- **Button** — two variants: `primary` (filled black) and `secondary` (outlined). Props: `label`, `url`, `openInNewTab`.
- **Image** — wireframe X-pattern placeholders become standard `<img>` tags fed by Sanity image assets. Swapped to real images as content is added.

### Shared Utilities

- **PortableText.astro** — renders Sanity Portable Text JSON into HTML. Maps standard blocks (h2, h3, p, strong, lists) to Starwind-styled primitives. Used by `pressRelease` body and any future rich-text field.
- **SanityImage.astro** — wraps `@sanity/image-url`. Takes a Sanity image asset as input, calculates width/height from metadata, outputs a properly sized `<img>` with `loading="lazy"`. Prevents CLS across all components.

### Global Layout (Nav + Footer)

`Layout.astro` wraps every page. Nav and Footer content is fetched from the `siteSettings` singleton — no hardcoded links.
- **Nav:** Logo (with icon), links from `siteSettings.nav.links`, CTA button from `siteSettings.nav.ctaButton`
- **Footer:** Logo, tagline from `siteSettings.footer.tagline`, link columns from `siteSettings.footer.columns`, copyright (year auto-generated)

---

## SEO & Structured Data

### OG Tags
Every page (singletons + press releases) exposes `ogImage`, `seoTitle`, and `seoDescription` for social sharing.

### Schema.org (JSON-LD)
Generated in `SchemaOrg.astro` from existing Sanity fields — no duplicate CMS fields. For press releases:

```json
{
  "@type": "NewsArticle",
  "headline": "← from title",
  "datePublished": "← from publishedAt",
  "image": "← from ogImage",
  "publisher": { "@type": "Organization", "name": "MetaVivo" },
  "articleBody": "← from body"
}
```

The component is reusable — pass different props for different content types in the future.

---

## Error Handling

- **Sanity query returns null** → page returns 404. Covers unpublished singletons automatically.
- **Missing image** → components render without image. No broken layout. Images are optional at the props level.
- **Empty feed (pressFeed / pressReleaseFeed)** → module does not render. No empty state needed for skeleton phase.

---

## Testing

- No unit tests for skeleton phase — components are thin stateless wrappers around Starwind primitives.
- Manual smoke test: `astro build` passes, all pages resolve, PageBuilder renders each module type at least once.
- Visual regression testing comes at the Brand Injection phase.

---

## Phased Rollout

| Phase | What happens |
|---|---|
| 1 — Skeleton | Build structure. Home landing page is live. All other singletons exist as unpublished drafts in Sanity. In-Studio preview via Sanity Presentation Tool. |
| 2 — Content | Populate Sanity with real content. Publish pages one by one. Add standalone preview route (SSR) for sharing preview links externally. Upgrade Button `url` to a Link object (reference to Sanity doc OR external URL) for internal link integrity. |
| 3 — Brand Skin | Designer delivers Figma brand files. Re-export Starwind theme → overwrite `starwind.css`. 90% of site instantly reskins. |
| 4 — Polish | Screenshot Figma designs into Cursor. Tweak Tailwind classes for pixel-perfect layout. No logic changes. |

---

## Deferred to Phase 2

These were considered for the skeleton but are not blockers. Revisit when content population begins.

- **Link references** — Button `url` is a plain string for skeleton. Phase 2 upgrades to a Link object: choose between a `reference` (to another Sanity document, survives slug changes) or an `externalUrl` string. Prevents broken internal links as content evolves.
- **Standalone preview route** — Sanity's Presentation Tool covers in-Studio preview for skeleton phase. Phase 2 adds an Astro SSR preview API route so draft pages can be shared via a link outside of Studio.
