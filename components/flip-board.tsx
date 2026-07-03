"use client"

import { useEffect, useRef, useState } from "react"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

function FlipCard({ target, index }: { target: string; index: number }) {
  // Start from a deterministic char so SSR and client markup match, then animate on mount.
  const [char, setChar] = useState("A")
  const [settled, setSettled] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let currentFlips = 0
    const totalFlips = 15 + index * 4
    const interval = setInterval(
      () => {
        if (currentFlips >= totalFlips) {
          clearInterval(interval)
          setChar(target)
          setSettled(true)
          setTimeout(() => setSettled(false), 150)
        } else {
          setChar(CHARS[Math.floor(Math.random() * CHARS.length)])
          currentFlips++
        }
      },
      50 + Math.random() * 20,
    )
    return () => clearInterval(interval)
  }, [target, index])

  return (
    <div
      ref={cardRef}
      className={`relative flex h-11 w-7 items-center justify-center overflow-hidden rounded border border-zinc-700/50 font-mono text-xl font-bold text-zinc-100 shadow-2xl transition-colors duration-200 sm:h-14 sm:w-10 sm:text-3xl md:h-20 md:w-14 md:text-5xl ${
        settled ? "bg-zinc-800" : "bg-zinc-900"
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/2 border-b border-black/60 bg-gradient-to-b from-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute inset-x-0 top-1/2 z-20 h-[2px] -translate-y-1/2 bg-zinc-950 shadow-sm" />
      <span className="relative z-0 tracking-tighter drop-shadow-md">{char}</span>
    </div>
  )
}

export function FlipBoard({ word = "REMODELACIÓN" }: { word?: string }) {
  const letters = word.split("")
  return (
    <div className="flex max-w-full flex-wrap justify-center gap-1 px-2 sm:gap-1.5 md:gap-2" aria-label={word}>
      {letters.map((char, i) => (
        <FlipCard key={`${char}-${i}`} target={char} index={i} />
      ))}
    </div>
  )
}
