import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded font-medium text-sm outline-none transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          'bg-[var(--bg-panel-light)] text-[var(--text-main)] border border-[var(--border-active)] hover:bg-[var(--bg-panel)] hover:border-[var(--text-muted)]',
        primary:
          'bg-[var(--accent-blue)] text-white border border-[var(--accent-blue)] hover:bg-[var(--accent-blue-hover)] hover:border-[var(--accent-blue-hover)]',
        destructive:
          'bg-[var(--accent-red)] text-white border border-[var(--accent-red)] hover:bg-[var(--accent-red)]/90',
        outline:
          'bg-transparent text-[var(--text-main)] border border-[var(--border-active)] hover:bg-[var(--bg-panel-light)] hover:border-[var(--text-muted)]',
        ghost:
          'bg-transparent text-[var(--text-main)] border border-transparent hover:bg-[var(--bg-panel-light)] hover:border-[var(--border-active)]',
        link: 'text-[var(--accent-blue)] underline-offset-4 hover:underline border-none',
      },
      size: {
        default: 'h-8 px-3 py-1 has-[>svg]:px-2.5',
        sm: 'h-7 gap-1.5 rounded px-2.5 has-[>svg]:px-2',
        lg: 'h-9 rounded px-5 has-[>svg]:px-4',
        icon: 'size-8',
        'icon-sm': 'size-7',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      {...props}
    />
  )
}

export { Button, buttonVariants }
