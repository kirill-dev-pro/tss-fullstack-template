import postgresPlugin from '@neondatabase/vite-plugin-postgres'
import { sentryTanstackStart } from '@sentry/tanstackstart-react/vite'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'

dotenv.config()

export default defineConfig({
  // optimizeDeps: {
  //   entries: ['src/**/*.tsx', 'src/**/*.ts'],
  //   exclude: ['pdfjs', 'pdf-parse'],
  // },
  ssr: {
    // Force rebundle to fix import_react variable name mismatch
    noExternal: ['@trpc/tanstack-react-query', 'reflect-metadata'],
  },
  server: {
    port: 3000,
  },
  plugins: [
    devtools(),
    viteTsConfigPaths(),
    postgresPlugin({
      // env: ".env.local", // Path to your .env file (default: ".env")
      // envKey: "DATABASE_URL", // Name of the env variable (default: "DATABASE_URL")
    }),
    tailwindcss(),
    tanstackStart({
      router: {
        routeToken: 'layout',
      },
    }),
    nitro(),
    viteReact(),
    sentryTanstackStart({
      org: process.env.VITE_SENTRY_ORG,
      project: process.env.VITE_SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
})
