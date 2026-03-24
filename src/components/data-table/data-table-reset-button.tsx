'use client'

import { X } from 'lucide-react'

import { useDataTable } from '@/components/data-table/data-table-provider'
import { Kbd } from '@/components/ui/kbd'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useHotKey } from '@/hooks/use-hot-key'

import { Button } from '../ui/button'

export function DataTableResetButton() {
  const { table } = useDataTable()
  useHotKey(table.resetColumnFilters, 'Escape')

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button variant="ghost" onClick={() => table.resetColumnFilters()}>
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p className="text-nowrap">
            Reset filters with{' '}
            <Kbd className="ml-1 text-muted-foreground group-hover:text-accent-foreground">
              <span className="mr-1">⌘</span>
              <span>Esc</span>
            </Kbd>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
