import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { structure } from './structure/index'
import { schemaTypes } from './schemaTypes/index'

export default defineConfig({
  name: 'default',
  title: 'MetaVivo',
  projectId: 'z8iaqdht',
  dataset: 'production',
  plugins: [
    structureTool({
      structure,
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
