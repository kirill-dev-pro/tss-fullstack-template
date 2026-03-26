import { createFileRoute, Link, redirect } from '@tanstack/react-router'

import SignInForm from '@/features/auth/sign-in-form'
import { authClient } from '@/lib/auth/auth-client'
import { useTranslation } from '@/lib/intl/react'

export const Route = createFileRoute('/(auth)/login')({
  beforeLoad: () => {
    try {
      const sessionData = authClient.$store.atoms.session.get()
      if (sessionData?.data?.session) {
        throw redirect({ to: '/dashboard' })
      }
    } catch (e) {
      if (e && typeof e === 'object' && 'type' in e) throw e
    }
  },
  component: RouteComponent,
})
function RouteComponent() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[calc(100vh-10rem)] w-full flex-col items-center justify-center p-2 md:p-6">
      <SignInForm />
      <div className="mt-4 text-center">
        {t('DONT_HAVE_ACCOUNT')}{' '}
        <Link className="underline" to="/register">
          {t('REGISTER')}
        </Link>
        !
      </div>
    </div>
  )
}
