import { defineType } from 'sanity'
import { modules } from '../modules/_shared'

export default defineType({
  name: 'disclosures',
  title: 'Disclosures',
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
