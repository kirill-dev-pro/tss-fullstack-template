import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { createFileRoute } from "@tanstack/react-router"
import { convertToModelMessages, streamText } from "ai"
import { env } from "@/lib/env"

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
})

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export const Route = createFileRoute("/api/ai/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = await request.json()

        const result = streamText({
          model: openrouter("google/gemini-2.5-flash-lite-preview-02-05:free"),
          messages: convertToModelMessages(messages),
        })

        return result.toUIMessageStreamResponse()
      },
    },
  },
})
