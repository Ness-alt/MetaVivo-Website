# CLAUDE.md — MetaVivo Skeleton

## Project State

Astro + Sanity skeleton is built and deployed. Schemas are live on Sanity project `z8iaqdht` / `production`. Frontend builds clean (10 pages). All pages currently show fallbacks because no content has been authored yet.

**Next step:** Seed placeholder content via Sanity API or Studio. Start with `siteSettings`, then singleton pages, then press collections.

## Sanity Field Conventions

These don't match the Starwind prop names — the mappings exist in Layout.astro and the block wrappers:

| Sanity schema field | Maps to (component prop) |
|---------------------|--------------------------|
| `nav.links[].url`   | Navbar2 `links[].href`   |
| `nav.ctaButton.url` | Navbar2 `ctaHref`        |
| `footer.columns[].heading` | Footer3 `columns[].title` |
| `footer.columns[].links[].url` | Footer3 `columns[].links[].href` |
| `ctaBanner.primaryButton.label` | Cta3 `primaryButton.text` |
| `ctaBanner.primaryButton.url`   | Cta3 `primaryButton.href` |

All singleton pages share these fields: `title`, `slug` (with `source: 'title'`), `seoTitle`, `seoDescription`, `ogImage`, `modules[]`.

## Page Builder Modules

Each singleton's `modules[]` array accepts these types (defined in `studio/schemaTypes/modules/_shared.ts`):

| `_type`              | Block component                  | Key fields |
|----------------------|----------------------------------|------------|
| `hero`               | `blocks/Hero.astro` → Hero3      | `heading`, `subheading`, `image` |
| `textBlock`          | `blocks/TextBlock.astro`         | `heading`, `body` (block[]), `backgroundImage` |
| `twoColumn`          | `blocks/TwoColumn.astro`         | `label`, `heading`, `body`, `images[]`, `bulletHeading`, `bulletList[]` |
| `cardGrid`           | `blocks/CardGrid.astro`          | `label`, `heading`, `subtitle`, `cards[]` (inline objects with title, description, icon) |
| `contentWithImage`   | `blocks/ContentWithImage.astro`  | `label`, `heading`, `subtitle`, `image` |
| `pressFeed`          | `blocks/PressFeed.astro`         | `heading`, `limit` — runs own GROQ query |
| `pressReleaseFeed`   | `blocks/PressReleaseFeed.astro`  | `heading`, `limit` — runs own GROQ query |
| `ctaBanner`          | `blocks/CtaBanner.astro` → Cta3  | `heading`, `primaryButton`, `secondaryButton`, `image` |

## Gotchas Already Hit

- **`modules` can be `null`** — Sanity returns explicit `null` for empty arrays, not `undefined`. `PageBuilder.astro` uses `const safeModules = modules || []` to handle this.
- **`defineStructure` does not exist in Sanity v5** — `structure/index.ts` exports a plain `(S) => ...` arrow function, passed to `structureTool({ structure })`.
- **Starwind pro blocks need `STARWIND_LICENSE_KEY`** in the shell env at install time. Already installed; key is in `.env.local`.
- **Footer3 has hardcoded bottom links** — we patched `/privacy` → `/privacy-policy` and `/terms` → `/terms-of-service` directly in the pro block file.
- **`@sanity/image-url` builder** — images come from Sanity as `{ asset: { _ref: "image-..." } }`. Build URLs with `imageUrlBuilder(sanityClient).image(sanityImageProp).auto('format').fit('crop').width(N).url()`.

## Starwind Pro Blocks — Prop Quick Reference

**Navbar2** (`starwind-pro/navbar-02/Navbar2.astro`)
```ts
siteName?: string
links?: { label: string; href?: string; children?: NavLink[] }[]
ctaText?: string
ctaHref?: string
secondaryText?: string
secondaryHref?: string
```

**Footer3** (`starwind-pro/footer-03/Footer3.astro`)
```ts
companyName?: string
description?: string
logoIcon?: any          // SVG component, default is stack-2
columns?: { title: string; links: { label: string; href: string }[] }[]
socialLinks?: { name: string; href: string; icon: any }[]
```

**Cta3** (`starwind-pro/cta-03/Cta3.astro`)
```ts
badge?: string
title?: string
description?: string
image?: { src: string; alt: string }
primaryButton?: { text: string; href: string }
secondaryButton?: { text: string; href: string }
```

**Hero3** (`starwind-pro/hero-03/Hero3.astro`)
```ts
heading?: string
subheading?: string
image?: { src: string; alt: string }
primaryButton?: { text: string; href: string }
secondaryButton?: { text: string; href: string }
```

## Key File Locations

| What | Where |
|------|-------|
| Sanity client | `src/lib/sanity.ts` |
| Token Bridge (reskin target) | `src/styles/starwind.css` |
| Layout shell (nav + footer) | `src/layouts/Layout.astro` |
| Module router | `src/components/PageBuilder.astro` |
| Schema index | `studio/schemaTypes/index.ts` |
| Studio structure | `studio/structure/index.ts` |
| Env vars | `.env.local` (gitignored) |
