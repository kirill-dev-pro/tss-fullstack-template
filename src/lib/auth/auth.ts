import { passkey } from '@better-auth/passkey'
import { betterAuth } from 'better-auth'
import { telegram } from 'better-auth-telegram'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import {
  admin,
  magicLink,
  mcp,
  openAPI,
  organization,
} from 'better-auth/plugins'
import { emailOTP } from 'better-auth/plugins/email-otp'
import { twoFactor } from 'better-auth/plugins/two-factor'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { decodeJwt } from 'jose'

import ResetPasswordEmail from '@/components/emails/reset-password-email'
import SendMagicLinkEmail from '@/components/emails/send-magic-link-email'
import SendVerificationOtp from '@/components/emails/send-verification-otp'
import VerifyEmail from '@/components/emails/verify-email'
import WelcomeEmail from '@/components/emails/welcome-email'
import { isPlaceholderEmail } from '@/lib/auth/onboarding-guards'
import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema/auth'
import { sendEmail } from '@/lib/resend'

import { env } from '../env'
import {
  ac,
  admin as adminRole,
  superadmin as superAdminRole,
  user as userRole,
} from './permissions'

export const TELEGRAM_OIDC_PROVIDER_ID = 'telegram-oidc'

const botUsername = env.TELEGRAM_BOT_USERNAME

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  secret: env.BETTER_AUTH_SECRET,
  basePath: '/api/auth',
  baseURL: env.SERVER_URL,
  trustedOrigins: [
    env.SERVER_URL,
    // Trust both Vercel system URLs so auth works from any preview URL,
    // even when the browser hits the deployment-unique URL instead of the branch URL.
    ...(process.env.VERCEL_BRANCH_URL
      ? [`https://${process.env.VERCEL_BRANCH_URL}`]
      : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    // Production hostname (e.g. *.vercel.app) often differs from VERCEL_URL per deploy.
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
  ],
  onAPIError: {
    throw: true,
    onError: (error) => {
      console.error('auth onAPIError', error)
    },
    errorURL: '/login',
  },
  rateLimit: {
    enabled: true,
    max: 100,
    window: 10,
    customRules: {
      '/email-otp/send-verification-otp': { max: 1, window: 15 },
    },
  },
  account: {
    accountLinking: {
      /** Telegram OIDC creates accounts with synthetic tg_*@telegram.local emails that differ from the user's real email. */
      allowDifferentEmails: true,
      trustedProviders: [TELEGRAM_OIDC_PROVIDER_ID],
      allowUnlinkingAll: true,
    },
  },
  user: {
    additionalFields: {
      banned: {
        type: 'boolean',
        default: false,
      },
      banReason: {
        type: 'string',
      },
      banExpires: {
        type: 'date',
      },
    },
    deleteUser: {
      enabled: true,
    },
    changeEmail: {
      enabled: true,
      /** Allow users with placeholder Telegram/passkey emails to set a real email without verification. */
      updateEmailWithoutVerification: true,
    },
  },
  logger: {
    enabled: true,
    level: 'info',
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (user.email && isPlaceholderEmail(user.email)) {
            return
          }
          await sendEmail({
            subject: 'Welcome to MyApp',
            template: WelcomeEmail({
              username: user.name || user.email,
            }),
            to: user.email,
          })
        },
      },
    },
    account: {
      create: {
        after: async (account, ctx) => {
          if (account.providerId !== TELEGRAM_OIDC_PROVIDER_ID) return
          if (!account.idToken || !ctx) return
          let claims: Record<string, unknown>
          try {
            claims = decodeJwt(account.idToken)
          } catch {
            return
          }
          const telegramId = claims.id
          if (!telegramId) return
          await ctx.context.internalAdapter.updateUser(account.userId, {
            telegramId,
            telegramUsername: claims.preferred_username,
            telegramPhoneNumber: claims.phone_number,
            ...(typeof claims.picture === 'string'
              ? { image: claims.picture }
              : {}),
          })
        },
      },
      delete: {
        after: async (account, ctx) => {
          if (account.providerId !== TELEGRAM_OIDC_PROVIDER_ID) return
          if (!ctx) return
          await ctx.context.internalAdapter.updateUser(account.userId, {
            telegramId: null,
            telegramUsername: null,
            telegramPhoneNumber: null,
          })
        },
      },
    },
  },
  socialProviders:
    env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {},

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    async sendResetPassword({ url, user }) {
      await sendEmail({
        subject: 'Reset your password',
        template: ResetPasswordEmail({
          resetLink: url,
          username: user.email,
        }),
        to: user.email,
      })
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ url, user }) => {
      await sendEmail({
        subject: 'Verify your email',
        template: VerifyEmail({
          url,
          username: user.email,
        }),
        to: user.email,
      })
    },
  },

  plugins: [
    openAPI(),
    twoFactor(),
    passkey(),
    admin({
      defaultRole: 'user',
      adminRoles: ['admin', 'superadmin'],
      ac,
      roles: {
        user: userRole,
        admin: adminRole,
        superadmin: superAdminRole,
      },
    }),
    organization(),
    mcp({
      loginPage: '/login',
    }),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp }) {
        await sendEmail({
          subject: 'Verify your email',
          template: SendVerificationOtp({
            username: email,
            otp,
          }),
          to: email,
        })
      },
    }),
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        await sendEmail({
          subject: 'Magic Link',
          template: SendMagicLinkEmail({
            username: email,
            url,
            token,
          }),
          to: email,
        })
      },
    }),

    ...(botUsername && env.BOT_TOKEN !== 'SET_YOUR_BOT_TOKEN'
      ? [
          telegram({
            botToken: env.BOT_TOKEN,
            botUsername,
            loginWidget: true,
            miniApp: {
              enabled: true,
              validateInitData: true,
              allowAutoSignin: false,
              mapMiniAppDataToUser: (data) => ({
                id: data.id,
                name: data.username,
                image: data.photo_url,
                emailVerified: false,
              }),
            },
            ...(env.TELEGRAM_OIDC_CLIENT_SECRET
              ? {
                  oidc: {
                    enabled: true,
                    clientSecret: env.TELEGRAM_OIDC_CLIENT_SECRET,
                    requestPhone: true,
                    mapOIDCProfileToUser: (claims) => ({
                      name: claims.name,
                      image: claims.picture,
                      emailVerified: false,
                      telegramId: (claims as unknown as Record<string, unknown>)
                        .id,
                      telegramPhoneNumber: claims.phone_number,
                      telegramUsername: claims.preferred_username,
                    }),
                  },
                }
              : {}),
          }),
        ]
      : []),

    tanstackStartCookies(), // make sure this is the last plugin in the array
  ],
})
