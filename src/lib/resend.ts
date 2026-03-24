import type { ReactElement } from 'react'

import { render } from '@react-email/render'
import { Resend } from 'resend'

import { env } from '@/lib/env'

export async function sendEmail({
  subject,
  template,
  to,
}: {
  subject: string
  template: ReactElement
  to: string
}) {
  if (!env.RESEND_API_KEY) {
    console.log(`[sendEmail] to: ${to}, subject: ${subject}`)
    console.log(await render(template))
    return
  }

  const resend = new Resend(env.RESEND_API_KEY)

  try {
    const html = await render(template)

    const { data } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      html,
      subject,
      to,
    })

    return data
  } catch (error) {
    console.error('error', error)
    throw error
  }
}
