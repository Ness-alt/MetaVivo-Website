# MetaVivo Skeleton Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Scaffold a fully functional skeleton MetaVivo website — Astro frontend + Sanity CMS Page Builder, all components built on Starwind UI.

**Architecture:** Astro at root, Sanity Studio in `studio/`. All singleton pages use a shared PageBuilder switchboard. Nav/footer driven by a `siteSettings` singleton. Components are stateless, props-driven, Starwind-based. Brand skin applied later by swapping `starwind.css`.

**Tech Stack:** Astro (SSG), Tailwind CSS v4, Starwind UI (+ pro), Sanity (fresh project), `@sanity/client`, `@sanity/image-url`, `astro-portabletext`, Sanity TypeGen.

**Working directory:** `.worktrees/skeleton` (branch: `feature/skeleton`)

**Reference:** `docs/plans/2026-02-04-metavivo-skeleton-design.md`

**Build verification:** Run `npm run build` after every task. If it fails, stop and fix before proceeding.

---

## Task 1: Scaffold Astro Project

**Files:**
- Created by scaffolder: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`

**Step 1:** Scaffold from worktree root:
```bash
npm create astro@latest -- --template basic-ts --yes
```

**Step 2:** Install core dependencies:
```bash
npm install @sanity/client @sanity/image-url astro-portabletext
npm install -D typescript
```

**Step 3:** Verify:
```bash
npm run build
```
Expected: `dist/` created, build succeeds.

**Step 4:** Commit:
```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/
git commit -m "feat: scaffold Astro project with core dependencies"
```

---

## Task 2: Configure Tailwind v4 + Starwind

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/styles/global.css`
- Create: `src/styles/starwind.css`

**Step 1:** Install Tailwind v4:
```bash
npm install tailwindcss @tailwindcss/vite
```

**Step 2:** Rewrite `astro.config.mjs`:
```ts
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

**Step 3:** Create `src/styles/global.css`:
```css
@import "tailwindcss";
@import "./starwind.css";
```

**Step 4:** Initialize Starwind with Pro support FIRST — this generates the base `starwind.css`. Must run before adding any pro blocks:
```bash
npx starwind@latest init --defaults --pro
```
This creates `src/styles/starwind.css` with default Starwind variables and wires it into your project. Accept all defaults. If it modifies `astro.config.mjs`, that's expected.

**Step 5:** Overwrite `src/styles/starwind.css` with skeleton wireframe tokens. All Starwind components read these variables — this is the Token Bridge. Overwritten entirely at Brand Injection phase with Starwind Theme Designer export:
```css
/* Starwind Theme Tokens — Skeleton (wireframe) */
/* REPLACE THIS ENTIRE FILE with Starwind Theme Designer export at Brand Injection phase */

@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-outline: var(--outline);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: var(--radius);
  --radius-lg: calc(var(--radius) + 4px);
  --radius-xl: calc(var(--radius) + 8px);
  --radius-2xl: calc(var(--radius) + 16px);
  --radius-3xl: calc(var(--radius) + 24px);
  --radius-full: 9999px;
}

@layer base {
  :root {
    /* Neutral wireframe palette — black/white/grays only */
    --background: oklch(1 0 0);                          /* white */
    --foreground: oklch(0.06 0.02 264);                  /* near black */
    --card: oklch(1 0 0);                                /* white */
    --card-foreground: oklch(0.06 0.02 264);             /* near black */
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.06 0.02 264);
    --primary: oklch(0.06 0.02 264);                     /* black — filled buttons */
    --primary-foreground: oklch(1 0 0);                  /* white */
    --secondary: oklch(0.95 0.003 264);                  /* light gray — secondary bg */
    --secondary-foreground: oklch(0.06 0.02 264);       /* black */
    --muted: oklch(0.95 0.003 264);                      /* #f2f2f2 equivalent */
    --muted-foreground: oklch(0.4 0.02 264);             /* mid gray */
    --accent: oklch(0.9 0.003 264);                      /* slightly darker gray */
    --accent-foreground: oklch(0.06 0.02 264);
    --border: oklch(0.06 0.02 264);                      /* black borders (wireframe) */
    --input: oklch(0.85 0.003 264);                      /* light gray inputs */
    --outline: oklch(0.06 0.02 264);
    --radius: 5px;                                       /* matches wireframe border-radius */
  }
}
```

**Step 6:** Verify:
```bash
npm run build
```

**Step 7:** Commit:
```bash
git add -A
git commit -m "feat: configure Tailwind v4 and Starwind theme foundation"
```

---

## Task 3: Create Sanity Studio

**Files:**
- Create: `studio/` (entire Sanity Studio project)

**Step 1:**
```bash
mkdir -p studio && cd studio && npx sanity@latest init --template clean
```
When prompted:
- Create a new project → Yes
- Project name → `metavivo`
- Dataset → `production`

**Note the Project ID printed at the end — needed in Task 9.**

**Step 2:** Verify Studio starts:
```bash
npx sanity start
```
Expected: runs at `http://localhost:3333`. Ctrl+C to stop.

**Step 3:** Commit:
```bash
cd ..
git add studio/
git commit -m "feat: initialize Sanity Studio (fresh project)"
```

---

## Task 4: Sanity Schemas — Shared Object Types

**Files:**
- Create: `studio/schemaTypes/objects/button.ts`
- Create: `studio/schemaTypes/objects/navLink.ts`
- Create: `studio/schemaTypes/objects/footerColumn.ts`
- Modify: `studio/schemaTypes/index.ts` — import and register all three

**button.ts:**
```ts
import { defineType } from 'sanity'

export default defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string' },
    { name: 'url', title: 'URL', type: 'string' },
    { name: 'openInNewTab', title: 'Open in new tab', type: 'boolean', initialValue: false },
  ],
})
```

**navLink.ts:**
```ts
import { defineType } from 'sanity'

export default defineType({
  name: 'navLink',
  title: 'Nav Link',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string' },
    { name: 'url', title: 'URL', type: 'string' },
  ],
})
```

**footerColumn.ts:**
```ts
import { defineType } from 'sanity'

export default defineType({
  name: 'footerColumn',
  title: 'Footer Column',
  type: 'object',
  fields: [
    { name: 'heading', title: 'Heading', type: 'string' },
    { name: 'links', title: 'Links', type: 'array', of: [{ type: 'navLink' }] },
  ],
})
```

**Commit:**
```bash
git add studio/
git commit -m "feat: add shared Sanity object types (button, navLink, footerColumn)"
```

---

## Task 5: Sanity Schema — siteSettings + Structure

**Files:**
- Create: `studio/schemaTypes/singletons/siteSettings.ts`
- Create: `studio/structure/index.ts` (or modify if it exists)
- Modify: `studio/schemaTypes/index.ts`

**siteSettings.ts:**
```ts
import { defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'siteName', title: 'Site Name', type: 'string' },
    { name: 'defaultOgImage', title: 'Default OG Image', type: 'image' },
    { name: 'favicon', title: 'Favicon', type: 'image' },
    {
      name: 'nav',
      title: 'Navigation',
      type: 'object',
      fields: [
        { name: 'links', title: 'Links', type: 'array', of: [{ type: 'navLink' }] },
        { name: 'ctaButton', title: 'CTA Button', type: 'button' },
      ],
    },
    {
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        { name: 'tagline', title: 'Tagline', type: 'string' },
        { name: 'columns', title: 'Link Columns', type: 'array', of: [{ type: 'footerColumn' }] },
      ],
    },
  ],
})
```

**structure/index.ts** — defines sidebar layout and enforces singletons (one document per type, fixed ID):
```ts
import { defineStructure } from 'sanity'

const singletonTypes = [
  'siteSettings',
  'home',
  'about',
  'science',
  'careers',
  'contact',
  'termsOfService',
  'privacyPolicy',
  'disclosures',
]

const singletonLabels: Record<string, string> = {
  siteSettings: 'Site Settings',
  home: 'Homepage',
  about: 'About',
  science: 'Science',
  careers: 'Careers',
  contact: 'Contact',
  termsOfService: 'Terms of Service',
  privacyPolicy: 'Privacy Policy',
  disclosures: 'Disclosures',
}

export const structure = defineStructure((S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem().title('Site Settings').child(
        S.document().documentId('siteSettings').schemaType('siteSettings')
      ),
      S.divider(),
      S.listItem().title('Pages').child(
        S.list().title('Pages').items(
          singletonTypes
            .filter((id) => id !== 'siteSettings')
            .map((id) =>
              S.listItem()
                .title(singletonLabels[id] || id)
                .child(S.document().documentId(id).schemaType(id))
            )
        )
      ),
      S.divider(),
      S.listItem().title('Press').child(
        S.documentTypeList('pressItem').title('Press Items')
      ),
      S.listItem().title('Press Releases').child(
        S.documentTypeList('pressRelease').title('Press Releases')
      ),
    ])
)
```

**Register in `studio/schemaTypes/index.ts`:**
```ts
import siteSettings from './singletons/siteSettings'
// add siteSettings to the exported types array
```

**Register structure in `studio/sanity.config.ts`:**
```ts
import { structure } from './structure/index'
// In plugins array or config, wire the structure
```

**Commit:**
```bash
git add studio/
git commit -m "feat: add siteSettings singleton and custom Studio structure"
```

---

## Task 6: Sanity Schemas — Singleton Page Types

**Files:**
- Create: `studio/schemaTypes/modules/_shared.ts`
- Create: `studio/schemaTypes/singletons/home.ts`
- Create: `studio/schemaTypes/singletons/about.ts`
- Create: `studio/schemaTypes/singletons/science.ts`
- Create: `studio/schemaTypes/singletons/careers.ts`
- Create: `studio/schemaTypes/singletons/contact.ts`
- Create: `studio/schemaTypes/singletons/termsOfService.ts`
- Create: `studio/schemaTypes/singletons/privacyPolicy.ts`
- Create: `studio/schemaTypes/singletons/disclosures.ts`
- Modify: `studio/schemaTypes/index.ts`

**_shared.ts** — the modules array definition, imported by every singleton:
```ts
export const modules = [
  { type: 'hero' },
  { type: 'textBlock' },
  { type: 'twoColumn' },
  { type: 'cardGrid' },
  { type: 'contentWithImage' },
  { type: 'pressFeed' },
  { type: 'pressReleaseFeed' },
  { type: 'ctaBanner' },
]
```

**home.ts** — reference pattern. All other singletons are identical except `name` and `title`:
```ts
import { defineType } from 'sanity'
import { modules } from '../modules/_shared'

export default defineType({
  name: 'home',
  title: 'Homepage',
  type: 'document',
  fields: [
    { name: 'title', title: 'Page Title (internal)', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'seoTitle', title: 'SEO Title', type: 'string' },
    { name: 'seoDescription', title: 'SEO Description', type: 'string' },
    { name: 'ogImage', title: 'OG Image', type: 'image' },
    { name: 'modules', title: 'Page Sections', type: 'array', of: modules },
  ],
})
```

**Remaining singletons** — copy `home.ts`, change only `name` and `title`:

| File | name | title |
|---|---|---|
| about.ts | `about` | `About` |
| science.ts | `science` | `Science` |
| careers.ts | `careers` | `Careers` |
| contact.ts | `contact` | `Contact` |
| termsOfService.ts | `termsOfService` | `Terms of Service` |
| privacyPolicy.ts | `privacyPolicy` | `Privacy Policy` |
| disclosures.ts | `disclosures` | `Disclosures` |

**Register all in `studio/schemaTypes/index.ts`.**

**Commit:**
```bash
git add studio/
git commit -m "feat: add singleton page schemas with shared modules array"
```

---

## Task 7: Sanity Schemas — Module Object Types

**Files:**
- Create: `studio/schemaTypes/modules/hero.ts`
- Create: `studio/schemaTypes/modules/textBlock.ts`
- Create: `studio/schemaTypes/modules/twoColumn.ts`
- Create: `studio/schemaTypes/modules/cardGrid.ts`
- Create: `studio/schemaTypes/modules/contentWithImage.ts`
- Create: `studio/schemaTypes/modules/pressFeed.ts`
- Create: `studio/schemaTypes/modules/pressReleaseFeed.ts`
- Create: `studio/schemaTypes/modules/ctaBanner.ts`
- Modify: `studio/schemaTypes/index.ts`

**hero.ts:**
```ts
import { defineType } from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'subtitle', title: 'Subtitle', type: 'string' },
    { name: 'body', title: 'Body', type: 'text' },
    { name: 'primaryButton', title: 'Primary Button', type: 'button' },
    { name: 'secondaryButton', title: 'Secondary Button', type: 'button' },
    { name: 'image', title: 'Image', type: 'image' },
  ],
})
```

**textBlock.ts:**
```ts
import { defineType } from 'sanity'

export default defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  fields: [
    { name: 'heading', title: 'Heading', type: 'string' },
    { name: 'body', title: 'Body', type: 'text' },
    { name: 'backgroundImage', title: 'Background Image', type: 'image' },
  ],
})
```

**twoColumn.ts:**
```ts
import { defineType } from 'sanity'

export default defineType({
  name: 'twoColumn',
  title: 'Two Column',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string' },
    { name: 'heading', title: 'Heading', type: 'string' },
    { name: 'body', title: 'Body', type: 'text' },
    { name: 'images', title: 'Images', type: 'array', of: [{ type: 'image' }] },
    { name: 'bulletHeading', title: 'Bullet List Heading', type: 'string' },
    { name: 'bulletList', title: 'Bullet Points', type: 'array', of: [{ type: 'string' }] },
  ],
})
```

**cardGrid.ts:**
```ts
import { defineType } from 'sanity'

export default defineType({
  name: 'cardGrid',
  title: 'Card Grid',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string' },
    { name: 'heading', title: 'Heading', type: 'string' },
    { name: 'subtitle', title: 'Subtitle', type: 'string' },
    {
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'body', title: 'Body', type: 'text' },
          ],
        },
      ],
    },
  ],
})
```

**contentWithImage.ts:**
```ts
import { defineType } from 'sanity'

export default defineType({
  name: 'contentWithImage',
  title: 'Content With Image',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string' },
    { name: 'heading', title: 'Heading', type: 'string' },
    { name: 'subtitle', title: 'Subtitle', type: 'text' },
    { name: 'image', title: 'Image', type: 'image' },
  ],
})
```

**pressFeed.ts:**
```ts
import { defineType } from 'sanity'

export default defineType({
  name: 'pressFeed',
  title: 'Press Feed',
  type: 'object',
  fields: [
    { name: 'heading', title: 'Heading', type: 'string' },
    { name: 'limit', title: 'Number of items to show', type: 'number', initialValue: 3 },
  ],
})
```

**pressReleaseFeed.ts:**
```ts
import { defineType } from 'sanity'

export default defineType({
  name: 'pressReleaseFeed',
  title: 'Press Release Feed',
  type: 'object',
  fields: [
    { name: 'heading', title: 'Heading', type: 'string' },
    { name: 'limit', title: 'Number of items to show', type: 'number', initialValue: 3 },
  ],
})
```

**ctaBanner.ts:**
```ts
import { defineType } from 'sanity'

export default defineType({
  name: 'ctaBanner',
  title: 'CTA Banner',
  type: 'object',
  fields: [
    { name: 'heading', title: 'Heading', type: 'string' },
    { name: 'primaryButton', title: 'Primary Button', type: 'button' },
    { name: 'secondaryButton', title: 'Secondary Button', type: 'button' },
    { name: 'image', title: 'Image', type: 'image' },
  ],
})
```

**Register all in `studio/schemaTypes/index.ts`.**

**Commit:**
```bash
git add studio/
git commit -m "feat: add all 8 module object type schemas"
```

---

## Task 8: Sanity Schemas — Collection Types

**Files:**
- Create: `studio/schemaTypes/collections/pressItem.ts`
- Create: `studio/schemaTypes/collections/pressRelease.ts`
- Modify: `studio/schemaTypes/index.ts`

**pressItem.ts:**
```ts
import { defineType } from 'sanity'

export default defineType({
  name: 'pressItem',
  title: 'Press Item',
  type: 'document',
  fields: [
    { name: 'headline', title: 'Headline', type: 'string' },
    { name: 'url', title: 'Article URL', type: 'url' },
    { name: 'publicationLogo', title: 'Publication Logo', type: 'image' },
    { name: 'summary', title: 'Summary (optional)', type: 'text' },
    { name: 'publishedAt', title: 'Published At', type: 'datetime' },
  ],
})
```

**pressRelease.ts:**
```ts
import { defineType } from 'sanity'

export default defineType({
  name: 'pressRelease',
  title: 'Press Release',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] },
    { name: 'publishedAt', title: 'Published At', type: 'datetime' },
    { name: 'ogImage', title: 'OG / Cover Image', type: 'image' },
  ],
})
```

**Register both in `studio/schemaTypes/index.ts`.**

**Commit:**
```bash
git add studio/
git commit -m "feat: add pressItem and pressRelease collection schemas"
```

---

## Task 9: Sanity Client

**Files:**
- Create: `src/lib/sanity.ts`
- Create: `.env.local`

**Step 1:** Create `.env.local` — replace `YOUR_PROJECT_ID` with the ID from Task 3:
```
PUBLIC_SANITY_PROJECT_ID=YOUR_PROJECT_ID
PUBLIC_SANITY_DATASET=production
```

**Step 2:** Create `src/lib/sanity.ts`:
```ts
import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-14',
  useCdn: true,
})
```

**Step 3:** Verify build:
```bash
npm run build
```

**Step 4:** Commit (do NOT commit `.env.local`):
```bash
git add src/lib/sanity.ts
git commit -m "feat: add Sanity client with env-based config"
```

---

## Task 10: Shared Components — SanityImage + PortableText

**Files:**
- Create: `src/components/SanityImage.astro`
- Create: `src/components/PortableText.astro`

**SanityImage.astro:**
```astro
---
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '../lib/sanity'

interface Props {
  image: { asset: { _ref: string }; hotspot?: { x: number; y: number } }
  alt?: string
  class?: string
  width?: number
  height?: number
}

const { image, alt = '', class: className = '', width = 800, height } = Astro.props

const builder = imageUrlBuilder(sanityClient)

// Parse original dimensions from asset ref: image-{hash}-{width}x{height}-{format}
const refParts = image.asset._ref.split('-')
const [origW, origH] = refParts[2]?.split('x').map(Number) || [800, 600]
const aspectRatio = origW / origH
const finalHeight = height || Math.round(width / aspectRatio)

const imgUrl = builder
  .image(image)
  .auto('format')
  .fit('crop')
  .width(width)
  .height(finalHeight)
  .url()
---

{image?.asset && (
  <img src={imgUrl} alt={alt} width={width} height={finalHeight} loading="lazy" class={className} />
)}
```

**PortableText.astro** — custom renderer that maps Portable Text blocks to Tailwind-styled HTML. Handles paragraphs, headings, lists, bold, italic:
```astro
---
interface Props {
  value: any[]
}

const { value = [] } = Astro.props

function renderSpans(children: any[]): string {
  return (children || []).map((child: any) => {
    if (child._type !== 'span') return ''
    let text = child.text
    const marks = child.marks || []
    if (marks.includes('strong')) text = `<strong>${text}</strong>`
    if (marks.includes('em')) text = `<em>${text}</em>`
    return text
  }).join('')
}

function renderBlocks(blocks: any[]): string {
  let html = ''
  let inList = false
  let listTag = ''

  for (const block of blocks) {
    if (block._type !== 'block') continue

    // Close open list if this block is not a list item
    if (inList && !block.listItem) {
      html += `</${listTag}>`
      inList = false
    }

    const content = renderSpans(block.children)

    if (block.listItem) {
      if (!inList) {
        listTag = block.listItem === 'bullet' ? 'ul' : 'ol'
        html += listTag === 'ul' ? '<ul class="list-disc ml-6 mb-4 space-y-1">' : '<ol class="list-decimal ml-6 mb-4 space-y-1">'
        inList = true
      }
      html += `<li class="text-base leading-[1.4]">${content}</li>`
      continue
    }

    const styleMap: Record<string, [string, string]> = {
      h1: ['h1', 'text-4xl font-bold leading-[1.2] mb-4'],
      h2: ['h2', 'text-3xl font-semibold leading-[1.2] mb-3'],
      h3: ['h3', 'text-xl font-semibold leading-[1.2] mb-2'],
      blockquote: ['blockquote', 'border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4'],
      normal: ['p', 'text-base leading-[1.4] mb-4'],
    }

    const [tag, classes] = styleMap[block.style || 'normal'] || styleMap.normal
    html += `<${tag} class="${classes}">${content}</${tag}>`
  }

  if (inList) html += `</${listTag}>`
  return html
}

const rendered = renderBlocks(value)
---

<div class="prose max-w-none">{@html rendered}</div>
```

**Commit:**
```bash
git add src/components/SanityImage.astro src/components/PortableText.astro
git commit -m "feat: add SanityImage and PortableText shared components"
```

---

## Task 11: Layout.astro (navbar-02 + footer-03)

Nav and Footer use Starwind Pro blocks so they consume theme tokens correctly at reskin time.

**Files:**
- Create: `src/layouts/Layout.astro`

**Step 1:** Install the nav and footer pro blocks:
```bash
npx starwind@latest add @starwind-pro/navbar-02 @starwind-pro/footer-03 button sheet separator dropdown collapsible --yes
```
This creates component files in your project (check where `starwind add` places them — typically `src/components/` or a starwind folder). Locate the generated `Navbar02.astro` and `Footer03.astro` files.

**Step 2:** Read the generated navbar and footer components. Understand their prop interfaces — they will have hardcoded demo data that you'll replace with `siteSettings` data from Sanity.

**Step 3:** Create `src/layouts/Layout.astro`. Import the generated Navbar02 and Footer03. Fetch `siteSettings` from Sanity and pass the data as props (or inline into the component if it uses slots/hardcoded arrays — you'll need to adapt based on what `starwind add` generated):

```astro
---
import '../styles/global.css'
import { sanityClient } from '../lib/sanity'
// Import paths will depend on where starwind add placed these files
import Navbar from '../components/Navbar02.astro'
import Footer from '../components/Footer03.astro'

interface Props {
  title?: string
  seoTitle?: string
  seoDescription?: string
  ogImage?: any
}

const { title = 'MetaVivo', seoTitle, seoDescription } = Astro.props

const settings = await sanityClient.fetch(`*[_type == "siteSettings"][0]{
  siteName,
  favicon{ asset->{ url } },
  nav{
    links[]{ label, url },
    ctaButton{ label, url }
  },
  footer{
    tagline,
    columns[]{
      heading,
      links[]{ label, url }
    }
  }
}`)

const pageTitle = seoTitle || title
const year = new Date().getFullYear()
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{pageTitle}</title>
  {seoDescription && <meta name="description" content={seoDescription} />}
  {settings?.favicon?.asset?.url && <link rel="icon" href={settings.favicon.asset.url} />}
</head>
<body class="bg-background text-foreground font-sans min-h-screen flex flex-col">

  <!-- Nav: adapt Navbar02 props/slots to use settings.nav data -->
  <Navbar
    siteName={settings?.siteName || 'MetaVivo'}
    links={settings?.nav?.links || []}
    ctaButton={settings?.nav?.ctaButton}
  />

  <main class="flex-1">
    <slot />
  </main>

  <!-- Footer: adapt Footer03 props/slots to use settings.footer data -->
  <Footer
    tagline={settings?.footer?.tagline}
    columns={settings?.footer?.columns || []}
    copyright={`© ${year} METAVIVO`}
  />

</body>
</html>
```

**Note:** The prop names above (`siteName`, `links`, `ctaButton`, `tagline`, `columns`, `copyright`) are illustrative. After installing the pro blocks in Step 1, read the generated component source to see the actual prop interface, then wire accordingly. The key principle: replace all hardcoded demo data in the Starwind components with data from `siteSettings`.

**Verify + Commit:**
```bash
npm run build
git add src/layouts/Layout.astro src/components/Navbar02.astro src/components/Footer03.astro
git commit -m "feat: add Layout with Starwind navbar-02 and footer-03, CMS-driven"
```

---

## Task 12: PageBuilder.astro

**Files:**
- Create: `src/components/PageBuilder.astro`

```astro
---
import Hero from './blocks/Hero.astro'
import TextBlock from './blocks/TextBlock.astro'
import TwoColumn from './blocks/TwoColumn.astro'
import CardGrid from './blocks/CardGrid.astro'
import ContentWithImage from './blocks/ContentWithImage.astro'
import PressFeed from './blocks/PressFeed.astro'
import PressReleaseFeed from './blocks/PressReleaseFeed.astro'
import CtaBanner from './blocks/CtaBanner.astro'

interface Props {
  modules: any[]
}

const { modules = [] } = Astro.props

const componentMap: Record<string, any> = {
  hero: Hero,
  textBlock: TextBlock,
  twoColumn: TwoColumn,
  cardGrid: CardGrid,
  contentWithImage: ContentWithImage,
  pressFeed: PressFeed,
  pressReleaseFeed: PressReleaseFeed,
  ctaBanner: CtaBanner,
}
---

{modules.map((module: any) => {
  const Component = componentMap[module._type]
  return Component ? <Component {...module} /> : null
})}
```

**Note:** This file will error at build if the block components don't exist yet. Create a placeholder `src/components/blocks/.gitkeep` and commit PageBuilder only after Task 13 is done, OR create stub block files first.

**Commit (after Task 13):**
```bash
git add src/components/PageBuilder.astro
git commit -m "feat: add PageBuilder switchboard component"
```

---

## Task 13: Block Components

**Files:**
- Create all 8 files in `src/components/blocks/`

**CRITICAL:** All components MUST use Starwind pro blocks or Starwind primitives (Button, Card, etc.) — NOT raw Tailwind color classes like `bg-black` or `text-white`. Starwind components consume the CSS variables from `starwind.css` (`--primary`, `--card`, `--border`, `--muted`, etc.). This is what makes the Token Bridge work at reskin time. If you use `bg-black` directly, it won't change when the brand skin is applied.

**Step 0: Install all needed pro blocks + primitives in one go:**
```bash
npx starwind@latest add @starwind-pro/hero-03 @starwind-pro/feature-02 @starwind-pro/feature-04 @starwind-pro/cta-03 @starwind-pro/blog-01 button card badge aspect-ratio image --yes
```

**Starwind block → our module mapping:**

| Our Module | Starwind Pro Block | Customization needed |
|---|---|---|
| Hero | `hero-03` | Replace hardcoded text/image with Sanity props. Keep button components. |
| TextBlock | No pro block — use `Card` primitive with `bg-muted` | Simple layout, no pro block match |
| TwoColumn | `feature-02` | Replace checklist with bullet list, wire Sanity images |
| CardGrid | `feature-04` | Replace icon cards with title+body cards, wire from Sanity `cards[]` |
| ContentWithImage | `feature-02` (reuse, different props) | Label + heading + subtitle + image |
| PressFeed | `blog-01` | Customize card layout to horizontal (headline + logo). Wire secondary GROQ query. |
| PressReleaseFeed | `blog-01` (reuse, different props) | Same card pattern, link to `/news/[slug]` |
| CtaBanner | `cta-03` | Replace hardcoded content with Sanity heading + buttons + image |

**After installing pro blocks in Step 0, read each generated component file to understand its structure before customizing. The generated files are your starting point — modify them, don't rewrite from scratch.**

The per-component code below shows the LOGIC and PROPS each block needs. Wire them into the installed Starwind pro block structure rather than writing plain HTML.

---

### Hero.astro
**Base:** `hero-03` (two-column: text left, image right).

Read the generated `Hero03.astro` file from `starwind add`. Adapt it:
- Replace hardcoded title/description/image with props from Sanity
- Replace hardcoded buttons with Starwind `<Button variant="primary">` and `<Button variant="outline">`
- Replace hardcoded image with `<SanityImage>`
- Section background: use `bg-muted` (maps to `--muted` token) not `bg-gray-100`

Props this component needs to accept:
```ts
interface Props {
  title?: string
  subtitle?: string
  body?: string
  primaryButton?: { label: string; url: string; openInNewTab?: boolean }
  secondaryButton?: { label: string; url: string; openInNewTab?: boolean }
  image?: any  // Sanity image object
}
```

Button pattern (use in Hero, CtaBanner, anywhere buttons appear):
```astro
import Button from '../Button.astro'  // or wherever starwind placed it

{primaryButton && (
  <Button variant="primary" href={primaryButton.url} target={primaryButton.openInNewTab ? '_blank' : undefined}>
    {primaryButton.label}
  </Button>
)}
{secondaryButton && (
  <Button variant="outline" href={secondaryButton.url} target={secondaryButton.openInNewTab ? '_blank' : undefined}>
    {secondaryButton.label}
  </Button>
)}
```

---

### TextBlock.astro
**Base:** No direct pro block match. Use a `<section>` with `bg-muted` (not `bg-gray-100`). Text uses `text-foreground` and `text-muted-foreground` — these map to tokens.

No pro block to install. Write directly but use token-aware classes:
- Background: `bg-muted` (maps to `--muted`)
- Heading color: `text-foreground` (maps to `--foreground`)
- Body color: `text-muted-foreground` (maps to `--muted-foreground`)
- Background image URL built with `@sanity/image-url` (same as SanityImage pattern)

Props:
```ts
interface Props {
  heading?: string
  body?: string
  backgroundImage?: any  // Sanity image object, optional
}
```

---

### TwoColumn.astro
**Base:** `feature-02` (two-column with image + checklist).

Read the generated `Feature02.astro`. Adapt it:
- Left column: label (monospace, `text-muted-foreground`) + heading + body text
- Right column top: 2x2 image grid using `<SanityImage>`, borders use `border-border` (maps to `--border`)
- Right column bottom: bullet heading + bullet list
- Section background: `bg-accent` (maps to `--accent`, a slightly darker neutral)

Props:
```ts
interface Props {
  label?: string
  heading?: string
  body?: string
  images?: any[]         // Sanity image objects, up to 2
  bulletHeading?: string
  bulletList?: string[]
}
```

---

### CardGrid.astro
**Base:** `feature-04` (icon card grid).

Read the generated `Feature04.astro`. Adapt it:
- Replace icon cards with title + body cards
- Each card uses Starwind `<Card>` component — bg is `bg-card`, border is `border-border` (both token-driven)
- First card gets an arrow icon (→) in the top-right corner
- Section background: `bg-muted`
- Label text: `text-muted-foreground` in monospace

Props:
```ts
interface Props {
  label?: string
  heading?: string
  subtitle?: string
  cards?: { title: string; body: string }[]
}
```

---

### ContentWithImage.astro
**Base:** `feature-02` (reuse same pro block, different prop layout).

Adapt the generated `Feature02.astro` into a single-column layout:
- Label + heading + subtitle stacked at top
- Full-width `<SanityImage>` below, border uses `border-border`
- Section background: `bg-accent`

Props:
```ts
interface Props {
  label?: string
  heading?: string
  subtitle?: string
  image?: any  // Sanity image object
}
```

---

### PressFeed.astro
**Base:** `blog-01` (card grid). Customize to horizontal card layout.

This is the only block (besides PressReleaseFeed) that runs a **secondary GROQ query** — it fetches pressItems independently, not from the page's `modules` array.

Read the generated `Blog01.astro`. Adapt each card to horizontal layout:
- Each card is a `<Card>` component (bg: `bg-card`, border: `border-border`, hover: `hover:bg-accent`)
- Card content: headline (`text-card-foreground`) + optional summary (`text-muted-foreground`) on left, publication logo on right
- Cards are `<a>` tags linking externally (`target="_blank"`)
- Section background: `bg-muted`
- Does not render at all if query returns zero items

GROQ query (runs at build time):
```ts
const items = await sanityClient.fetch(
  `*[_type == "pressItem"] | order(_createdAt desc) [0..$limit] {
    headline, url, summary,
    publicationLogo{ asset->{ url } }
  }`,
  { limit: limit - 1 }  // GROQ slice is inclusive, so subtract 1
)
```

Props:
```ts
interface Props {
  heading?: string
  limit?: number  // defaults to 3
}
```

---

### PressReleaseFeed.astro
**Base:** `blog-01` (reuse same pro block pattern as PressFeed).

Identical card structure to PressFeed, but:
- Cards link internally to `/news/[slug]` (no `target="_blank"`)
- Uses `ogImage` on the right instead of publication logo
- Shows `publishedAt` date in `text-muted-foreground`
- Only fetches releases where `publishedAt` is defined

GROQ query:
```ts
const items = await sanityClient.fetch(
  `*[_type == "pressRelease" && defined(publishedAt)] | order(publishedAt desc) [0..$limit] {
    title, "slug": slug.current, publishedAt,
    ogImage{ asset->{ url } }
  }`,
  { limit: limit - 1 }
)
```

Props:
```ts
interface Props {
  heading?: string
  limit?: number  // defaults to 3
}
```

---

### CtaBanner.astro
**Base:** `cta-03` (split layout with image). Exact match to wireframe.

Read the generated `Cta03.astro`. Adapt it:
- Replace hardcoded heading with Sanity prop
- Replace buttons with Starwind `<Button variant="primary">` and `<Button variant="outline">` (same pattern as Hero)
- Replace image with `<SanityImage>`
- Section background: `bg-accent`

Props:
```ts
interface Props {
  heading?: string
  primaryButton?: { label: string; url: string; openInNewTab?: boolean }
  secondaryButton?: { label: string; url: string; openInNewTab?: boolean }
  image?: any  // Sanity image object
}
```

---

**Verify build after all 8 blocks are created:**
```bash
npm run build
```

**Commit:**
```bash
git add src/components/blocks/ src/components/PageBuilder.astro
git commit -m "feat: add all 8 block components and PageBuilder"
```

---

## Task 14: Homepage

**Files:**
- Modify: `src/pages/index.astro`

```astro
---
import Layout from '../layouts/Layout.astro'
import PageBuilder from '../components/PageBuilder.astro'
import { sanityClient } from '../lib/sanity'

const home = await sanityClient.fetch(`*[_type == "home"][0]{
  title,
  seoTitle,
  seoDescription,
  ogImage{ asset->{ url } },
  modules[]{ ... }
}`)
---

<Layout
  title="MetaVivo"
  seoTitle={home?.seoTitle}
  seoDescription={home?.seoDescription}
  ogImage={home?.ogImage}
>
  {home ? (
    <PageBuilder modules={home.modules} />
  ) : (
    <div class="py-24 px-10 text-center">
      <p class="text-lg text-gray-500">Homepage content coming soon.</p>
    </div>
  )}
</Layout>
```

**Verify + Commit:**
```bash
npm run build
git add src/pages/index.astro
git commit -m "feat: wire homepage to Sanity Page Builder"
```

---

## Task 15: Singleton Page Stubs

**Files:**
- Create: `src/pages/about.astro`, `science.astro`, `careers.astro`, `contact.astro`, `terms-of-service.astro`, `privacy-policy.astro`, `disclosures.astro`

Each follows this pattern. Only `_type` and fallback `title` change:

```astro
---
import Layout from '../layouts/Layout.astro'
import PageBuilder from '../components/PageBuilder.astro'
import { sanityClient } from '../lib/sanity'

const page = await sanityClient.fetch(`*[_type == "CHANGE_ME"][0]{
  title,
  seoTitle,
  seoDescription,
  ogImage{ asset->{ url } },
  modules[]{ ... }
}`)

if (!page) {
  Astro.response.status = 404
  Astro.response.statusText = 'Not Found'
}
---

{page ? (
  <Layout title={page.title || 'CHANGE_ME'} seoTitle={page.seoTitle} seoDescription={page.seoDescription}>
    <PageBuilder modules={page.modules} />
  </Layout>
) : (
  <Layout title="Page Not Found">
    <div class="py-24 px-10 text-center">
      <h1 class="text-4xl font-bold mb-4">404</h1>
      <p class="text-gray-500">This page is not yet available.</p>
    </div>
  </Layout>
)}
```

**Per-file substitutions:**

| File | _type | title |
|---|---|---|
| about.astro | `about` | `About` |
| science.astro | `science` | `Science` |
| careers.astro | `careers` | `Careers` |
| contact.astro | `contact` | `Contact` |
| terms-of-service.astro | `termsOfService` | `Terms of Service` |
| privacy-policy.astro | `privacyPolicy` | `Privacy Policy` |
| disclosures.astro | `disclosures` | `Disclosures` |

**Verify + Commit:**
```bash
npm run build
git add src/pages/
git commit -m "feat: add singleton page stubs (404 if unpublished)"
```

---

## Task 16: Collection Pages

**Files:**
- Create: `src/pages/press.astro`
- Create: `src/pages/news/index.astro`
- Create: `src/pages/news/[slug].astro`

**press.astro** — full list of all pressItems:
```astro
---
import Layout from '../layouts/Layout.astro'
import { sanityClient } from '../lib/sanity'

const items = await sanityClient.fetch(`*[_type == "pressItem"] | order(_createdAt desc) {
  headline, url, summary, publishedAt,
  publicationLogo{ asset->{ url } }
}`)
---

<Layout title="Press">
  <div class="max-w-6xl mx-auto py-20 px-10">
    <h1 class="text-5xl font-bold leading-[1.2] tracking-[-0.02em] mb-12">Press</h1>
    <div class="flex flex-col gap-6">
      {items.map((item: any) => (
        <a href={item.url} target="_blank" rel="noopener noreferrer" class="border-2 border-black flex items-center p-4 hover:bg-gray-100 transition-colors">
          <div class="flex-1">
            <h2 class="text-xl leading-[1.2] mb-1">{item.headline}</h2>
            {item.summary && <p class="text-base text-gray-700">{item.summary}</p>}
            {item.publishedAt && <p class="text-sm text-gray-500 mt-1">{new Date(item.publishedAt).toLocaleDateString()}</p>}
          </div>
          {item.publicationLogo?.asset?.url && (
            <div class="ml-6 w-24 flex items-center justify-center">
              <img src={item.publicationLogo.asset.url} alt="Logo" class="max-w-full max-h-12 object-contain" />
            </div>
          )}
        </a>
      ))}
      {items.length === 0 && <p class="text-gray-500">No press items yet.</p>}
    </div>
  </div>
</Layout>
```

**news/index.astro** — full list of all published pressReleases:
```astro
---
import Layout from '../../layouts/Layout.astro'
import { sanityClient } from '../../lib/sanity'

const releases = await sanityClient.fetch(`*[_type == "pressRelease" && defined(publishedAt)] | order(publishedAt desc) {
  title, "slug": slug.current, publishedAt,
  ogImage{ asset->{ url } }
}`)
---

<Layout title="News">
  <div class="max-w-6xl mx-auto py-20 px-10">
    <h1 class="text-5xl font-bold leading-[1.2] tracking-[-0.02em] mb-12">News</h1>
    <div class="flex flex-col gap-6">
      {releases.map((item: any) => (
        <a href={`/news/${item.slug}`} class="border-2 border-black flex items-center p-4 hover:bg-gray-100 transition-colors">
          <div class="flex-1">
            <h2 class="text-xl leading-[1.2] mb-1">{item.title}</h2>
            {item.publishedAt && <p class="text-sm text-gray-500">{new Date(item.publishedAt).toLocaleDateString()}</p>}
          </div>
          {item.ogImage?.asset?.url && (
            <div class="ml-6 w-24">
              <img src={item.ogImage.asset.url} alt={item.title} class="w-full h-16 object-cover" />
            </div>
          )}
        </a>
      ))}
      {releases.length === 0 && <p class="text-gray-500">No press releases yet.</p>}
    </div>
  </div>
</Layout>
```

**news/[slug].astro** — individual press release. Dynamic route. Uses `getStaticPaths` for SSG. Renders PortableText body + SchemaOrg JSON-LD:
```astro
---
import Layout from '../../layouts/Layout.astro'
import PortableText from '../../components/PortableText.astro'
import SchemaOrg from '../../components/SchemaOrg.astro'

export async function getStaticPaths() {
  const { sanityClient } = await import('../../lib/sanity')
  const releases = await sanityClient.fetch(`*[_type == "pressRelease" && defined(slug) && defined(publishedAt)]{
    "slug": slug.current,
    title, body, publishedAt,
    ogImage{ asset->{ url } }
  }`)
  return releases.map((release: any) => ({
    params: { slug: release.slug },
    props: { release },
  }))
}

const { release } = Astro.props
---

<Layout title={release.title} seoTitle={release.title} ogImage={release.ogImage}>
  <SchemaOrg type="NewsArticle" data={release} />
  <article class="max-w-3xl mx-auto py-20 px-10">
    <h1 class="text-5xl font-bold leading-[1.2] tracking-[-0.02em] mb-4">{release.title}</h1>
    {release.publishedAt && (
      <p class="text-sm text-gray-500 mb-12">{new Date(release.publishedAt).toLocaleDateString()}</p>
    )}
    <PortableText value={release.body} />
  </article>
</Layout>
```

**Verify + Commit:**
```bash
npm run build
git add src/pages/press.astro src/pages/news/
git commit -m "feat: add press listing and news collection pages"
```

---

## Task 17: SchemaOrg Component

**Files:**
- Create: `src/components/SchemaOrg.astro`

```astro
---
interface NewsArticleData {
  title: string
  publishedAt?: string
  ogImage?: { asset?: { url?: string } }
}

interface Props {
  type: 'NewsArticle'
  data: NewsArticleData
}

const { type, data } = Astro.props

const schemas: Record<string, object> = {
  NewsArticle: {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: data.title,
    ...(data.publishedAt && { datePublished: data.publishedAt }),
    ...(data.ogImage?.asset?.url && { image: data.ogImage.asset.url }),
    publisher: {
      '@type': 'Organization',
      name: 'MetaVivo',
    },
  },
}

const jsonLd = JSON.stringify(schemas[type] || {})
---

<script type="application/ld+json">{jsonLd}</script>
```

**Commit:**
```bash
git add src/components/SchemaOrg.astro
git commit -m "feat: add SchemaOrg JSON-LD component"
```

---

## Task 18: Smoke Test + Push

**Step 1:** Full build:
```bash
npm run build
```
Expected: zero errors.

**Step 2:** Verify all expected pages exist:
```bash
find dist/ -name "*.html" | sort
```
Expected output includes:
```
dist/index.html
dist/about/index.html
dist/science/index.html
dist/careers/index.html
dist/contact/index.html
dist/terms-of-service/index.html
dist/privacy-policy/index.html
dist/disclosures/index.html
dist/press/index.html
dist/news/index.html
```

**Step 3:** TypeScript check:
```bash
npx astro check
```
Expected: no errors.

**Step 4:** If any fixes needed, commit them. Then push:
```bash
git push -u origin feature/skeleton
```

---

## Checkpoint Summary

| After Task | Milestone |
|---|---|
| 3 | Sanity Studio live, schemas empty |
| 8 | All schemas defined and registered |
| 9 | Frontend can query Sanity |
| 13 | All components exist and compile |
| 14 | Homepage wired end-to-end |
| 15 | All singleton stubs in place |
| 18 | Full skeleton built, tested, pushed |
