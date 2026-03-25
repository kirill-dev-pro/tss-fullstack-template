import { EventEmitter } from 'node:events'

import type { telegramMessages } from '@/lib/db/schema/telegram'

type TelegramMessage = typeof telegramMessages.$inferSelect

const bus = new EventEmitter()
bus.setMaxListeners(0)

export function emitTelegramMessage(message: TelegramMessage) {
  bus.emit('telegram:message', message)
}

export function onTelegramMessage(
  handler: (message: TelegramMessage) => void,
): () => void {
  bus.on('telegram:message', handler)
  return () => {
    bus.off('telegram:message', handler)
  }
}
