import Link from 'next/link'

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
    <div className="page-shell relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 text-[var(--brand-ink)] antialiased sm:px-6">
      <div className="brand-shell w-full">
        <main className="brand-panel mx-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-[2.5rem] lg:grid lg:grid-cols-[0.44fr_0.56fr]">
          <div className="brand-dark-panel flex flex-col justify-between px-6 py-8 text-white sm:px-8 sm:py-10">
            <div>
              <span className="inline-flex rounded-full border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/62">
                {badge}
              </span>
              <p className="brand-display mt-8 text-[clamp(4.5rem,14vw,8rem)] leading-none font-bold tracking-[-0.1em] text-white/14">
                {code}
              </p>
            </div>

            <p className="max-w-sm text-sm leading-7 text-white/62">
              {`Codigo Latino / ${code} / ${new Date().getFullYear()}`}
            </p>
          </div>

          <div className="flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10">
            <h1 className="brand-display max-w-xl text-4xl leading-[0.92] font-bold tracking-[-0.07em] text-balance sm:text-5xl">
              {title}
            </h1>

            <p className="brand-copy mt-5 max-w-2xl text-base leading-8 text-pretty">{description}</p>

            <div className="section-rule my-8" />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={homeHref} className="brand-button-primary">
                {homeLabel}
              </Link>
              {secondaryAction}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
