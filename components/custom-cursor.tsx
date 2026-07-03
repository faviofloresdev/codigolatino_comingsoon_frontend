"use client"

import { useEffect, useRef, useState } from "react"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Only enable the custom cursor on devices with a fine pointer (mouse).
    if (!window.matchMedia("(pointer: fine)").matches) return
    setEnabled(true)

    const onMouseMove = (e: MouseEvent) => {
      const cursor = cursorRef.current
      if (cursor) {
        cursor.style.left = `${e.clientX}px`
        cursor.style.top = `${e.clientY}px`
      }
    }
    const onMouseDown = () => {
      if (ringRef.current) ringRef.current.style.transform = "scale(0.5)"
    }
    const onMouseUp = () => {
      if (ringRef.current) ringRef.current.style.transform = "scale(1)"
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mousedown", onMouseDown)
    document.addEventListener("mouseup", onMouseUp)
    document.documentElement.classList.add("custom-cursor-active")

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mousedown", onMouseDown)
      document.removeEventListener("mouseup", onMouseUp)
      document.documentElement.classList.remove("custom-cursor-active")
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      aria-hidden
    >
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-full w-full rounded-full border border-emerald-500/50 transition-all duration-200 ease-out"
      />
      <div className="relative h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
    </div>
  )
}
