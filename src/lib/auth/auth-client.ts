import { passkeyClient } from '@better-auth/passkey/client'
import { telegramClient } from 'better-auth-telegram/client'
import {
  adminClient,
  emailOTPClient,
  genericOAuthClient,
  magicLinkClient,
  multiSessionClient,
  organizationClient,
  twoFactorClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { env } from '@/lib/env'

import {
  ac,
  admin as adminRole,
  superadmin as superAdminRole,
  user as userRole,
} from './permissions'

export const authClient = createAuthClient({
  baseURL: env.VITE_SERVER_URL,
  fetchOptions: {
    credentials: 'include',
  },
  plugins: [
    genericOAuthClient(),
    telegramClient(),
    twoFactorClient(),
    passkeyClient(),
    adminClient({
      ac,
      roles: {
        user: userRole,
        admin: adminRole,
        superadmin: superAdminRole,
      },
    }),
    organizationClient(),
    emailOTPClient(),
    magicLinkClient(),
    multiSessionClient(),
  ],
})

export type AuthClient = ReturnType<typeof createAuthClient>
