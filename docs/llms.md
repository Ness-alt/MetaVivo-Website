Sanity Setup & Architecture
This document describes the current Sanity CMS setup and wiring for the MetaVivo skeleton website. Use this reference when developing, refactoring, or seeding content.

1. Project Configuration
Root Configuration:
studio/sanity.config.ts

Project ID: z8iaqdht
Dataset: production
Studio Base Path: / (hosted in studio/ folder)
Frontend URL: http://localhost:4321
Plugins:

structureTool: Custom sidebar navigation (studio/structure/index.ts)
media: Enhanced asset management (grid view, search, tagging)
visionTool: GROQ query playground (dev tool)
presentationTool: Visual editing and live previews (deferred — requires @sanity/visual-editing integration, draft mode API routes, and preview overlay; set up when content exists)

2. Schema Architecture
The schema is defined in
studio/schemaTypes/index.ts
. All type names are consistent between schema definitions, GROQ queries, and the Presentation resolver.

Singletons (One-off pages)
Defined as document types, restricted to a single instance via
studio/structure/index.ts
.

siteSettings: Global site config (nav, footer, favicon, OG defaults)
home: Homepage content
about: About page
science: Science page
careers: Careers page
contact: Contact page
termsOfService: Legal page
privacyPolicy: Legal page
disclosures: Legal page

All singleton pages share these fields: title, slug (with source: 'title'), seoTitle, seoDescription, ogImage, modules[] (Page Builder array).

Collections (Multiple documents)
pressItem: External press mentions (headline, url, publicationLogo, summary, publishedAt). No own page — links externally.
pressRelease: Official press releases (title, slug, body as Portable Text, publishedAt, ogImage). Has own page at /news/[slug].
staffMember: Team member profiles (name, title, bio, image, isFounder, isBoardMember). No frontend page yet.
portfolioCompany: Subsidiary/portfolio entries (companyName, technology, description, logo, featureImage, location). No frontend page yet.

Module Object Types (Page Builder blocks)
These are reusable object types that live inside the modules[] array. The marketing team adds, removes, and reorders them in Sanity.

hero: title, subtitle, body, primaryButton, secondaryButton, image
textBlock: heading, body (Portable Text), backgroundImage (optional)
twoColumn: label, heading, body, images[], bulletHeading, bulletList[]
cardGrid: label, heading, subtitle, cards[] (each: title, body)
contentWithImage: label, heading, subtitle, image
pressFeed: heading, limit (pulls latest N from pressItem)
pressReleaseFeed: heading, limit (pulls latest N from pressRelease)
ctaBanner: heading, primaryButton, secondaryButton, image

Shared Object Types
button: label, url, openInNewTab
navLink: label, url
footerColumn: heading, links[] (array of navLink)

3. Frontend Integration
Client Setup:
src/lib/sanity.ts

Library: @sanity/client
API Version: 2024-01-14
CDN: Enabled (true)
Stega: Not configured (deferred to Phase 2)
Environment Variables:

PUBLIC_SANITY_PROJECT_ID
PUBLIC_SANITY_DATASET

Portable Text Rendering:
src/components/PortableText.astro wraps the astro-portabletext library with custom Starwind-styled component overrides in src/components/portable-text/ (Block, List, ListItem, Link). Used by pressRelease body and textBlock body.

4. Visual Editing & Presentation
Configuration:
studio/presentation/resolve.ts

This file maps Sanity documents to frontend URLs for the Presentation tab in the Studio.

Locations:
home -> /
about -> /about
science -> /science
careers -> /careers
contact -> /contact
termsOfService -> /terms-of-service
privacyPolicy -> /privacy-policy
disclosures -> /disclosures
pressRelease -> /news/{slug}

Note: staffMember, portfolioCompany, and pressItem do not have Presentation mappings because they lack dedicated frontend pages.

5. Token Bridge (Theming)
All Starwind components consume CSS variables from src/styles/starwind.css. The skeleton uses a neutral wireframe palette (black/white/grays in oklch). At Brand Injection phase, this file is replaced wholesale with a Starwind Theme Designer export to reskin the entire site.
