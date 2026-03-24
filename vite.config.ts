import postgresPlugin from '@neondatabase/vite-plugin-postgres'
import { sentryTanstackStart } from '@sentry/tanstackstart-react/vite'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { nitroV2Plugin } from '@tanstack/nitro-v2-vite-plugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import { defineConfig } from 'vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'

dotenv.config()

export default defineConfig({
  // optimizeDeps: {
  //   entries: ['src/**/*.tsx', 'src/**/*.ts'],
  //   exclude: ['pdfjs', 'pdf-parse'],
  // },
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
    nitroV2Plugin({ preset: 'bun' }),
    viteReact(),
    sentryTanstackStart({
      org: process.env.VITE_SENTRY_ORG,
      project: process.env.VITE_SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
})
