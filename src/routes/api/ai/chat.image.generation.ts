import { createFileRoute } from '@tanstack/react-router'
import { convertToModelMessages, streamText, tool, type UIMessage } from 'ai'
import { z } from 'zod'

import { chatModel } from '@/lib/openrouter'

export const Route = createFileRoute('/api/ai/chat/image/generation')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages }: { messages: UIMessage[] } = await request.json()

        // Filter through messages and remove base64 image data to avoid sending to the model
        const filteredMessages = messages.map(
          (message) =>
            ({
              ...message,
              parts: message.parts.map((part) => {
                // Keep text parts as-is
                if (part.type === 'text') return part

                // For tool parts, filter out large data
                if (part.type.startsWith('tool-')) {
                  // If it's an image generation tool result, remove the base64 data but keep the structure
                  if (
                    part.type === 'tool-generateImage' &&
                    'output' in part &&
                    part.output
                  ) {
                    const toolPart = part as Record<string, unknown>
                    const output = toolPart.output as Record<string, unknown>
                    return {
                      ...toolPart,
                      output: {
                        // Keep prompt but remove the large base64 image data
                        prompt: output.prompt,
                      },
                    }
                  }
                  // Keep other tool parts as-is
                  return part
                }

                // Keep other part types as-is
                return part
              }),
            }) as UIMessage,
        )

        const result = streamText({
          model: chatModel,
          messages: await convertToModelMessages(filteredMessages),
          tools: {
            generateImage: tool({
              description: 'Generate an image',
              inputSchema: z.object({
                prompt: z
                  .string()
                  .describe('The prompt to generate the image from'),
              }),
              execute: async ({ prompt }) => {
                // Image generation is disabled - OpenRouter doesn't support image models
                // To enable, use a proper image model like openai.image("gpt-image-1")
                return { message: 'Image generation not available', prompt }
              },
            }),
          },
        })
        return result.toUIMessageStreamResponse()
      },
    },
  },
})
