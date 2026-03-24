import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { convertToModelMessages, streamText } from 'ai'

import { chatModel } from '@/lib/openrouter'

export const Route = createFileRoute('/api/ai/vercel/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = await request.json()

          console.log('🔑 Messages', messages)

          const response = streamText({
            model: chatModel,
            messages: await convertToModelMessages(messages),
          })

          return response.toUIMessageStreamResponse()
        } catch (error) {
          console.error('🔑 Error', error)
          return json({ error: 'Internal server error' }, { status: 500 })
        }
      },
    },
  },
})
