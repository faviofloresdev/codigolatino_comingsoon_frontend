import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Reveal } from '@/components/reveal'
import { SiteShell } from '@/components/site-shell'
import { Locale, isLocale, translations } from '@/lib/i18n'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: routeLocale } = await params
  const locale: Locale = isLocale(routeLocale) ? routeLocale : 'es'
  return {
    title: locale === 'es' ? 'Servicios digitales | Codigo Latino' : 'Digital services | Codigo Latino',
    description: locale === 'es'
      ? 'Desarrollo web y de aplicaciones, hosting administrado, mantenimiento y branding para negocios en crecimiento.'
      : 'Web and application development, managed hosting, maintenance and branding for growing businesses.',
  }
}

const servicePageCopy: Record<
  Locale,
  {
    heroLabel: string
    heroTitle: string
    heroThesis: string
    services: Array<{ title: string; description: string }>
  }
> = {
  es: {
    heroLabel: 'Diseño · Tecnología · Operación',
    heroTitle: 'Servicios que hacen avanzar tu negocio.',
    heroThesis:
      'Diseñamos, construimos y operamos soluciones digitales que fortalecen tu marca, simplifican tu operación y acompañan el crecimiento.',
    services: [
      {
        title: 'Desarrollo web',
        description:
          'Creamos páginas web y plataformas a medida, rápidas, administrables y alineadas con los objetivos de tu negocio.',
      },
      {
        title: 'Desarrollo de aplicaciones',
        description:
          'Construimos aplicaciones web y móviles intuitivas, escalables y preparadas para integrarse con tu operación.',
      },
      {
        title: 'Mantenimiento web y apps',
        description:
          'Resolvemos incidencias, actualizamos dependencias e incorporamos mejoras para mantener tus productos digitales vigentes.',
      },
      {
        title: 'Hosting administrado',
        description:
          'Gestionamos despliegues, seguridad, monitoreo y respaldos para que tu plataforma permanezca disponible y protegida.',
      },
      {
        title: 'Desarrollo de marca',
        description:
          'Definimos identidad visual, lenguaje y lineamientos para construir una marca clara, reconocible y consistente.',
      },
      {
        title: 'Curaduría de marca',
        description:
          'Revisamos y refinamos marcas existentes para corregir inconsistencias y mejorar su aplicación en cada canal.',
      },
    ],
  },
  en: {
    heroLabel: 'Design · Technology · Operations',
    heroTitle: 'Services that move your business forward.',
    heroThesis:
      'We design, build and operate digital solutions that strengthen your brand, simplify operations and support sustainable growth.',
    services: [
      {
        title: 'Web development',
        description:
          'Custom websites and platforms that are fast, manageable and aligned with your business goals.',
      },
      {
        title: 'Application development',
        description:
          'Intuitive, scalable web and mobile applications designed to integrate with your operations.',
      },
      {
        title: 'Web and app maintenance',
        description:
          'Issue resolution, dependency updates and continuous improvements that keep your digital products current.',
      },
      {
        title: 'Managed hosting',
        description:
          'Deployment, security, monitoring and backups that keep your platform available and protected.',
      },
      {
        title: 'Brand development',
        description:
          'Visual identity, language and guidelines that build a clear, recognizable and consistent brand.',
      },
      {
        title: 'Brand curation',
        description:
          'Existing brands reviewed and refined to resolve inconsistencies and improve their application across channels.',
      },
    ],
  },
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale: routeLocale } = await params
  if (!isLocale(routeLocale)) {
    notFound()
  }

  const locale: Locale = routeLocale
  const t = translations[locale]
  const copy = servicePageCopy[locale]

  return (
    <SiteShell locale={locale} currentPath={`/${locale}/servicios`}>
      <Reveal>
        <section className="services-image-hero">
          <div className="services-image-hero-overlay">
            <div className="services-image-hero-topline">
              <p className="editorial-label text-white">{copy.heroLabel}</p>
              <a
                href="https://unsplash.com/photos/silver-macbook-air-on-table-near-imac-jJT2r2n7lYA/"
                target="_blank"
                rel="noreferrer"
              >
                UX Store / Unsplash
              </a>
            </div>

            <div className="services-image-hero-content">
              <h1 className="brand-display">{copy.heroTitle}</h1>
              <div>
                <p>{copy.heroThesis}</p>
                <Link
                  href={`/${locale}/contacto`}
                  className="brand-button-accent"
                >
                  {t.primaryCta}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delayMs={80}>
        <section className="services-grid-section brand-section">
          <div className="mb-10 max-w-2xl">
            <p className="editorial-label">
              {locale === 'es' ? 'Especialidades' : 'Expertise'}
            </p>
            <h2 className="brand-display mt-5 text-4xl leading-[0.94] font-semibold sm:text-5xl">
              {locale === 'es'
                ? 'De la estrategia a la operación.'
                : 'From strategy to operation.'}
            </h2>
          </div>

          <div className="services-card-grid reveal-stagger">
            {copy.services.map((item, index) => (
              <article key={item.title} className="service-simple-card">
                <p className="editorial-number">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="brand-display">{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

    </SiteShell>
  )
}
