export const TMA_PREVIEW_MESSAGE_TYPE = 'tss-tma-preview' as const

export type TmaPreviewThemeKeys =
  | 'bg_color'
  | 'header_bg_color'
  | 'secondary_bg_color'
  | 'button_color'
  | 'button_text_color'
  | 'text_color'
  | 'hint_color'
  | 'link_color'

const THEME_TO_CSS: Record<TmaPreviewThemeKeys, string> = {
  bg_color: '--tg-theme-bg-color',
  header_bg_color: '--tg-theme-header-bg-color',
  secondary_bg_color: '--tg-theme-secondary-bg-color',
  button_color: '--tg-theme-button-color',
  button_text_color: '--tg-theme-button-text-color',
  text_color: '--tg-theme-text-color',
  hint_color: '--tg-theme-hint-color',
  link_color: '--tg-theme-link-color',
}

export type TmaPreviewPostMessage = {
  type: typeof TMA_PREVIEW_MESSAGE_TYPE
  theme: Partial<Record<TmaPreviewThemeKeys, string>>
  profile: {
    displayName: string
    avatarUrl: string
  }
}

export function applyTmaPreviewTheme(
  theme: TmaPreviewPostMessage['theme'],
): void {
  const root = document.documentElement
  for (const key of Object.keys(theme) as TmaPreviewThemeKeys[]) {
    const value = theme[key]
    if (!value) {
      continue
    }
    const cssName = THEME_TO_CSS[key]
    if (cssName) {
      root.style.setProperty(cssName, value)
    }
  }
}

export const defaultTmaPreviewTheme: Record<TmaPreviewThemeKeys, string> = {
  bg_color: '#17212b',
  header_bg_color: '#17212b',
  secondary_bg_color: '#232e3c',
  button_color: '#5288c1',
  button_text_color: '#ffffff',
  text_color: '#f5f5f5',
  hint_color: '#708499',
  link_color: '#6ab3f3',
}

export const defaultTmaPreviewProfile = {
  displayName: 'Preview user',
  avatarUrl: '',
}
