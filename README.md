# MetaVivo Website

Astro frontend + Sanity CMS. All UI components use [Starwind](https://starwind.dev) so the Token Bridge (`src/styles/starwind.css`) can reskin the entire site by swapping CSS variables.

## Quick Start

```bash
# Frontend
npm install
npm run dev          # http://localhost:4321

# Sanity Studio (separate terminal)
cd studio
npm install
npx sanity dev       # http://localhost:3333
```

### Environment

Copy `.env.local.example` or create `.env.local` at the root:

```
PUBLIC_SANITY_PROJECT_ID=z8iaqdht
PUBLIC_SANITY_DATASET=production
STARWIND_LICENSE_KEY=<your key>
```

## Architecture

### Token Bridge

`src/styles/starwind.css` is the single source of truth for the design system. It defines CSS custom properties (`--primary`, `--card`, `--muted`, etc.) consumed by every Starwind component. Replacing this file with a Theme Designer export reskins the site. Never use raw color utilities (`bg-black`, `text-white`) — use token classes instead.

### Page Builder

Every singleton page stores a `modules[]` array in Sanity. `src/components/PageBuilder.astro` switches on each module's `_type` and renders the matching block component from `src/components/blocks/`. Adding a new module type requires:

1. A schema definition in `studio/schemaTypes/modules/`
2. Register it in `studio/schemaTypes/modules/_shared.ts`
3. A block component in `src/components/blocks/`
4. A case in `PageBuilder.astro`

### Singletons

Pages like Homepage, About, Science, etc. are singleton documents in Sanity — one document per type, with a fixed `_id` matching the type name. `studio/structure/index.ts` enforces this in Studio by pinning each singleton to its fixed ID.

### Nav & Footer

Both are driven by the `siteSettings` singleton. `Layout.astro` fetches nav links and footer columns from Sanity and maps them onto the Starwind pro blocks (Navbar2, Footer3).

## Project Layout

```
├── src/
│   ├── components/
│   │   ├── blocks/            # Page Builder block components
│   │   ├── starwind/          # Starwind base primitives (installed)
│   │   ├── starwind-pro/      # Starwind pro blocks (license-gated)
│   │   ├── PageBuilder.astro  # Module → component router
│   │   ├── PortableText.astro # Block-text renderer
│   │   ├── SanityImage.astro  # CLS-safe image with dimension parsing
│   │   └── SchemaOrg.astro    # JSON-LD for news articles
│   ├── layouts/
│   │   └── Layout.astro       # Shell: nav, footer, SEO head
│   ├── lib/
│   │   └── sanity.ts          # Sanity client (env-driven)
│   ├── pages/                 # Astro routes
│   └── styles/
│       ├── global.css         # Tailwind entry + starwind import
│       └── starwind.css       # Token Bridge — the reskin target
├── studio/                    # Sanity Studio (standalone)
│   ├── schemaTypes/
│   │   ├── collections/       # pressItem, pressRelease
│   │   ├── modules/           # Page Builder block schemas
│   │   ├── objects/           # button, navLink, footerColumn
│   │   └── singletons/        # siteSettings + 8 page types
│   └── structure/             # Studio sidebar + singleton enforcement
├── astro.config.mjs
├── components.json            # Starwind registry config
└── package.json
```

## Starwind Pro Blocks in Use

| Pro Block   | Used As          | Wrapping Component          |
|-------------|------------------|-----------------------------|
| hero-03     | Hero             | `blocks/Hero.astro`         |
| feature-02  | TwoColumn        | `blocks/TwoColumn.astro`    |
| feature-04  | CardGrid         | `blocks/CardGrid.astro`     |
| blog-01     | PressFeed        | `blocks/PressFeed.astro`    |
| navbar-02   | Site nav         | `Layout.astro`              |
| footer-03   | Site footer      | `Layout.astro`              |
| cta-03      | CtaBanner        | `blocks/CtaBanner.astro`    |

## Sanity Schema Deployment

Schemas live in `studio/schemaTypes/`. To deploy changes:

```bash
cd studio
npx sanity@latest schema deploy
```

## Content Authoring Order

1. **Site Settings** — nav links, CTA button, footer tagline + columns
2. **Homepage** (or any singleton) — add modules via the Page Builder array
3. **Press Items / Press Releases** — collection documents, appear on `/press` and `/news`
