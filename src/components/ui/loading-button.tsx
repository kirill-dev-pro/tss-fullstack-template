import { Loader2 } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean
  loadingText?: string
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    { loading = false, loadingText, children, disabled, className, ...props },
    ref,
  ) => (
    <Button
      className={cn(className)}
      disabled={loading || disabled}
      ref={ref}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? loadingText || children : children}
    </Button>
  ),
)

LoadingButton.displayName = 'LoadingButton'

export { LoadingButton }
export type { LoadingButtonProps }
