import { createTRPCRouter } from '@/lib/trpc/init'

import { publicRouter } from './routes/public'
import { resourcesRouter } from './routes/resources'
import { telegramRouter } from './routes/telegram'
import { todoRouter } from './routes/todo'

export const trpcRouter = createTRPCRouter({
  todo: todoRouter,
  resources: resourcesRouter,
  public: publicRouter,
  telegram: telegramRouter,
})

export type TRPCRouter = typeof trpcRouter
