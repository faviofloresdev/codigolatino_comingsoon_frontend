import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContactSection } from '@/components/contact-section'
import { Reveal } from '@/components/reveal'
import { SiteShell } from '@/components/site-shell'
import { isLocale, Locale } from '@/lib/i18n'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: routeLocale } = await params
  const locale: Locale = isLocale(routeLocale) ? routeLocale : 'es'
  return {
    title: locale === 'es' ? 'Contacto | Codigo Latino' : 'Contact | Codigo Latino',
    description: locale === 'es'
      ? 'Cuéntanos qué necesitas construir o mejorar y definamos el siguiente paso de tu proyecto digital.'
      : 'Tell us what you need to build or improve and let us define the next step for your digital project.',
  }
}

export default async function ContactPage({ params }: PageProps) {
  const { locale: routeLocale } = await params
  if (!isLocale(routeLocale)) {
    notFound()
  }

  const locale = routeLocale

  return (
    <SiteShell locale={locale} currentPath={`/${locale}/contacto`}>
      <Reveal delayMs={40}>
        <section className="contact-main-section brand-section">
          <ContactSection locale={locale} />
        </section>
      </Reveal>
    </SiteShell>
  )
}
