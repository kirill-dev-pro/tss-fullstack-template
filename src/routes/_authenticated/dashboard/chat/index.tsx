import { createFileRoute } from '@tanstack/react-router'

import { Chat } from '@/features/ai/chat-image-generation'

export const Route = createFileRoute('/_authenticated/dashboard/chat/')({
  component: Chat,
})
