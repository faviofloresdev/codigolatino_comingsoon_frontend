'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

type ParallaxImageProps = {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  strength?: number
}

export function ParallaxImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  strength = 34,
}: ParallaxImageProps) {
  const frameRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      return
    }

    let rafId = 0

    const update = () => {
      rafId = 0
      const rect = frame.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height)
      const clamped = Math.max(0, Math.min(1, progress))
      const translateY = (clamped - 0.5) * strength
      const scale = 1.08 - clamped * 0.04

      frame.style.setProperty('--parallax-y', `${translateY.toFixed(2)}px`)
      frame.style.setProperty('--parallax-scale', scale.toFixed(3))
    }

    const requestUpdate = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [strength])

  return (
    <div ref={frameRef} className="parallax-frame">
      <Image src={src} alt={alt} width={width} height={height} className={className} priority={priority} />
    </div>
  )
}
