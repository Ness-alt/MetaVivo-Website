import { defineType } from 'sanity'

export default defineType({
  name: 'pressItem',
  title: 'Press Item',
  type: 'document',
  fields: [
    { name: 'headline', title: 'Headline', type: 'string' },
    { name: 'url', title: 'Article URL', type: 'url' },
    { name: 'publicationLogo', title: 'Publication Logo', type: 'image' },
    { name: 'summary', title: 'Summary (optional)', type: 'text' },
    { name: 'publishedAt', title: 'Published At', type: 'datetime' },
  ],
})
