import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

import { z } from 'zod'

import { db } from '@/lib/db'

const text = (t: string): CallToolResult => ({
  content: [{ type: 'text', text: t }],
})

const mcpToolCapabilities = () =>
  ({
    getCatFact: { description: 'Get a random cat fact' },
    getQuote: { description: 'Get a random inspirational quote' },
    getJoke: { description: 'Get a random programming joke' },
    getWelcomeMessage: { description: 'Get the welcome message' },
    calculateBMI: { description: 'Calculate the BMI of a person' },
    getTodos: { description: 'Get the todos from the app' },
  }) as const

const getCatFact = async (): Promise<CallToolResult> => {
  try {
    const res = await fetch('https://catfact.ninja/fact')
    const data = await res.json()

    return text(`🐱 ${data.fact}`)
  } catch {
    return text('Failed to fetch cat fact')
  }
}

const getQuote = async (): Promise<CallToolResult> => {
  try {
    const res = await fetch('https://api.quotable.io/random')
    const data = await res.json()
    return text(`💭 "${data.content}" - ${data.author}`)
  } catch {
    return text('Failed to fetch quote')
  }
}

const getJoke = async (): Promise<CallToolResult> => {
  try {
    const res = await fetch('https://official-joke-api.appspot.com/random_joke')
    const data = await res.json()
    return text(`😄 ${data.setup}\n\n${data.punchline}`)
  } catch {
    return text('Failed to fetch joke')
  }
}

const getWelcomeMessage = async ({
  name,
}: {
  name: string
}): Promise<CallToolResult> => text(`Welcome to the AI, ${name}!`)

const calculateBMI = async ({
  weight,
  height,
}: {
  weight: number
  height: number
}): Promise<CallToolResult> => {
  const bmi = weight / (height * height)
  return text(`Your BMI is ${bmi}`)
}

const getTodos = async (): Promise<CallToolResult> => {
  const todos = await db.query.todo.findMany()
  return text(`Todos: ${JSON.stringify(todos)}`)
}

/** Registers tools with correct per-handler typing (avoids union callback errors). */
export const registerMcpTools = (server: McpServer): void => {
  const cap = mcpToolCapabilities()
  server.registerTool('getCatFact', cap.getCatFact, getCatFact)
  server.registerTool('getQuote', cap.getQuote, getQuote)
  server.registerTool('getJoke', cap.getJoke, getJoke)
  server.registerTool(
    'getWelcomeMessage',
    {
      ...cap.getWelcomeMessage,
      inputSchema: { name: z.string() },
    },
    getWelcomeMessage,
  )
  server.registerTool(
    'calculateBMI',
    {
      ...cap.calculateBMI,
      inputSchema: {
        weight: z.number(),
        height: z.number(),
      },
    },
    calculateBMI,
  )
  server.registerTool('getTodos', cap.getTodos, getTodos)
}

export const tools = Object.entries(mcpToolCapabilities()).map(
  ([name, meta]) => ({
    name,
    description: meta.description,
  }),
)
