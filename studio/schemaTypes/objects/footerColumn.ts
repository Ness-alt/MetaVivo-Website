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
