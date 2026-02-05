import { defineType } from 'sanity'

export default defineType({
  name: 'pressFeed',
  title: 'Press Feed',
  type: 'object',
  fields: [
    { name: 'heading', title: 'Heading', type: 'string' },
    { name: 'limit', title: 'Number of items to show', type: 'number', initialValue: 3 },
  ],
})
