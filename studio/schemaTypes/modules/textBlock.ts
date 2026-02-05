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
