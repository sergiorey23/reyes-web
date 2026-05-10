import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from './src/sanity/schemaTypes/index.js'

export default defineConfig({
  name: 'default',
  title: 'Reyes Web CMS',
  projectId: '1arljs9t',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: schema.types,
  },
})
