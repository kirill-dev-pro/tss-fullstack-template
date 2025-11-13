import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { env } from "./env"

export const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
})

console.log("openrouter", openrouter)

export const embeddingModel = openrouter("qwen/qwen3-embedding-0.6b")

export const imageModel = openrouter("openrouter/polaris-alpha", {
  usage: {
    include: true,
  },
})

export const chatModel = openrouter("deepseek/deepseek-r1-0528-qwen3-8b:free")
