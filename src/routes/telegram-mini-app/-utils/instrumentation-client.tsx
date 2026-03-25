// This file is normally used for setting up mock data and other
// services that require one-time initialization on the client.

import { retrieveLaunchParams } from '@tma.js/sdk-react'

import { init } from './init'
import { mockEnv } from './mock-env'

if (typeof window !== 'undefined') {
  mockEnv().then(() => {
    try {
      const launchParams = retrieveLaunchParams()
      const { tgWebAppPlatform: platform } = launchParams
      const debug =
        (launchParams.tgWebAppStartParam || '').includes('debug') ||
        process.env.NODE_ENV === 'development'

      // Configure all application dependencies.
      init({
        debug,
        eruda: debug && ['ios', 'android'].includes(platform),
        mockForMacOS: platform === 'macos',
      })
    } catch (e) {
      console.log(e)
    }
  })
}
