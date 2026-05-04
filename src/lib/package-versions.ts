import { createServerFn } from '@tanstack/react-start'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export type PackageVersion = {
  name: string
  version: string
}

const PACKAGE_MAP: Record<string, string> = {
  react: 'React',
  'react-dom': 'React DOM',
  '@tanstack/react-start': 'TanStack Start',
  '@tanstack/react-router': 'TanStack Router',
  '@tanstack/react-query': 'TanStack Query',
  '@tanstack/react-form': 'TanStack Form',
  '@tanstack/store': 'TanStack Store',
  '@tanstack/db': 'TanStack DB',
  '@trpc/server': 'tRPC',
  'drizzle-orm': 'Drizzle ORM',
  vite: 'Vite',
  tailwindcss: 'Tailwind CSS',
  'better-auth': 'Better Auth',
  'react-hook-form': 'React Hook Form',
  zod: 'Zod',
  '@ai-sdk/react': '@ai-sdk/react',
  ai: 'ai',
  resend: 'Resend',
  'react-email': 'React Email',
  i18next: 'i18next',
  '@sentry/node': 'Sentry',
  'lucide-react': 'Lucide Icons',
  'framer-motion': 'Framer Motion',
  grammy: 'Grammy (Telegram)',
}

function extractMajorMinor(version: string): string {
  const clean = version.replace(/^\^|~/, '')
  const parts = clean.split('.')
  return parts.slice(0, 2).join('.')
}

export const getPackageVersions = createServerFn({
  method: 'GET',
}).handler(async () => {
  const packageJsonPath = resolve(process.cwd(), 'package.json')
  const raw = readFileSync(packageJsonPath, 'utf-8')
  const pkg = JSON.parse(raw) as {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }

  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  const versions: PackageVersion[] = []

  for (const [pkgName, displayName] of Object.entries(PACKAGE_MAP)) {
    const version = deps[pkgName]
    if (version) {
      versions.push({
        name: displayName,
        version: extractMajorMinor(version),
      })
    }
  }

  const deploymentTargets: PackageVersion[] = [
    { name: 'Bun', version: extractMajorMinor(pkg.dependencies?.bun ?? '1.3') },
    {
      name: 'Docker',
      version: pkg.devDependencies?.docker ?? 'latest',
    },
    {
      name: 'Vercel',
      version: 'ready',
    },
  ]

  return { dependencies: versions, deploymentTargets }
})
