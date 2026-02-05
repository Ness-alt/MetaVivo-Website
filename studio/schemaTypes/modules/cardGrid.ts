import { defineType } from 'sanity'

export default defineType({
  name: 'cardGrid',
  title: 'Card Grid',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string' },
    { name: 'heading', title: 'Heading', type: 'string' },
    { name: 'subtitle', title: 'Subtitle', type: 'string' },
    {
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'body', title: 'Body', type: 'text' },
          ],
        },
      ],
    },
  ],
})
