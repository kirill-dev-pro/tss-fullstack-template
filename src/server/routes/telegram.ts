import { tracked } from '@trpc/server'
import { GrammyError } from 'grammy'
import { z } from 'zod'

import {
  getBroadcastableContacts,
  getMessagesPage,
  getTelegramChatsList,
  getTelegramContactsList,
  getTelegramStats,
  markContactBlocked,
} from '@/lib/db/methods'
import { onTelegramMessage } from '@/lib/events/telegram'
import { createTRPCRouter, protectedProcedure } from '@/lib/trpc/init'
import { bot } from '@/telegram-bot'

export const telegramRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async () => {
    return getTelegramStats()
  }),

  getContacts: protectedProcedure.query(async () => {
    return getTelegramContactsList()
  }),

  getChats: protectedProcedure.query(async () => {
    return getTelegramChatsList()
  }),

  getMessages: protectedProcedure
    .input(
      z.object({
        chatId: z.number(),
        cursor: z.number().optional(),
        limit: z.number().min(1).max(100).default(50),
      }),
    )
    .query(async ({ input }) => {
      return getMessagesPage(input.chatId, input.cursor, input.limit)
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        chatId: z.number(),
        text: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const result = await bot.api.sendMessage(input.chatId, input.text)

        return { success: true, messageId: result.message_id }
      } catch (err) {
        if (err instanceof GrammyError && err.error_code === 403) {
          await markContactBlocked(input.chatId)
          return { success: false, error: 'blocked' as const }
        }
        throw err
      }
    }),

  broadcastMessage: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const contacts = await getBroadcastableContacts()
      const results = { sent: 0, blocked: 0, failed: 0, total: contacts.length }

      for (let i = 0; i < contacts.length; i += 30) {
        const batch = contacts.slice(i, i + 30)

        await Promise.all(
          batch.map(async (contact) => {
            try {
              await bot.api.sendMessage(contact.telegramUserId, input.text)
              results.sent++
            } catch (err) {
              if (err instanceof GrammyError && err.error_code === 403) {
                await markContactBlocked(contact.telegramUserId)
                results.blocked++
              } else {
                results.failed++
              }
            }
          }),
        )

        if (i + 30 < contacts.length) {
          await new Promise((r) => setTimeout(r, 1000))
        }
      }

      return results
    }),

  onNewMessage: protectedProcedure
    .input(z.object({ chatId: z.number() }))
    .subscription(async function* ({ input, signal }) {
      const pending: Array<{ id: string; data: unknown }> = []
      let resolve: (() => void) | null = null

      const cleanup = onTelegramMessage((message) => {
        if (message.chatId === input.chatId) {
          pending.push({
            id: String(message.id),
            data: message,
          })
          resolve?.()
        }
      })

      try {
        while (!signal?.aborted) {
          while (pending.length > 0) {
            const { id, data } = pending.shift()!
            yield tracked(id, data)
          }

          await new Promise<void>((r) => {
            resolve = r
            signal?.addEventListener('abort', () => r(), { once: true })
          })
        }
      } finally {
        cleanup()
      }
    }),
})
