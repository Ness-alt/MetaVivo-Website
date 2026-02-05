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
