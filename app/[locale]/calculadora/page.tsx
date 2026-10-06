import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectCalculator } from '@/components/project-calculator'
import { ProjectProcess } from '@/components/project-process'
import { SiteShell } from '@/components/site-shell'
import { Locale, isLocale } from '@/lib/i18n'
import { buildPageMetadata } from '@/lib/seo'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: routeLocale } = await params
  const locale: Locale = isLocale(routeLocale) ? routeLocale : 'es'
  return buildPageMetadata({
    locale,
    path: '/calculadora',
    title: locale === 'es' ? 'Calculadora de proyectos | Código Latino' : 'Project calculator | Codigo Latino',
    description: locale === 'es' ? 'Estima el alcance y la inversión inicial de tu próximo proyecto digital.' : 'Estimate the initial scope and investment for your next digital project.',
  })
}

export default async function CalculatorPage({ params }: PageProps) {
  const { locale: routeLocale } = await params
  if (!isLocale(routeLocale)) notFound()
  const locale: Locale = routeLocale
  const heading = locale === 'es'
    ? { label: 'Calculadora de proyectos', title: 'Una cifra con contexto, no un precio al azar.', intro: 'Configura una primera versión del alcance. Verás cómo cada decisión afecta la inversión antes de solicitar una propuesta definitiva.' }
    : { label: 'Project calculator', title: 'A number with context, not a random price.', intro: 'Configure an initial scope. See how each decision affects investment before requesting a final proposal.' }

  return (
    <SiteShell locale={locale} currentPath={`/${locale}/calculadora`}>
      <section className="calculator-page brand-section pt-6">
        <ProjectProcess locale={locale} activeStep={1} />
        <header className="calculator-page-header">
          <p className="editorial-label">{heading.label}</p>
          <h1 className="brand-display">{heading.title}</h1>
          <p>{heading.intro}</p>
        </header>
        <ProjectCalculator locale={locale} />
      </section>
    </SiteShell>
  )
}
