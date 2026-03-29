'use client'

import { useEffect } from 'react'

import {
  applyTmaPreviewTheme,
  type TmaPreviewPostMessage,
  TMA_PREVIEW_MESSAGE_TYPE,
} from '../-utils/preview-message'

/**
 * Applies theme + profile updates from the dashboard preview (postMessage).
 */
export function PreviewBridgeListener() {
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) {
        return
      }
      const data = e.data as TmaPreviewPostMessage | undefined
      if (!data || data.type !== TMA_PREVIEW_MESSAGE_TYPE) {
        return
      }
      applyTmaPreviewTheme(data.theme)
      window.dispatchEvent(
        new CustomEvent<TmaPreviewPostMessage>('tma-preview-update', {
          detail: data,
        }),
      )
    }
    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [])
  return null
}
