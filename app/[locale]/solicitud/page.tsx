import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectProcess } from '@/components/project-process'
import { ProjectSubmission } from '@/components/project-submission'
import { SiteShell } from '@/components/site-shell'
import { isLocale, Locale } from '@/lib/i18n'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: routeLocale } = await params
  const locale: Locale = isLocale(routeLocale) ? routeLocale : 'es'
  return {
    title: locale === 'es' ? 'Enviar solicitud | Codigo Latino' : 'Submit request | Codigo Latino',
    description: locale === 'es'
      ? 'Revisa y envía la información de tu proyecto a Codigo Latino.'
      : 'Review and submit your project information to Codigo Latino.',
  }
}

export default async function SubmissionPage({ params }: PageProps) {
  const { locale: routeLocale } = await params
  if (!isLocale(routeLocale)) notFound()
  const locale: Locale = routeLocale
  const heading = locale === 'es'
    ? {
        label: 'Último paso',
        title: 'Revisa. Envía. Nosotros continuamos.',
        intro: 'La cotización y el brief ya están conectados. Solo confirma tus datos para que podamos revisar el alcance y preparar una respuesta concreta.',
      }
    : {
        label: 'Final step',
        title: 'Review. Submit. We take it from here.',
        intro: 'Your estimate and brief are already connected. Confirm your details so we can review the scope and prepare a concrete response.',
      }

  return (
    <SiteShell locale={locale} currentPath={`/${locale}/solicitud`}>
      <section className="submission-page brand-section pt-6">
        <ProjectProcess locale={locale} activeStep={3} />
        <header className="submission-page-header">
          <p className="editorial-label">{heading.label}</p>
          <h1 className="brand-display">{heading.title}</h1>
          <p>{heading.intro}</p>
        </header>
        <ProjectSubmission locale={locale} />
      </section>
    </SiteShell>
  )
}
