import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectBrief } from '@/components/project-brief'
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
    path: '/brief',
    title: locale === 'es' ? 'Brief del proyecto | Código Latino' : 'Project brief | Codigo Latino',
    description: locale === 'es'
      ? 'Comparte el contexto necesario para convertir tu estimación en una propuesta de proyecto.'
      : 'Share the context needed to turn your estimate into a project proposal.',
    index: false,
  })
}

export default async function BriefPage({ params }: PageProps) {
  const { locale: routeLocale } = await params
  if (!isLocale(routeLocale)) notFound()
  const locale: Locale = routeLocale
  const heading = locale === 'es'
    ? {
        label: 'Brief del proyecto',
        title: 'La cifra define el alcance. El contexto define la solución.',
        intro: 'Cuéntanos lo esencial del negocio, la audiencia y el resultado esperado. Puedes avanzar por etapas y volver después.',
      }
    : {
        label: 'Project brief',
        title: 'The number defines scope. Context defines the solution.',
        intro: 'Tell us the essentials about the business, audience and expected outcome. You can progress in stages and return later.',
      }

  return (
    <SiteShell locale={locale} currentPath={`/${locale}/brief`}>
      <section className="brief-page brand-section pt-6">
        <ProjectProcess locale={locale} activeStep={2} />
        <header className="brief-page-header">
          <p className="editorial-label">{heading.label}</p>
          <h1 className="brand-display">{heading.title}</h1>
          <p>{heading.intro}</p>
        </header>
        <ProjectBrief locale={locale} />
      </section>
    </SiteShell>
  )
}
