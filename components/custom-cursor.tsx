'use client'

import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!finePointer.matches) return

    setEnabled(true)
    let animationFrame = 0

    const onMouseMove = (e: MouseEvent) => {
      const cursor = cursorRef.current
      if (!cursor) return

      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(() => {
        cursor.style.left = `${e.clientX}px`
        cursor.style.top = `${e.clientY}px`
        cursor.dataset.visible = 'true'
      })
    }

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const interactive = target?.closest('a, button, summary, label, [role="button"], [tabindex]')
      const textControl = target?.closest('input:not([type="checkbox"]):not([type="radio"]), textarea, select')
      if (cursorRef.current) {
        cursorRef.current.dataset.interactive = interactive ? 'true' : 'false'
        cursorRef.current.dataset.text = textControl ? 'true' : 'false'
      }
    }

    const onMouseDown = () => {
      if (cursorRef.current) cursorRef.current.dataset.pressed = 'true'
    }
    const onMouseUp = () => {
      if (cursorRef.current) cursorRef.current.dataset.pressed = 'false'
    }
    const onMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.dataset.visible = 'false'
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('pointerover', onPointerOver)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)
    document.documentElement.addEventListener('mouseleave', onMouseLeave)
    document.documentElement.classList.add('custom-cursor-active')

    return () => {
      window.cancelAnimationFrame(animationFrame)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      data-visible="false"
      data-interactive="false"
      data-pressed="false"
      data-text="false"
      aria-hidden="true"
    >
      <span className="custom-cursor-ring" />
      <span className="custom-cursor-dot" />
    </div>
  )
}
