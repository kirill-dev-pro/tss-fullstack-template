import { createFileRoute } from '@tanstack/react-router'
import { Check, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/dashboard/upgrade')({
  component: UpgradePage,
})

const features = [
  'Higher API and storage limits',
  'Priority email support',
  'Advanced analytics and exports',
  'Team collaboration tools',
]

function UpgradePage() {
  return (
    <div className="container mx-auto max-w-lg space-y-6 py-6">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="size-6 text-primary" aria-label="Pro plan" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Upgrade to Pro</h1>
        <p className="text-sm text-muted-foreground">
          Unlock more capacity and support for serious use.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pro</CardTitle>
          <CardDescription>
            Everything in Free, plus the extras below. Billing integration
            coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((text) => (
              <li className="flex items-start gap-2 text-sm" key={text}>
                <Check
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-primary"
                />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled type="button">
            Coming soon
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
