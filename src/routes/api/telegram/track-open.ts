import { createFileRoute } from '@tanstack/react-router'

import { markMiniAppOpened } from '@/lib/db/methods'

export const Route = createFileRoute('/api/telegram/track-open')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const initData = body.initData as string | undefined

          if (!initData) {
            return new Response(JSON.stringify({ error: 'Missing initData' }), {
              status: 400,
              headers: { 'content-type': 'application/json' },
            })
          }

          const params = new URLSearchParams(initData)
          const userJson = params.get('user')
          if (!userJson) {
            return new Response(
              JSON.stringify({ error: 'No user in initData' }),
              {
                status: 400,
                headers: { 'content-type': 'application/json' },
              },
            )
          }

          const user = JSON.parse(userJson) as { id: number }
          await markMiniAppOpened(user.id)

          return new Response(JSON.stringify({ ok: true }), {
            headers: { 'content-type': 'application/json' },
          })
        } catch (err) {
          console.error('[track-open] Error:', err)
          return new Response(JSON.stringify({ error: 'Internal error' }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
          })
        }
      },
    },
  },
})
