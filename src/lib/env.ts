import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SERVER_URL: z.url().optional().default('http://localhost:3000'),
    BETTER_AUTH_SECRET: z.string().min(1),
    DATABASE_URL: z.url(),

    RESEND_API_KEY: z.string().optional(),
    RESEND_FROM_EMAIL: z.email().default('noreply@example.com'),

    // Used in instrument.server.mjs
    SENTRY_AUTH_TOKEN: z.string().optional(),
    SENTRY_DSN: z.string().optional(),

    OPENAI_API_KEY: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),
    OPENROUTER_API_KEY: z.string().optional(),

    BOT_TOKEN: z.string().default('SET_YOUR_BOT_TOKEN'),

    /** Bot username without @ — used as the flag that enables the Telegram plugin. */
    TELEGRAM_BOT_USERNAME: z.string().min(1).optional(),
    /** Required only for OIDC / Login Widget flow. Mini App auth works without it. */
    TELEGRAM_OIDC_CLIENT_SECRET: z.string().min(1).optional(),

    /** Optional Google OAuth — GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET enable "Sign in with Google".
     *  Create an OAuth 2.0 Web Client in Google Cloud Console and add
     *  {SERVER_URL}/api/auth/callback/google as an Authorized redirect URI. */
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: 'VITE_',

  shared: {
    VITE_NODE_ENV: z.enum(['development', 'production']).default('development'),
  },

  client: {
    VITE_SENTRY_ORG: z.string().optional(),
    VITE_SENTRY_PROJECT: z.string().optional(),
    /** Public site URL; align with SERVER_URL in production (Better Auth client baseURL). */
    VITE_SERVER_URL: z.url().optional(),
    /** Bot username without @ — used for t.me/<username> links on the frontend. */
    VITE_TELEGRAM_BOT_USERNAME: z.string().optional(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: {
    ...process.env,
    VITE_NODE_ENV: import.meta.env.VITE_NODE_ENV,
    VITE_SERVER_URL: import.meta.env.VITE_SERVER_URL,
    VITE_TELEGRAM_BOT_USERNAME: import.meta.env.VITE_TELEGRAM_BOT_USERNAME,
    TELEGRAM_BOT_USERNAME:
      process.env.TELEGRAM_BOT_USERNAME ??
      import.meta.env.VITE_TELEGRAM_BOT_USERNAME,
    TELEGRAM_OIDC_CLIENT_SECRET: process.env.TELEGRAM_OIDC_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    SERVER_URL:
      process.env.SERVER_URL ||
      // VERCEL_BRANCH_URL is stable per branch (e.g. my-app-git-main-org.vercel.app)
      // — preferred for auth so OAuth redirect URIs don't change every deploy
      (process.env.VERCEL_BRANCH_URL
        ? `https://${process.env.VERCEL_BRANCH_URL}`
        : undefined) ||
      // VERCEL_URL is unique per deployment — use as last-resort Vercel fallback
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : undefined),
  },

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
})
