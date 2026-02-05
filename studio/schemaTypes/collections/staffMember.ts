import { defineType } from 'sanity'

export default defineType({
  name: 'staffMember',
  title: 'Staff Member',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'title', title: 'Job Title', type: 'string' },
    { name: 'bio', title: 'Bio', type: 'text' },
    { name: 'image', title: 'Photo', type: 'image' },
    { name: 'isFounder', title: 'Founder', type: 'boolean', initialValue: false },
    { name: 'isBoardMember', title: 'Board of Directors', type: 'boolean', initialValue: false },
  ],
})
