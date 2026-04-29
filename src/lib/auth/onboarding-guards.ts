const PLACEHOLDER_EMAIL_SUFFIXES = [
  '@telegram.local',
  '@telegram.oidc',
  '@passkey.local',
]

const PLACEHOLDER_NAMES = new Set(['', 'New user'])

export function isPlaceholderEmail(email: string): boolean {
  return PLACEHOLDER_EMAIL_SUFFIXES.some((suffix) => email.endsWith(suffix))
}

export function mustCompleteOnboarding(user: {
  email: string
  emailVerified: boolean
  name?: string | null
}): 'email' | 'verify' | null {
  if (
    isPlaceholderEmail(user.email) ||
    PLACEHOLDER_NAMES.has(user.name ?? '')
  ) {
    return 'email'
  }
  if (!user.emailVerified) {
    return 'verify'
  }
  return null
}
