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
