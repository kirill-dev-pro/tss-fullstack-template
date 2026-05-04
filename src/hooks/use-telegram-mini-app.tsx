import { useCanGoBack, useNavigate } from '@tanstack/react-router'
import { backButton, isTMA, useRawInitData } from '@tma.js/sdk-react'
import { useEffect, useState } from 'react'

import { authClient } from '@/lib/auth/auth-client'
import '@/routes/telegram-mini-app/-utils/instrumentation-client'

interface UseTelegramMiniAppOptions {
  redirectAfterAutoLogin?: string
}

export const useTelegramMiniApp = (options: UseTelegramMiniAppOptions = {}) => {
  const { redirectAfterAutoLogin } = options
  const canGoBack = useCanGoBack()
  const navigate = useNavigate()
  const [thisIsTma, setThisIsTma] = useState(false)
  const rawInitData = useRawInitData()

  useEffect(() => {
    isTMA('complete').then((isTma) => {
      setThisIsTma(isTma)
    })
  }, [])

  useEffect(() => {
    if (!thisIsTma) return
    if (!rawInitData || rawInitData.includes('hash=some-hash')) return

    const autoLogin = async () => {
      const validation = await authClient.validateMiniApp(rawInitData)
      if (validation.error) return
      const { error } = await authClient.signInWithMiniApp(rawInitData)
      if (!error && redirectAfterAutoLogin) {
        navigate({ to: redirectAfterAutoLogin })
      }
    }

    autoLogin()
  }, [rawInitData, thisIsTma, redirectAfterAutoLogin, navigate])

  useEffect(() => {
    if (!thisIsTma) return
    if (canGoBack) {
      backButton.show()
      backButton.onClick(() => window.history.back())
    }
    return backButton.hide
  }, [canGoBack, thisIsTma])

  return { thisIsTma }
}
