import Link from 'next/link'
import { CustomCursor } from '@/components/custom-cursor'
import { SquigglyFilters } from '@/components/squiggly-filters'

type ErrorShellProps = {
  badge: string
  code: string
  title: string
  description: string
  homeHref: string
  homeLabel: string
  secondaryAction?: React.ReactNode
}

export function ErrorShell({
  badge,
  code,
  title,
  description,
  homeHref,
  homeLabel,
  secondaryAction,
}: ErrorShellProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 text-zinc-50 antialiased selection:bg-zinc-800 selection:text-white sm:px-6">
      <SquigglyFilters />
      <CustomCursor />

      <div className="absolute inset-0 z-0 bg-zinc-950 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:20px_20px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_35%),radial-gradient(circle_at_bottom,rgba(244,63,94,0.12),transparent_30%)]" />
        <div className="absolute inset-0 bg-zinc-950/85 [mask-image:radial-gradient(ellipse_at_center,transparent_18%,black_78%)]" />
      </div>

      <main className="relative z-10 flex w-full max-w-3xl flex-col items-center rounded-[2rem] border border-zinc-800/80 bg-zinc-900/70 px-6 py-12 text-center shadow-2xl shadow-black/30 backdrop-blur-xl sm:px-10">
        <span className="mb-4 inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
          {badge}
        </span>

        <p className="mb-3 font-mono text-[clamp(4rem,16vw,7rem)] leading-none text-zinc-700">
          {code}
        </p>

        <h1 className="max-w-xl text-balance text-3xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
          {title}
        </h1>

        <p className="mt-4 max-w-2xl text-pretty text-sm leading-7 text-zinc-400 sm:text-base">
          {description}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href={homeHref}
            className="inline-flex min-w-44 items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
          >
            {homeLabel}
          </Link>
          {secondaryAction}
        </div>
      </main>
    </div>
  )
}
