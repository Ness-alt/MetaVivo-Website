Sanity Setup & Architecture
This document describes the current Sanity CMS setup and wiring for the MetaV-astro project. Use this reference when refactoring or migrating the application.

1. Project Configuration
Root Configuration:
studio/sanity.config.ts

Project ID: 2blo63wh
Dataset: production
Studio Base Path: / (implied, hosted in studio folder)
Frontend URL: http://localhost:4321 (used for Presentation Tool)
Plugins:

structureTool: Custom structure defined in
studio/structure/index.ts
visionTool: For GROQ playground
codeInput: For code blocks in Portable Text
presentationTool: For Visual Editing and live previews

2. Schema Architecture
The schema is defined in
studio/schemaTypes/index.ts
. Be aware of potential naming mismatches in the current codebase (see "Known Issues" below).

Singletons (One-off pages)
Defined as document types but restricted to a single instance via
studio/structure/index.ts
.

home: Homepage content
about: About page
team: Team landing page
science: Science page
careers: Careers page
contact: Contact page
termsOfService: Legal page
privacyPolicy: Legal page
disclosures: Legal page
Collections (Multiple documents)
teamMember: Individual team member profiles
newsArticle: News items/press mentions
pressRelease: Official press releases
blogPost: Blog articles (Note: Schema name is blogPost, but some code references blog)
portfolioCompany: Portfolio entries
Object Types (Reusable components)
hero: Hero section component
features: Feature grid/list component
logos: Logo grid component
cta: Call to action component
3. Frontend Integration
Client Setup:
src/lib/sanity.ts

Library: @sanity/client
API Version: 2024-01-14
CDN: Disabled (false) by default
Stega: Enabled for http://localhost:3333 (Studio URL)
Environment Variables:

PUBLIC_SANITY_PROJECT_ID: (Fallback: 2blo63wh)
PUBLIC_SANITY_DATASET: (Fallback: production)
4. Visual Editing & Presentation
Configuration:
studio/presentation/resolve.ts

This file maps Sanity documents to frontend URLs for the "Presentation" tab in the Studio.

Locations:
home -> /
blog -> /blog/:slug
news -> /news/:slug
portfolio -> /portfolio/:slug
5. Known Issues / Anomalies
Critical: There appears to be a mismatch between the schema names and the Presentation tool configuration.

Schema Name vs. Reference:
The schema defines blogPost, but
resolve.ts
 filters for _type == "blog".
The schema defines newsArticle, but
resolve.ts
 filters for _type == "news".
The schema defines portfolioCompany, but
resolve.ts
 filters for _type == "portfolio".
Recommendation for clean slate: Ensure that the schema name property exactly matches the _type used in your GROQ queries and Presentation tool configuration. Standardize on either the verbose names (blogPost) or the short names (blog).