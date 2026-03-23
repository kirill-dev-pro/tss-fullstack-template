import { defineConfig } from 'drizzle-kit'

import { env } from '@/lib/env'

export default defineConfig({
  schema: './src/lib/db/schema',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
