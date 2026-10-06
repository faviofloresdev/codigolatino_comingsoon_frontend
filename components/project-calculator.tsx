'use client'

import Link from 'next/link'
import { ArrowRight, Check, Minus, Plus, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Locale } from '@/lib/i18n'

const PRICING = {
  projects: {
    landing: { price: 250, includedPages: 1 },
    corporate: { price: 500, includedPages: 5 },
    commerce: { price: 900, includedPages: 8 },
    webapp: { price: 1500, includedPages: 6 },
  },
  design: { basic: 1, professional: 1.05, signature: 1.1 },
  features: { cms: 100, booking: 120, payments: 150, accounts: 200, languages: 75, integrations: 150 },
  extras: { copy: 80, stock: 50, analytics: 60 },
  timing: { flexible: 0.95, standard: 1, priority: 1.1 },
  extraPage: 40,
  maintenance: 15,
  seoAnalysis: 70,
} as const

type ProjectKey = keyof typeof PRICING.projects
type DesignKey = keyof typeof PRICING.design
type FeatureKey = keyof typeof PRICING.features
type ExtraKey = keyof typeof PRICING.extras
type TimingKey = keyof typeof PRICING.timing

const INCLUDED_FEATURES: Partial<Record<ProjectKey, readonly FeatureKey[]>> = {
  commerce: ['cms', 'payments'],
}

const copy = {
  es: {
    label: 'Estimador de proyectos',
    title: 'Define un alcance inicial antes de conversar.',
    intro: 'Explora combinaciones, entiende qué mueve la inversión y llega a la primera conversación con una base más clara.',
    estimate: 'Estimado en vivo',
    reset: 'Reiniciar',
    investment: 'Inversión estimada',
    range: 'Rango orientativo',
    scope: 'Nivel de alcance',
    scopeLabels: ['Esencial', 'Intermedio', 'Avanzado'],
    base: 'Base del proyecto',
    baseIntro: 'Elige el formato más cercano. El alcance final se valida contigo.',
    pages: 'Páginas o vistas',
    included: 'incluidas en la base',
    extraPagePrice: 'cada página adicional',
    design: 'Dirección visual',
    designIntro: 'Cuánto trabajo de identidad y personalización requiere la experiencia.',
    features: 'Funciones del producto',
    featuresIntro: 'Activa solo las capacidades que el proyecto necesita para operar.',
    launch: 'Contenido y lanzamiento',
    launchIntro: 'Servicios que ayudan a llegar al mercado con una base mejor resuelta.',
    timing: 'Ritmo de entrega',
    timingIntro: 'La fecha definitiva depende de disponibilidad y validación técnica.',
    breakdown: 'Desglose',
    projectBase: 'Proyecto base',
    extraPages: 'Páginas adicionales',
    designDirection: 'Dirección visual',
    selectedFunctions: 'Funciones seleccionadas',
    includedInProject: 'Incluido en este proyecto',
    launchServices: 'Servicios de lanzamiento',
    bundle: 'Ajuste por combinación',
    delivery: 'Ritmo de entrega',
    hosting: 'Soporte y hosting administrado',
    seoIncluded: 'SEO técnico inicial incluido',
    seoIncludedDetail: 'Estructura, metadata e indexación configuradas desde el lanzamiento.',
    seoAnalysis: 'Análisis SEO continuo',
    seoAnalysisDetail: 'Seguimiento, revisión de rendimiento y recomendaciones periódicas.',
    optional: 'Publicación, monitoreo y soporte técnico mensual.',
    monthly: '/ mes',
    cta: 'Continuar al brief',
    referenceNotice: 'Precios referenciales. Al completar el brief y enviar la solicitud, revisaremos el alcance y te enviaremos el plan final del proyecto.',
    disclaimer: 'La cifra mostrada no constituye una oferta contractual. Puede variar según objetivos, contenido, integraciones y requerimientos técnicos.',
    from: 'Desde',
    removePage: 'Quitar una página',
    addPage: 'Agregar una página',
  },
  en: {
    label: 'Project estimator',
    title: 'Define an initial scope before we talk.',
    intro: 'Explore combinations, understand what moves the investment and start the first conversation with a clearer foundation.',
    estimate: 'Live estimate',
    reset: 'Reset',
    investment: 'Estimated investment',
    range: 'Suggested range',
    scope: 'Scope level',
    scopeLabels: ['Essential', 'Intermediate', 'Advanced'],
    base: 'Project foundation',
    baseIntro: 'Choose the closest format. We validate the final scope with you.',
    pages: 'Pages or views',
    included: 'included in the foundation',
    extraPagePrice: 'per additional page',
    design: 'Visual direction',
    designIntro: 'How much identity and customization the experience requires.',
    features: 'Product capabilities',
    featuresIntro: 'Enable only what the project needs to operate.',
    launch: 'Content and launch',
    launchIntro: 'Services that help the project reach the market with a stronger base.',
    timing: 'Delivery pace',
    timingIntro: 'The final date depends on availability and technical validation.',
    breakdown: 'Breakdown',
    projectBase: 'Project foundation',
    extraPages: 'Additional pages',
    designDirection: 'Visual direction',
    selectedFunctions: 'Selected capabilities',
    includedInProject: 'Included in this project',
    launchServices: 'Launch services',
    bundle: 'Bundle adjustment',
    delivery: 'Delivery pace',
    hosting: 'Managed support and hosting',
    seoIncluded: 'Initial technical SEO included',
    seoIncludedDetail: 'Structure, metadata and indexing configured from launch.',
    seoAnalysis: 'Ongoing SEO analysis',
    seoAnalysisDetail: 'Monitoring, performance review and periodic recommendations.',
    optional: 'Deployment, monitoring and monthly technical support.',
    monthly: '/ month',
    cta: 'Continue to brief',
    referenceNotice: 'Reference pricing. Once you complete the brief and submit the request, we will review the scope and send you the final project plan.',
    disclaimer: 'The displayed amount is not a contractual offer. It may vary according to goals, content, integrations and technical requirements.',
    from: 'From',
    removePage: 'Remove one page',
    addPage: 'Add one page',
  },
} as const

const labels = {
  es: {
    projects: {
      landing: ['Landing page', 'Una página para presentar una oferta y conducir a una acción concreta.'],
      corporate: ['Web corporativa', 'Sitio de varias secciones para explicar la empresa, sus servicios y canales de contacto.'],
      commerce: ['E-commerce', 'Tienda con catálogo, carrito, proceso de compra y conexión con pagos.'],
      webapp: ['Aplicación web', 'Producto a medida con flujos, datos y funciones propias del negocio.'],
    },
    design: {
      basic: ['Esencial', 'Diseño funcional basado en un sistema visual probado y adaptado a la marca.'],
      professional: ['Profesional', 'Composición, recursos y detalles visuales personalizados para el proyecto.'],
      signature: ['Signature', 'Dirección de arte y sistema visual propio con mayor nivel de exploración.'],
    },
    features: {
      cms: ['CMS autogestionable', 'Panel para editar páginas, textos o publicaciones sin modificar código.'],
      booking: ['Reservas y calendario', 'Disponibilidad, selección de horarios y confirmación de citas o reservas.'],
      payments: ['Pagos en línea', 'Conexión segura con Stripe u otra pasarela para cobrar desde el sitio.'],
      accounts: ['Cuentas de usuario', 'Registro, inicio de sesión y áreas privadas según el tipo de usuario.'],
      languages: ['Segundo idioma', 'Estructura traducible, navegación localizada y contenido en otro idioma.'],
      integrations: ['Integración externa', 'Conexión con CRM, ERP, API, automatización u otra plataforma.'],
    },
    extras: {
      copy: ['Copywriting', 'Redacción y edición de los textos principales para comunicar y convertir mejor.'],
      stock: ['Curaduría de imágenes', 'Búsqueda, selección y organización de imágenes con licencia adecuada.'],
      analytics: ['Analítica avanzada', 'Configuración de eventos y conversiones para medir acciones relevantes.'],
    },
    timing: {
      flexible: ['Flexible', '10–14 semanas con una planificación más abierta', '− 5%'],
      standard: ['Estándar', '6–9 semanas con el ritmo habitual del estudio', 'Incluido'],
      priority: ['Prioritario', '3–5 semanas con capacidad reservada para acelerar', '+ 10%'],
    },
  },
  en: {
    projects: {
      landing: ['Landing page', 'One page designed to present an offer and drive one specific action.'],
      corporate: ['Corporate website', 'A multi-section site explaining the company, services and contact channels.'],
      commerce: ['E-commerce', 'A store with catalog, cart, checkout flow and payment connection.'],
      webapp: ['Web application', 'A custom product with business-specific flows, data and capabilities.'],
    },
    design: {
      basic: ['Essential', 'Functional design based on a proven visual system adapted to the brand.'],
      professional: ['Professional', 'Customized composition, visual assets and details for the project.'],
      signature: ['Signature', 'Art direction and a distinct visual system with deeper exploration.'],
    },
    features: {
      cms: ['Self-managed CMS', 'A panel for editing pages, copy or posts without changing code.'],
      booking: ['Booking and calendar', 'Availability, time selection and appointment or booking confirmation.'],
      payments: ['Online payments', 'Secure connection to Stripe or another gateway for website payments.'],
      accounts: ['User accounts', 'Registration, sign-in and private areas based on user type.'],
      languages: ['Second language', 'Translatable structure, localized navigation and content in another language.'],
      integrations: ['External integration', 'Connection to a CRM, ERP, API, automation or another platform.'],
    },
    extras: {
      copy: ['Copywriting', 'Writing and editing of the main copy to communicate and convert more clearly.'],
      stock: ['Image curation', 'Research, selection and organization of properly licensed imagery.'],
      analytics: ['Advanced analytics', 'Event and conversion setup to measure meaningful user actions.'],
    },
    timing: {
      flexible: ['Flexible', '10–14 weeks with a more open schedule', '− 5%'],
      standard: ['Standard', '6–9 weeks at the studio’s regular pace', 'Included'],
      priority: ['Priority', '3–5 weeks with reserved capacity to accelerate delivery', '+ 10%'],
    },
  },
} as const

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
    .format(value)
    .replace('$', 'US$')
}

export function ProjectCalculator({ locale }: { locale: Locale }) {
  const text = copy[locale]
  const names = labels[locale]
  const [project, setProject] = useState<ProjectKey>('landing')
  const [pages, setPages] = useState(1)
  const [design, setDesign] = useState<DesignKey>('basic')
  const [features, setFeatures] = useState<FeatureKey[]>([])
  const [extras, setExtras] = useState<ExtraKey[]>([])
  const [timing, setTiming] = useState<TimingKey>('standard')
  const [maintenance, setMaintenance] = useState(true)
  const [seoAnalysis, setSeoAnalysis] = useState(false)

  const projectPricing = PRICING.projects[project]
  const includedFeatures = INCLUDED_FEATURES[project] || []
  const paidFeatures = features.filter((key) => !includedFeatures.includes(key))
  const extraPages = Math.max(0, pages - projectPricing.includedPages)
  const pagesCost = extraPages * PRICING.extraPage
  const baseBeforeDesign = projectPricing.price + pagesCost
  const designCost = Math.round(baseBeforeDesign * (PRICING.design[design] - 1))
  const featuresCost = paidFeatures.reduce((sum, key) => sum + PRICING.features[key], 0)
  const extrasCost = extras.reduce((sum, key) => sum + PRICING.extras[key], 0)
  const selectedServices = paidFeatures.length + extras.length
  const bundleRate = selectedServices >= 6 ? 0.3 : selectedServices >= 3 ? 0.15 : 0
  const bundleDiscount = Math.round((featuresCost + extrasCost) * bundleRate)
  const subtotal = baseBeforeDesign + designCost + featuresCost + extrasCost - bundleDiscount
  const timingCost = Math.round(subtotal * (PRICING.timing[timing] - 1))
  const total = Math.round((subtotal + timingCost) / 10) * 10
  const rangeLow = Math.round((total * 0.92) / 10) * 10
  const rangeHigh = Math.round((total * 1.08) / 10) * 10
  const scopePercent = Math.min(100, Math.max(12, (total / 2600) * 100))
  const scopeLabel = total < 700 ? text.scopeLabels[0] : total < 1500 ? text.scopeLabels[1] : text.scopeLabels[2]

  function toggleItem<T extends string>(item: T, values: T[], setter: (next: T[]) => void) {
    setter(values.includes(item) ? values.filter((value) => value !== item) : [...values, item])
  }

  function reset() {
    setProject('landing')
    setPages(1)
    setDesign('basic')
    setFeatures([])
    setExtras([])
    setTiming('standard')
    setMaintenance(true)
    setSeoAnalysis(false)
  }

  function saveEstimate() {
    const summary = {
      locale,
      project: names.projects[project][0],
      pages,
      design: names.design[design][0],
      features: Array.from(new Set([...includedFeatures, ...features])).map((key) => names.features[key][0]),
      extras: extras.map((key) => names.extras[key][0]),
      timing: names.timing[timing][0],
      maintenance,
      seoAnalysis,
      total,
      rangeLow,
      rangeHigh,
      breakdown: breakdown.map(([label, amount]) => ({ label, amount })),
      savedAt: new Date().toISOString(),
    }
    window.localStorage.setItem('codigo-latino-quote-v1', JSON.stringify(summary))
  }

  const breakdown: Array<readonly [string, number]> = [
    [text.projectBase, projectPricing.price],
    ...(pagesCost ? [[text.extraPages, pagesCost] as const] : []),
    ...(designCost ? [[text.designDirection, designCost] as const] : []),
    ...(featuresCost ? [[text.selectedFunctions, featuresCost] as const] : []),
    ...(extrasCost ? [[text.launchServices, extrasCost] as const] : []),
    ...(bundleDiscount ? [[text.bundle, -bundleDiscount] as const] : []),
    ...(timingCost ? [[text.delivery, timingCost] as const] : []),
  ]

  return (
    <div className="calculator-grid">
      <div className="calculator-mobile-total" aria-live="polite">
        <span>{text.investment}</span>
        <strong>{formatMoney(total)}</strong>
      </div>
      <div className="calculator-configurator">
        <section className="calculator-section">
          <div className="calculator-section-heading">
            <span>01</span>
            <div><h2>{text.base}</h2><p>{text.baseIntro}</p></div>
          </div>
          <div className="calculator-projects">
            {(Object.keys(PRICING.projects) as ProjectKey[]).map((key) => (
              <label key={key} className="calculator-choice">
                <input type="radio" name="project" checked={project === key} onChange={() => { setProject(key); setPages(PRICING.projects[key].includedPages) }} />
                <span><small>{text.from} {formatMoney(PRICING.projects[key].price)}</small><strong>{names.projects[key][0]}</strong><em>{names.projects[key][1]}</em></span>
              </label>
            ))}
          </div>
          <div className="calculator-included-note"><Check size={15} /><span><strong>{text.seoIncluded}</strong><small>{text.seoIncludedDetail}</small></span></div>
          <div className="calculator-counter-row">
            <div><strong>{text.pages}</strong><span>{projectPricing.includedPages} {text.included} · + {formatMoney(PRICING.extraPage)} {text.extraPagePrice}</span></div>
            <div className="calculator-counter">
              <button type="button" onClick={() => setPages(Math.max(1, pages - 1))} aria-label={text.removePage}><Minus size={16} /></button>
              <output>{pages}</output>
              <button type="button" onClick={() => setPages(Math.min(30, pages + 1))} aria-label={text.addPage}><Plus size={16} /></button>
            </div>
          </div>
          <input className="calculator-range" type="range" min="1" max="30" value={pages} onChange={(event) => setPages(Number(event.target.value))} aria-label={text.pages} />
        </section>

        <section className="calculator-section">
          <div className="calculator-section-heading"><span>02</span><div><h2>{text.design}</h2><p>{text.designIntro}</p></div></div>
          <div className="calculator-segments">
            {(Object.keys(PRICING.design) as DesignKey[]).map((key) => (
              <label key={key}><input type="radio" name="design" checked={design === key} onChange={() => setDesign(key)} /><span><strong>{names.design[key][0]}</strong><small>{names.design[key][1]}</small></span></label>
            ))}
          </div>
        </section>

        <section className="calculator-section">
          <div className="calculator-section-heading"><span>03</span><div><h2>{text.features}</h2><p>{text.featuresIntro}</p></div></div>
          <div className="calculator-feature-list">
            {(Object.keys(PRICING.features) as FeatureKey[]).map((key) => {
              const isIncluded = includedFeatures.includes(key)
              return (
                <label key={key} className={isIncluded ? 'is-included' : undefined}>
                  <input type="checkbox" checked={isIncluded || features.includes(key)} disabled={isIncluded} onChange={() => toggleItem(key, features, setFeatures)} />
                  <span className="calculator-check" />
                  <span><strong>{names.features[key][0]}</strong><small>{names.features[key][1]}</small></span>
                  <b>{isIncluded ? text.includedInProject : `+ ${formatMoney(PRICING.features[key])}`}</b>
                </label>
              )
            })}
          </div>
        </section>

        <section className="calculator-section">
          <div className="calculator-section-heading"><span>04</span><div><h2>{text.launch}</h2><p>{text.launchIntro}</p></div></div>
          <div className="calculator-extras">
            {(Object.keys(PRICING.extras) as ExtraKey[]).map((key) => (
              <label key={key}><span><strong>{names.extras[key][0]}</strong><small>{names.extras[key][1]} · + {formatMoney(PRICING.extras[key])}</small></span><input type="checkbox" checked={extras.includes(key)} onChange={() => toggleItem(key, extras, setExtras)} /><i /></label>
            ))}
          </div>
          <div className="calculator-subheading"><strong>{text.timing}</strong><p>{text.timingIntro}</p></div>
          <div className="calculator-timing">
            {(Object.keys(PRICING.timing) as TimingKey[]).map((key) => (
              <label key={key}><input type="radio" name="timing" checked={timing === key} onChange={() => setTiming(key)} /><span><strong>{names.timing[key][0]}</strong><small>{names.timing[key][1]}</small><em>{names.timing[key][2]}</em></span></label>
            ))}
          </div>
        </section>
      </div>

      <aside className="calculator-summary">
        <div className="calculator-summary-card">
          <div className="calculator-summary-head"><span><i />{text.estimate}</span><button type="button" onClick={reset}><RotateCcw size={14} />{text.reset}</button></div>
          <div className="calculator-total" aria-live="polite"><span>{text.investment}</span><strong>{formatMoney(total)}</strong><small>{text.range}: {formatMoney(rangeLow)} – {formatMoney(rangeHigh)}</small></div>
          <div className="calculator-meter"><div><span>{text.scope}</span><b>{scopeLabel}</b></div><i><span style={{ width: `${scopePercent}%` }} /></i></div>
          <div className="calculator-breakdown"><p>{text.breakdown}</p>{breakdown.map(([label, amount]) => <div key={label}><span>{label}</span><b className={amount < 0 ? 'is-discount' : ''}>{amount < 0 ? '− ' : ''}{formatMoney(Math.abs(amount))}</b></div>)}</div>
          <label className="calculator-maintenance"><span><strong>{text.hosting}</strong><small>{text.optional}</small></span><input type="checkbox" checked={maintenance} onChange={(event) => setMaintenance(event.target.checked)} /><i /><b>{formatMoney(PRICING.maintenance)} {text.monthly}</b></label>
          <label className="calculator-maintenance"><span><strong>{text.seoAnalysis}</strong><small>{text.seoAnalysisDetail}</small></span><input type="checkbox" checked={seoAnalysis} onChange={(event) => setSeoAnalysis(event.target.checked)} /><i /><b>{formatMoney(PRICING.seoAnalysis)} {text.monthly}</b></label>
          <p className="calculator-reference-notice">{text.referenceNotice}</p>
          <div className="calculator-summary-actions">
            <Link href={`/${locale}/brief`} onClick={saveEstimate} className="brand-button-primary">{text.cta}<ArrowRight size={17} /></Link>
          </div>
          <p className="calculator-disclaimer">{text.disclaimer}</p>
        </div>
      </aside>
    </div>
  )
}
