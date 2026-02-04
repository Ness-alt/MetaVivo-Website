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

**Step 4:** Create `src/styles/starwind.css` — neutral wireframe tokens. Overwritten at Brand Injection phase:
```css
/* Starwind Theme Tokens — Skeleton (wireframe) */
/* Replace entirely with Starwind Theme Designer export at Brand Injection phase */
:root {
  --color-primary: #000000;
  --color-primary-foreground: #ffffff;
  --color-secondary: #ffffff;
  --color-secondary-foreground: #000000;
  --color-background: #ffffff;
  --color-foreground: #000000;
  --color-muted: #f2f2f2;
  --color-muted-foreground: #666666;
  --color-border: #000000;
  --radius: 5px;
}
```

**Step 5:** Initialize Starwind:
```bash
npx starwind init
```
Accept all defaults. If it modifies `astro.config.mjs`, that's expected.

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

## Task 11: Layout.astro

**Files:**
- Create: `src/layouts/Layout.astro`

```astro
---
import '../styles/global.css'
import { sanityClient } from '../lib/sanity'

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
<body class="bg-white text-black font-sans min-h-screen flex flex-col">

  <!-- Nav -->
  <nav class="flex items-center justify-between px-10 h-16 bg-white border-b border-gray-200 shrink-0">
    <a href="/" class="text-xl font-semibold">{settings?.siteName || 'MetaVivo'}</a>
    <div class="flex items-center gap-8">
      {settings?.nav?.links?.map((link: any) => (
        <a href={link.url} class="text-sm hover:underline">{link.label}</a>
      ))}
      {settings?.nav?.ctaButton && (
        <a href={settings.nav.ctaButton.url} class="bg-black text-white text-sm px-5 py-2 rounded-[5px]">
          {settings.nav.ctaButton.label}
        </a>
      )}
    </div>
  </nav>

  <!-- Page Content -->
  <main class="flex-1">
    <slot />
  </main>

  <!-- Footer -->
  <footer class="bg-gray-50 px-10 pt-12 pb-8 border-t border-gray-200 shrink-0">
    <div class="max-w-6xl mx-auto">
      {settings?.footer?.tagline && (
        <p class="text-lg font-semibold max-w-md mb-12">{settings.footer.tagline}</p>
      )}
      <div class="flex justify-between">
        <div class="flex gap-24">
          {settings?.footer?.columns?.map((col: any) => (
            <div>
              <h4 class="font-mono text-sm mb-3">{col.heading}</h4>
              <ul class="space-y-1">
                {col.links?.map((link: any) => (
                  <li><a href={link.url} class="font-mono text-sm hover:underline">{link.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p class="font-mono text-sm mt-12">© {year} METAVIVO</p>
    </div>
  </footer>

</body>
</html>
```

**Commit:**
```bash
git add src/layouts/Layout.astro
git commit -m "feat: add Layout with CMS-driven nav and footer"
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

All components are stateless and props-driven. Use Starwind primitives where available — the Tailwind classes below match the wireframe layout and serve as the skeleton baseline.

---

### Hero.astro
Per wireframe: large title, subtitle, body text, two buttons, image placeholder. Light gray background.

```astro
---
import SanityImage from '../SanityImage.astro'

interface Props {
  title?: string
  subtitle?: string
  body?: string
  primaryButton?: { label: string; url: string; openInNewTab?: boolean }
  secondaryButton?: { label: string; url: string; openInNewTab?: boolean }
  image?: any
}

const { title, subtitle, body, primaryButton, secondaryButton, image } = Astro.props
---

<section class="bg-gray-100 py-24 px-10">
  <div class="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
    <div class="flex-1 max-w-xl">
      {title && <h1 class="text-7xl font-bold leading-[1.2] tracking-[-0.03em] mb-6">{title}</h1>}
      {subtitle && <p class="text-xl font-semibold leading-[1.2] mb-4 max-w-md">{subtitle}</p>}
      {body && <p class="text-base leading-[1.4] text-gray-700 max-w-md mb-8">{body}</p>}
      <div class="flex gap-4">
        {primaryButton && (
          <a href={primaryButton.url} target={primaryButton.openInNewTab ? '_blank' : undefined} class="bg-black text-white px-6 py-3 rounded-[5px] text-lg">
            {primaryButton.label}
          </a>
        )}
        {secondaryButton && (
          <a href={secondaryButton.url} target={secondaryButton.openInNewTab ? '_blank' : undefined} class="border border-black text-black px-6 py-3 rounded-[5px] text-lg">
            {secondaryButton.label}
          </a>
        )}
      </div>
    </div>
    {image && (
      <div class="flex-1">
        <SanityImage image={image} alt={title || ''} width={700} height={500} class="w-full h-auto" />
      </div>
    )}
  </div>
</section>
```

---

### TextBlock.astro
Per wireframe: full-width text. Large bold heading + body. Optional background image.

```astro
---
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '../../lib/sanity'

interface Props {
  heading?: string
  body?: string
  backgroundImage?: any
}

const { heading, body, backgroundImage } = Astro.props

let bgUrl = ''
if (backgroundImage?.asset) {
  bgUrl = imageUrlBuilder(sanityClient).image(backgroundImage).auto('format').fit('crop').width(1440).url()
}
---

<section
  class="py-20 px-10 relative"
  style={bgUrl ? `background-image: url('${bgUrl}'); background-size: cover; background-position: center;` : ''}
>
  <div class="max-w-6xl mx-auto relative z-10">
    {heading && <h2 class="text-5xl font-bold leading-[1.2] tracking-[-0.02em] mb-6 max-w-3xl">{heading}</h2>}
    {body && <p class="text-2xl font-normal leading-[1.2] max-w-3xl text-gray-800">{body}</p>}
  </div>
</section>
```

---

### TwoColumn.astro
Per wireframe: left has label + heading + body. Right has 2 image placeholders (grid) + bullet list with its own heading.

```astro
---
import SanityImage from '../SanityImage.astro'

interface Props {
  label?: string
  heading?: string
  body?: string
  images?: any[]
  bulletHeading?: string
  bulletList?: string[]
}

const { label, heading, body, images = [], bulletHeading, bulletList = [] } = Astro.props
---

<section class="bg-gray-200 py-20 px-10">
  <div class="max-w-6xl mx-auto grid grid-cols-2 gap-16">
    <!-- Left -->
    <div>
      {label && <p class="font-mono text-sm mb-3">{label}</p>}
      {heading && <h2 class="text-2xl font-semibold leading-[1.2] tracking-[-0.02em] mb-4">{heading}</h2>}
      {body && <p class="text-lg leading-[1.2] text-gray-800">{body}</p>}
    </div>
    <!-- Right -->
    <div class="flex flex-col gap-8">
      <div class="grid grid-cols-2 gap-4">
        {images.slice(0, 2).map((img: any) => (
          <SanityImage image={img} alt="" width={350} height={280} class="w-full h-auto border-2 border-black" />
        ))}
      </div>
      {(bulletHeading || bulletList.length > 0) && (
        <div>
          {bulletHeading && <h3 class="text-2xl font-semibold leading-[1.2] mb-3">{bulletHeading}</h3>}
          <ul class="list-disc ml-6 space-y-1">
            {bulletList.map((item: string) => (
              <li class="text-lg leading-[1.2]">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
</section>
```

---

### CardGrid.astro
Per wireframe: label + heading + subtitle at top, 3 cards in a row. First card has an arrow icon.

```astro
---
interface Props {
  label?: string
  heading?: string
  subtitle?: string
  cards?: { title: string; body: string }[]
}

const { label, heading, subtitle, cards = [] } = Astro.props
---

<section class="bg-gray-50 py-20 px-10">
  <div class="max-w-6xl mx-auto">
    {label && <p class="font-mono text-sm mb-2">{label}</p>}
    {heading && <h2 class="text-5xl font-bold leading-[1.2] tracking-[-0.02em] mb-4">{heading}</h2>}
    {subtitle && <p class="text-2xl leading-[1.2] mb-12 max-w-3xl">{subtitle}</p>}
    <div class="grid grid-cols-3 gap-4">
      {cards.map((card: any, i: number) => (
        <div class="border border-black bg-white p-6 relative">
          {i === 0 && <span class="absolute top-4 right-4 text-xl">→</span>}
          <h3 class="text-2xl font-semibold leading-[1.2] mb-4">{card.title}</h3>
          <p class="text-base leading-[1.4]">{card.body}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

### ContentWithImage.astro
Per wireframe: label + heading + subtitle + large image placeholder. Gray background.

```astro
---
import SanityImage from '../SanityImage.astro'

interface Props {
  label?: string
  heading?: string
  subtitle?: string
  image?: any
}

const { label, heading, subtitle, image } = Astro.props
---

<section class="bg-gray-200 py-20 px-10">
  <div class="max-w-6xl mx-auto">
    {label && <p class="font-mono text-sm mb-3">{label}</p>}
    {heading && <h2 class="text-5xl font-bold leading-[1.2] tracking-[-0.02em] mb-4">{heading}</h2>}
    {subtitle && <p class="text-2xl leading-[1.2] mb-12 max-w-3xl">{subtitle}</p>}
    {image && (
      <SanityImage image={image} alt={heading || ''} width={1200} height={600} class="w-full h-auto border-2 border-black" />
    )}
  </div>
</section>
```

---

### PressFeed.astro
Runs a secondary GROQ query to fetch the latest N `pressItem` documents. Per wireframe: horizontal cards — headline + optional summary + publication logo on the right. Does not render if no items exist.

```astro
---
import { sanityClient } from '../../lib/sanity'

interface Props {
  heading?: string
  limit?: number
}

const { heading, limit = 3 } = Astro.props

const items = await sanityClient.fetch(
  `*[_type == "pressItem"] | order(_createdAt desc) [0..$limit] {
    headline, url, summary,
    publicationLogo{ asset->{ url } }
  }`,
  { limit: limit - 1 }
)
---

{items.length > 0 && (
  <section class="bg-gray-50 py-20 px-10">
    <div class="max-w-6xl mx-auto">
      {heading && <h2 class="text-5xl font-bold leading-[1.2] tracking-[-0.02em] mb-12">{heading}</h2>}
      <div class="flex flex-col gap-6">
        {items.map((item: any) => (
          <a href={item.url} target="_blank" rel="noopener noreferrer" class="border-2 border-black flex items-center p-4 hover:bg-gray-100 transition-colors">
            <div class="flex-1">
              <h3 class="text-xl leading-[1.2] mb-1">{item.headline}</h3>
              {item.summary && <p class="text-base leading-[1.2] text-gray-700">{item.summary}</p>}
            </div>
            {item.publicationLogo?.asset?.url && (
              <div class="ml-6 w-24 flex items-center justify-center">
                <img src={item.publicationLogo.asset.url} alt="Publication logo" class="max-w-full max-h-12 object-contain" />
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  </section>
)}
```

---

### PressReleaseFeed.astro
Same card pattern as PressFeed. Links internally to `/news/[slug]`. Uses `ogImage` instead of publication logo. Only shows published releases (those with `publishedAt` set).

```astro
---
import { sanityClient } from '../../lib/sanity'

interface Props {
  heading?: string
  limit?: number
}

const { heading, limit = 3 } = Astro.props

const items = await sanityClient.fetch(
  `*[_type == "pressRelease" && defined(publishedAt)] | order(publishedAt desc) [0..$limit] {
    title, "slug": slug.current, publishedAt,
    ogImage{ asset->{ url } }
  }`,
  { limit: limit - 1 }
)
---

{items.length > 0 && (
  <section class="bg-gray-50 py-20 px-10">
    <div class="max-w-6xl mx-auto">
      {heading && <h2 class="text-5xl font-bold leading-[1.2] tracking-[-0.02em] mb-12">{heading}</h2>}
      <div class="flex flex-col gap-6">
        {items.map((item: any) => (
          <a href={`/news/${item.slug}`} class="border-2 border-black flex items-center p-4 hover:bg-gray-100 transition-colors">
            <div class="flex-1">
              <h3 class="text-xl leading-[1.2] mb-1">{item.title}</h3>
              {item.publishedAt && <p class="text-sm text-gray-500">{new Date(item.publishedAt).toLocaleDateString()}</p>}
            </div>
            {item.ogImage?.asset?.url && (
              <div class="ml-6 w-24">
                <img src={item.ogImage.asset.url} alt={item.title} class="w-full h-16 object-cover" />
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  </section>
)}
```

---

### CtaBanner.astro
Per wireframe: heading + two buttons + image placeholder. Gray background. Same button pattern as Hero.

```astro
---
import SanityImage from '../SanityImage.astro'

interface Props {
  heading?: string
  primaryButton?: { label: string; url: string; openInNewTab?: boolean }
  secondaryButton?: { label: string; url: string; openInNewTab?: boolean }
  image?: any
}

const { heading, primaryButton, secondaryButton, image } = Astro.props
---

<section class="bg-gray-200 py-24 px-10">
  <div class="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
    <div class="flex-1">
      {heading && <h2 class="text-5xl font-bold leading-[1.2] tracking-[-0.02em] mb-8">{heading}</h2>}
      <div class="flex gap-4">
        {primaryButton && (
          <a href={primaryButton.url} target={primaryButton.openInNewTab ? '_blank' : undefined} class="bg-black text-white px-6 py-3 rounded-[5px] text-lg">
            {primaryButton.label}
          </a>
        )}
        {secondaryButton && (
          <a href={secondaryButton.url} target={secondaryButton.openInNewTab ? '_blank' : undefined} class="border border-black text-black px-6 py-3 rounded-[5px] text-lg">
            {secondaryButton.label}
          </a>
        )}
      </div>
    </div>
    {image && (
      <div class="flex-1">
        <SanityImage image={image} alt="" width={700} height={500} class="w-full h-auto border-2 border-black" />
      </div>
    )}
  </div>
</section>
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
