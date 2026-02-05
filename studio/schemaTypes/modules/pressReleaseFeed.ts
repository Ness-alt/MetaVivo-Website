import { defineType } from 'sanity'

export default defineType({
  name: 'pressReleaseFeed',
  title: 'Press Release Feed',
  type: 'object',
  fields: [
    { name: 'heading', title: 'Heading', type: 'string' },
    { name: 'limit', title: 'Number of items to show', type: 'number', initialValue: 3 },
  ],
})
