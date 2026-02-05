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
