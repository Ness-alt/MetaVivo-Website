import { defineType } from 'sanity'

export default defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string' },
    { name: 'url', title: 'URL', type: 'string' },
    { name: 'openInNewTab', title: 'Open in new tab', type: 'boolean', initialValue: false },
  ],
})
