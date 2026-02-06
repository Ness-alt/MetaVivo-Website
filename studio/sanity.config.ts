import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { media } from 'sanity-plugin-media'
import { visionTool } from '@sanity/vision'
import { structure } from './structure/index'
import { schemaTypes } from './schemaTypes/index'
import { resolve } from './presentation/resolve'

export default defineConfig({
  name: 'default',
  title: 'MetaVivo',
  projectId: 'z8iaqdht',
  dataset: 'production',
  plugins: [
    structureTool({
      structure,
    }),
    presentationTool({
      resolve,
      previewUrl: 'http://localhost:4321', // Your Astro dev server
    }),
    media(),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
