import { notFound } from 'next/navigation'
import { ContactForm } from '@/components/contact-form'
import { CustomCursor } from '@/components/custom-cursor'
import { FlipBoard } from '@/components/flip-board'
import MaskLogoCanvas from '@/components/mask-logo-canvas'
import { SquigglyFilters } from '@/components/squiggly-filters'
import { Locale, isLocale, translations } from '@/lib/i18n'

interface PageProps {
  params: Promise<{ locale: string }>
}

export function generateStaticParams(): Array<{ locale: Locale }> {
  return [
    { locale: 'es' },
    { locale: 'en' },
  ]
}

export default async function Page({ params }: PageProps) {
  const { locale: routeLocale } = await params
  if (!isLocale(routeLocale)) {
    notFound()
  }

  const locale = routeLocale
  const t = translations[locale]

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 text-zinc-50 antialiased selection:bg-zinc-800 selection:text-white">
      <SquigglyFilters />
      <CustomCursor />

      <div className="absolute inset-0 z-0 h-full w-full bg-zinc-950 bg-[radial-gradient(#52525b_1px,transparent_1px)] [background-size:20px_20px]">
        <div className="absolute inset-0 bg-zinc-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_80%)]" />
      </div>
      { /* <ParticleBackground /> */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent,rgba(9,9,11,0.4)_60%,rgb(9,9,11))]" />

      <main className="relative z-10 mt-[-5vh] flex w-full max-w-4xl flex-col items-center px-4 text-center sm:px-6">
        <div className="mb-8 inline-flex cursor-default items-center gap-2 rounded-full bg-zinc-900/80 px-3 py-1 text-xs font-medium text-zinc-400 ring-1 ring-inset ring-zinc-800 backdrop-blur-md transition-colors hover:bg-zinc-800/80">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="uppercase tracking-wide">{t.statusBadge}</span>
        </div>

        
        <div className="relative z-20 mb-8 flex w-full flex-col items-center">
          <p className="mb-6 text-center text-sm font-medium uppercase tracking-widest text-zinc-400 sm:text-base md:text-lg">
            {t.subheading}
          </p>
          
          <div className="mb-4">
            <FlipBoard word={t.headlineWord} />
          </div>
          <div className="mt-8 flex w-full justify-center sm:mt-10">
            <div
              className="rounded-[2rem] p-2"
              aria-label={t.logoAlt}
            >
              <MaskLogoCanvas />
            </div>
          </div>
        </div>

        <p className="mx-auto mb-8 max-w-2xl text-base font-normal leading-relaxed text-zinc-400 sm:text-lg">
          {t.descriptionStart}
          <span className="animate-squiggly font-semibold text-zinc-100">{t.descriptionHighlight}</span>
          {t.descriptionEnd}
        </p>

        <ContactForm
          contactLabel={t.contactLabel}
          contactPlaceholder={t.contactPlaceholder}
          submitButton={t.submitButton}
          confirmationMessage={t.confirmationMessage}
        />

      </main>
    </div>
  )
}
