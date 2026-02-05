import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'z8iaqdht',
    dataset: 'production',
  },
  deployment: {
    autoUpdates: true,
  },
})
