import React, { forwardRef } from 'react'
import '@lottiefiles/lottie-player/dist/tgs-player'

export const Sticker = forwardRef(
  (
    {
      src,
      autoplay = true,
      controls = false,
      loop = true,
      mode = 'normal',
      style = { width: '200px', height: '200px' },
    }: {
      src: string
      autoplay?: boolean
      controls?: boolean
      loop?: boolean
      mode?: string
      style?: React.CSSProperties
    },
    ref,
  ) => {
    return (
      // @ts-expect-error - tgs-player is not a valid HTML element and its fine
      <tgs-player
        id="firstLottie"
        ref={ref}
        autoplay={autoplay}
        // controls={controls}
        loop={loop}
        mode={mode}
        src={src}
        style={style}
      />
    )
  },
)
