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
