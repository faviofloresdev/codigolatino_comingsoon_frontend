import Link from 'next/link'
import { notFound } from 'next/navigation'
import { HeroGrid } from '@/components/hero-grid'
import { Reveal } from '@/components/reveal'
import { SiteShell } from '@/components/site-shell'
import { SquigglyText } from '@/components/squiggly-text'
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

  const locale: Locale = routeLocale
  const t = translations[locale]

  const homeCopy = {
    es: {
      heroLabel: 'Estudio digital para marcas en crecimiento',
      heroTitle: 'De una idea a una base digital que crece.',
      heroDescription:
        'Diseñamos sitios a medida, branding aplicable y hosting administrado para negocios que necesitan claridad comercial y continuidad técnica.',
      thesisLabel: 'La idea central',
      thesisTitle: 'Tu negocio no necesita piezas digitales sueltas.',
      thesisBody:
        'Conectamos marca, web e infraestructura para que tu empresa se entienda mejor, venda con más confianza y pueda crecer sin empezar de cero.',
      thesisPoints: [
        'Un mensaje claro para tus clientes',
        'Una experiencia coherente en cada punto de contacto',
        'Una base preparada para acompañar el crecimiento',
      ],
      disciplinesLabel: 'Servicios principales',
      disciplinesTitle: 'Tres frentes. Una sola lógica.',
      processLabel: 'Proceso',
      processTitle: 'Trabajamos con una secuencia corta y clara.',
      ctaLabel: 'Siguiente paso',
      ctaTitle: 'Si necesitas una presencia más clara y coherente, conversemos.',
      ctaBody: 'Definimos contigo el alcance correcto y lo convertimos en una base digital lista para trabajar.',
      disciplineCards: [
        {
          title: 'Web a medida',
          lead: 'Presencia precisa.',
          body: 'Arquitectura clara, diseño propio y contenido bien ordenado para que el sitio comunique y convierta.',
        },
        {
          title: 'Hosting administrado',
          lead: 'Operación estable.',
          body: 'Infraestructura, mantenimiento y seguimiento para que la web no se vuelva una carga técnica.',
        },
        {
          title: 'Branding aplicable',
          lead: 'Marca lista para usar.',
          body: 'Una identidad lista para sitio, ventas, redes, piezas internas y crecimiento futuro.',
        },
      ],
    },
    en: {
      heroLabel: 'Digital studio for growing brands',
      heroTitle: 'From an idea to a digital foundation built to grow.',
      heroDescription:
        'We design custom websites, usable branding and managed hosting for businesses that need sharper communication and technical continuity.',
      thesisLabel: 'Core idea',
      thesisTitle: 'Your business does not need disconnected digital pieces.',
      thesisBody:
        'We connect brand, website and infrastructure so your company is easier to understand, sells with more confidence and can grow without starting over.',
      thesisPoints: [
        'A clear message for your customers',
        'A consistent experience at every touchpoint',
        'A foundation ready to support growth',
      ],
      disciplinesLabel: 'Core services',
      disciplinesTitle: 'Three disciplines. One logic.',
      processLabel: 'Process',
      processTitle: 'We work through a short, clear sequence.',
      ctaLabel: 'Next step',
      ctaTitle: 'If you need a clearer, more cohesive digital presence, let us talk.',
      ctaBody: 'We define the right scope with you and turn it into a digital base ready to work.',
      disciplineCards: [
        {
          title: 'Custom web',
          lead: 'Precise presence.',
          body: 'Clear architecture, original design and structured content so the website communicates and converts.',
        },
        {
          title: 'Managed hosting',
          lead: 'Stable operation.',
          body: 'Infrastructure, maintenance and follow-through so the website does not become a technical burden.',
        },
        {
          title: 'Usable branding',
          lead: 'Brand ready to use.',
          body: 'An identity ready for website, sales, social, internal material and future growth.',
        },
      ],
    },
  }[locale]

  return (
    <SiteShell locale={locale} currentPath={`/${locale}`}>
      <Reveal>
        <section className="hero-section pb-16 pt-14 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24" data-grid-hero>
          <HeroGrid />
          <div className="hero-content reveal-stagger mx-auto max-w-5xl text-center">
            <p className="brand-kicker text-[var(--brand-teal)]">
              <SquigglyText>{homeCopy.heroLabel}</SquigglyText>
            </p>
            <h1 className="brand-display mt-6 text-5xl leading-[0.96] font-extrabold text-balance sm:text-7xl lg:text-[5.8rem]">
              {homeCopy.heroTitle}
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-[var(--brand-ink-soft)] sm:text-xl">
              {homeCopy.heroDescription}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href={`/${locale}/contacto`} className="brand-button-primary min-w-56">
                {t.primaryCta}
              </Link>
              <Link href={`/${locale}/servicios`} className="brand-button-secondary min-w-52">
                {t.nav[1]?.label}
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delayMs={120}>
        <section className="brand-section">
          <div className="idea-panel grid gap-10 p-7 text-white sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:p-14">
            <div>
              <p className="idea-label">{homeCopy.thesisLabel}</p>
              <h2 className="brand-display mt-6 max-w-xl text-4xl leading-[0.96] font-bold text-balance sm:text-5xl lg:text-6xl">
                {homeCopy.thesisTitle}
              </h2>
            </div>

            <div className="flex flex-col justify-between gap-10">
              <p className="max-w-2xl text-lg leading-8 text-white/76 sm:text-xl sm:leading-9">{homeCopy.thesisBody}</p>
              <div className="idea-outcomes">
                {homeCopy.thesisPoints.map((item, index) => (
                  <div key={item} className="idea-outcome">
                    <span>{`0${index + 1}`}</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delayMs={160}>
        <section className="service-showcase brand-section -mx-5 px-5 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="editorial-label">{homeCopy.disciplinesLabel}</p>
              <h2 className="brand-display mt-6 max-w-2xl text-5xl leading-[0.9] font-semibold text-balance sm:text-6xl">
                {homeCopy.disciplinesTitle}
              </h2>
            </div>
            <Link href={`/${locale}/servicios`} className="brand-button-secondary">
              {t.nav[1]?.label}
            </Link>
          </div>

          <div className="service-system reveal-stagger">
            {homeCopy.disciplineCards.map((item, index) => (
              <article key={item.title} className="service-item">
                <div className="service-item-meta">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{item.title}</p>
                </div>
                <h3 className="brand-display mt-10 text-3xl leading-[0.94] font-semibold sm:text-4xl">{item.lead}</h3>
                <p className="mt-5 max-w-md text-base leading-8 text-[var(--brand-ink-soft)]">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delayMs={240}>
        <section className="brand-section">
          <div className="mb-10">
            <div>
              <p className="editorial-label">{homeCopy.processLabel}</p>
              <h2 className="brand-display mt-6 max-w-2xl text-5xl leading-[0.9] font-semibold text-balance sm:text-6xl">
                {homeCopy.processTitle}
              </h2>
            </div>
          </div>

          <div className="reveal-stagger grid gap-4 lg:grid-cols-4">
            {t.processSteps.map((item, index) => (
              <article key={item.title} className="process-card surface-card motion-card p-6">
                <p className="editorial-number">{`0${index + 1}`}</p>
                <h3 className="brand-display mt-5 text-3xl leading-[0.94] font-semibold">{item.title}</h3>
                <p className="mt-4 text-base leading-8 text-[var(--brand-ink-soft)]">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delayMs={280}>
        <section className="brand-section border-t border-[var(--brand-line)]">
          <div className="section-frame grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end lg:p-10">
            <div>
              <p className="editorial-label">{homeCopy.ctaLabel}</p>
              <h2 className="brand-display mt-6 max-w-3xl text-5xl leading-[0.9] font-semibold text-balance sm:text-6xl">
                {homeCopy.ctaTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--brand-ink-soft)]">{homeCopy.ctaBody}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href={`/${locale}/contacto`} className="brand-button-primary min-w-56">
                {t.primaryCta}
              </Link>
              <Link href={`/${locale}/servicios`} className="brand-button-secondary min-w-56">
                {t.nav[1]?.label}
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </SiteShell>
  )
}
