import { createFileRoute, Link, redirect } from '@tanstack/react-router'

import SignInForm from '@/features/auth/sign-in-form'
import { getAuthSession } from '@/lib/auth/auth-server'
import { useTranslation } from '@/lib/intl/react'

export const Route = createFileRoute('/(auth)/login')({
  beforeLoad: async () => {
    const session = await getAuthSession()
    if (session?.user) {
      throw redirect({ to: '/dashboard' })
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
