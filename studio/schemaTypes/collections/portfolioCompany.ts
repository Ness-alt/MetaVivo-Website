import { defineType } from 'sanity'

export default defineType({
  name: 'portfolioCompany',
  title: 'Portfolio Company',
  type: 'document',
  fields: [
    { name: 'companyName', title: 'Company Name', type: 'string' },
    { name: 'technology', title: 'Technology', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'foundingYear', title: 'Founding Year', type: 'number' },
    { name: 'acquisitionYear', title: 'Acquisition Year', type: 'number' },
    { name: 'logo', title: 'Logo', type: 'image' },
    { name: 'featureImage', title: 'Feature Image', type: 'image' },
    { name: 'location', title: 'Location', type: 'string' },
  ],
})
