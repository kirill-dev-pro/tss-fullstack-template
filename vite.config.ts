import { sentryTanstackStart } from '@sentry/tanstackstart-react/vite'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import { nitro } from 'nitro/vite'
import { createLogger, defineConfig } from 'vite'
import { postgres } from 'vite-plugin-neon-new'

dotenv.config()

/** Published deps often reference .map files that are not shipped; Vite SSR still tries to open them. */
function devLoggerOmitBrokenDepSourcemapWarnings() {
  const logger = createLogger()
  const warn = logger.warn.bind(logger)
  logger.warn = (msg, options) => {
    if (
      typeof msg === 'string' &&
      msg.includes('Failed to load source map for ') &&
      (msg.includes('/node_modules/') || msg.includes('\\node_modules\\'))
    ) {
      return
    }
    warn(msg, options)
  }
  return logger
}

export default defineConfig({
  customLogger: devLoggerOmitBrokenDepSourcemapWarnings(),
  ssr: {
    // Force rebundle to fix import_react variable name mismatch
    noExternal: ['@trpc/tanstack-react-query', 'reflect-metadata'],
  },
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 3000,
  },
  plugins: [
    devtools(),
    postgres({
      referrer: 'github:kirill-dev-pro/tanstack-start-boilerplate',
    }),
    tailwindcss(),
    tanstackStart({
      router: {
        routeToken: 'layout',
      },
    }),
    nitro({ preset: 'vercel' }),
    viteReact(),
    sentryTanstackStart({
      org: process.env.VITE_SENTRY_ORG,
      project: process.env.VITE_SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
})
