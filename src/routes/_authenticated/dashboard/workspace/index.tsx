import { createFileRoute } from '@tanstack/react-router'

import { WorkspacePage } from '@/features/workspace/workspace-page'

export const Route = createFileRoute('/_authenticated/dashboard/workspace/')({
  component: WorkspacePage,
})
