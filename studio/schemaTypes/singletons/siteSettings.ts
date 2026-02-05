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
