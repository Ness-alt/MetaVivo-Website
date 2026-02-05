import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/plugins/structure'
import { structure } from './structure/index'
import { schemaTypes } from './schemaTypes/index'

export default defineConfig({
  name: 'default',
  title: 'MetaVivo',
  projectId: 'YOUR_PROJECT_ID', // TODO: Replace with real ID
  dataset: 'production',
  plugins: [
    structureTool({
      structure,
    }),
  ],
  schema: {
    types: schemaTypes,
  },
})
