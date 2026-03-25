import { z } from 'zod'

import {
  getTelegramContactsList,
  getTelegramMessagesByUser,
  getTelegramStats,
} from '@/lib/db/methods'
import { createTRPCRouter, protectedProcedure } from '@/lib/trpc/init'

export const telegramRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async () => {
    return getTelegramStats()
  }),

  getContacts: protectedProcedure.query(async () => {
    return getTelegramContactsList()
  }),

  getMessages: protectedProcedure
    .input(z.object({ telegramUserId: z.number() }))
    .query(async ({ input }) => {
      return getTelegramMessagesByUser(input.telegramUserId)
    }),
})
