'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Locale } from '@/lib/i18n'

type BriefData = Record<string, string | string[]>

const initialData: BriefData = {
  business: '', brandValues: '', differentiators: '', brandPerception: '',
  audience: '', competitors: '', objective: '', primaryAction: '', successCriteria: '',
  brandAssets: 'complete', brandColors: '', visualStyle: [], typography: [],
  contentStatus: '', currentSite: '', references: '', deadline: 'flexible',
  decisionMaker: '', requirements: '',
}

const content = {
  es: {
    saved: 'El borrador se guarda en este dispositivo al avanzar.',
    previous: 'Anterior', next: 'Siguiente', finish: 'Continuar al envío',
    step: 'Paso', of: 'de', optional: 'Opcional', required: 'Campo requerido',
    steps: [
      { title: 'Empresa', intro: 'Primero necesitamos entender qué hace el negocio y por qué debería importarle a su cliente.' },
      { title: 'Público y competencia', intro: 'Define para quién estamos diseñando y qué alternativas tiene esa audiencia.' },
      { title: 'Objetivo del proyecto', intro: 'Un sitio útil necesita una acción principal y una medida clara de éxito.' },
      { title: 'Identidad visual', intro: 'Cuéntanos con qué activos contamos y cómo debería sentirse la marca.' },
      { title: 'Contenido y referencias', intro: 'Revisamos el material disponible y las referencias que ayudan a definir el criterio visual.' },
      { title: 'Alcance y expectativas', intro: 'Cerramos con tiempos, responsables y condiciones imprescindibles.' },
    ],
    fields: {
      business: ['¿A qué se dedica tu negocio o proyecto?', 'Describe qué haces, qué vendes o qué servicio ofreces.'],
      brandValues: ['¿Qué valores promueve la empresa?', 'Calidad, confianza, innovación, cercanía o atención personalizada.'],
      differentiators: ['¿Por qué te eligen frente a otras opciones?', 'Servicio, experiencia, especialización, resultados o modelo comercial.'],
      brandPerception: ['¿Cómo debería percibirse la marca?', 'Profesional, cercana, moderna, especializada...'],
      audience: ['¿A quién quieres llegar?', 'Ubicación, tipo de cliente, necesidades, intereses o tipo de empresa.'],
      competitors: ['Competidores o alternativas actuales', 'Nombres, enlaces o tipos de negocio con los que compites.'],
      successCriteria: ['¿Qué resultado haría exitoso el proyecto?', 'Solicitudes, ventas, reservas, registros o reducción de tareas manuales.'],
      brandColors: ['Colores, preferencias o restricciones visuales', 'Incluye colores actuales, códigos o sensaciones que deseas transmitir.'],
      currentSite: ['Sitio web actual', 'https://tusitio.com'],
      references: ['Referencias que te gustan', 'Comparte enlaces y explica brevemente qué funciona para ti.'],
      decisionMaker: ['¿Quién aprobará las decisiones?', 'Tú, un socio, un equipo o un área específica.'],
      requirements: ['Requisitos imprescindibles o comentarios', 'Integraciones, restricciones, funciones o cualquier detalle relevante.'],
    },
    objective: 'Objetivo principal', action: 'Acción principal del visitante', assets: 'Estado de la identidad',
    styles: 'Sensación visual deseada', typography: 'Dirección tipográfica', contentStatus: 'Estado del contenido', deadline: 'Fecha ideal de publicación',
    select: 'Selecciona una opción',
  },
  en: {
    saved: 'Your draft is saved on this device as you progress.',
    previous: 'Previous', next: 'Next', finish: 'Continue to submit',
    step: 'Step', of: 'of', optional: 'Optional', required: 'Required field',
    steps: [
      { title: 'Business', intro: 'First, we need to understand what the business does and why customers should care.' },
      { title: 'Audience and competition', intro: 'Define who we are designing for and what alternatives that audience has.' },
      { title: 'Project objective', intro: 'A useful website needs one primary action and a clear measure of success.' },
      { title: 'Visual identity', intro: 'Tell us what assets already exist and how the brand should feel.' },
      { title: 'Content and references', intro: 'We review available material and the references that help define visual direction.' },
      { title: 'Scope and expectations', intro: 'We close with timing, decision makers and non-negotiable requirements.' },
    ],
    fields: {
      business: ['What does your business or project do?', 'Describe what you do, sell or provide.'],
      brandValues: ['What values does the company promote?', 'Quality, trust, innovation, proximity or personalized service.'],
      differentiators: ['Why do clients choose you?', 'Service, experience, specialization, results or business model.'],
      brandPerception: ['How should the brand be perceived?', 'Professional, approachable, modern, specialized...'],
      audience: ['Who do you want to reach?', 'Location, customer type, needs, interests or company profile.'],
      competitors: ['Current competitors or alternatives', 'Names, links or types of businesses you compete with.'],
      successCriteria: ['What outcome would make this project successful?', 'Leads, sales, bookings, registrations or fewer manual tasks.'],
      brandColors: ['Colors, preferences or visual restrictions', 'Include current colors, codes or feelings you want to convey.'],
      currentSite: ['Current website', 'https://yourwebsite.com'],
      references: ['References you like', 'Share links and briefly explain what works for you.'],
      decisionMaker: ['Who will approve decisions?', 'You, a partner, a team or a specific department.'],
      requirements: ['Non-negotiable requirements or comments', 'Integrations, restrictions, capabilities or any relevant detail.'],
    },
    objective: 'Primary objective', action: 'Visitor’s primary action', assets: 'Identity status',
    styles: 'Desired visual feel', typography: 'Typography direction', contentStatus: 'Content status', deadline: 'Ideal launch date',
    select: 'Select an option',
  },
} as const

const options = {
  es: {
    objective: [['leads', 'Generar prospectos'], ['sales', 'Vender productos o servicios'], ['presence', 'Presentar la marca'], ['bookings', 'Recibir reservas'], ['platform', 'Crear una plataforma']],
    action: [['whatsapp', 'Escribir por WhatsApp'], ['form', 'Completar un formulario'], ['buy', 'Comprar o pagar'], ['book', 'Reservar una cita'], ['register', 'Registrarse'], ['learn', 'Conocer la empresa']],
    assets: [['complete', 'Logo y sistema de marca'], ['logo', 'Solo logo'], ['partial', 'Algunos elementos'], ['none', 'Sin identidad visual'], ['update', 'Necesita actualización']],
    styles: [['minimal', 'Minimalista'], ['warm', 'Cálida'], ['modern', 'Tecnológica'], ['classic', 'Clásica'], ['fresh', 'Fresca'], ['bold', 'Expresiva']],
    typography: [['serif', 'Serif'], ['sans-serif', 'Sans serif'], ['script', 'Caligráfica'], ['display', 'Display'], ['open', 'Sin preferencia']],
    content: [['ready', 'Textos e imágenes listos'], ['partial', 'Contenido parcial'], ['help', 'Necesito apoyo'], ['none', 'Aún no existe contenido']],
    deadline: [['flexible', 'Flexible'], ['three-months', 'Dentro de 3 meses'], ['two-months', 'Dentro de 2 meses'], ['one-month', 'Dentro de 1 mes'], ['urgent', 'Lo antes posible']],
  },
  en: {
    objective: [['leads', 'Generate leads'], ['sales', 'Sell products or services'], ['presence', 'Present the brand'], ['bookings', 'Receive bookings'], ['platform', 'Build a platform']],
    action: [['whatsapp', 'Start a WhatsApp conversation'], ['form', 'Complete a form'], ['buy', 'Purchase or pay'], ['book', 'Book an appointment'], ['register', 'Register'], ['learn', 'Learn about the company']],
    assets: [['complete', 'Logo and brand system'], ['logo', 'Logo only'], ['partial', 'Some brand assets'], ['none', 'No visual identity'], ['update', 'Needs an update']],
    styles: [['minimal', 'Minimal'], ['warm', 'Warm'], ['modern', 'Technology-led'], ['classic', 'Classic'], ['fresh', 'Fresh'], ['bold', 'Expressive']],
    typography: [['serif', 'Serif'], ['sans-serif', 'Sans serif'], ['script', 'Script'], ['display', 'Display'], ['open', 'No preference']],
    content: [['ready', 'Copy and images are ready'], ['partial', 'Partial content'], ['help', 'I need support'], ['none', 'No content yet']],
    deadline: [['flexible', 'Flexible'], ['three-months', 'Within 3 months'], ['two-months', 'Within 2 months'], ['one-month', 'Within 1 month'], ['urgent', 'As soon as possible']],
  },
} as const

export function ProjectBrief({ locale }: { locale: Locale }) {
  const text = content[locale]
  const choices = options[locale]
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [step, setStep] = useState(0)
  const [data, setData] = useState<BriefData>(initialData)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('codigo-latino-brief-v2')
      if (saved) setData({ ...initialData, ...(JSON.parse(saved) as BriefData) })
    } catch {
      // Invalid local drafts are ignored.
    }
  }, [])

  function update(name: string, value: string) {
    setData((current) => ({ ...current, [name]: value }))
  }

  function toggle(name: string, value: string) {
    setData((current) => {
      const selected = Array.isArray(current[name]) ? current[name] as string[] : []
      return { ...current, [name]: selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value] }
    })
  }

  function saveDraft(nextData = data) {
    const objectiveLabel = choices.objective.find(([value]) => value === nextData.objective)?.[1] || ''
    const primaryActionLabel = choices.action.find(([value]) => value === nextData.primaryAction)?.[1] || ''
    const brandAssetsLabel = choices.assets.find(([value]) => value === nextData.brandAssets)?.[1] || ''
    const contentStatusLabel = choices.content.find(([value]) => value === nextData.contentStatus)?.[1] || ''
    const deadlineLabel = choices.deadline.find(([value]) => value === nextData.deadline)?.[1] || ''
    const visualStyleLabels = choices.styles
      .filter(([value]) => (nextData.visualStyle as string[]).includes(value))
      .map(([, label]) => label)
    const typographyLabels = choices.typography
      .filter(([value]) => (nextData.typography as string[]).includes(value))
      .map(([, label]) => label)
    window.localStorage.setItem('codigo-latino-brief-v2', JSON.stringify({
      ...nextData,
      objectiveLabel,
      primaryActionLabel,
      brandAssetsLabel,
      contentStatusLabel,
      deadlineLabel,
      visualStyleLabels,
      typographyLabels,
      locale,
      updatedAt: new Date().toISOString(),
    }))
  }

  function validateStep(index: number) {
    const section = formRef.current?.querySelector<HTMLElement>(`[data-brief-step="${index}"]`)
    const invalid = section?.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(':invalid')
    if (!invalid) return true
    invalid.reportValidity()
    invalid.focus()
    return false
  }

  function move(nextStep: number) {
    if (nextStep > step && !validateStep(step)) return
    saveDraft()
    setStep(nextStep)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    for (let index = 0; index < text.steps.length; index += 1) {
      if (!validateStep(index)) {
        setStep(index)
        return
      }
    }
    saveDraft()
    router.push(`/${locale}/solicitud`)
  }

  const field = (name: keyof typeof text.fields, type: 'text' | 'url' | 'textarea' = 'textarea', required = false) => {
    const [label, placeholder] = text.fields[name]
    const value = data[name] as string
    return (
      <label className="brief-field">
        <span>{label}{required ? ' *' : ''}</span>
        {type === 'textarea'
          ? <textarea rows={3} value={value} onChange={(event) => update(name, event.target.value)} placeholder={placeholder} required={required} />
          : <input type={type} value={value} onChange={(event) => update(name, event.target.value)} placeholder={placeholder} required={required} />}
      </label>
    )
  }

  const select = (name: string, label: string, values: readonly (readonly [string, string])[], required = false) => (
    <label className="brief-field">
      <span>{label}{required ? ' *' : ''}</span>
      <select value={data[name] as string} onChange={(event) => update(name, event.target.value)} required={required}>
        {required ? <option value="">{text.select}</option> : null}
        {values.map(([value, optionLabel]) => <option key={value} value={value}>{optionLabel}</option>)}
      </select>
    </label>
  )

  const multi = (name: string, label: string, values: readonly (readonly [string, string])[]) => (
    <fieldset className="brief-field brief-field-full brief-multi">
      <legend>{label} <small>{text.optional}</small></legend>
      <div>{values.map(([value, optionLabel]) => {
        const selected = (data[name] as string[]).includes(value)
        return <label key={value}><input type="checkbox" checked={selected} onChange={() => toggle(name, value)} /><span>{selected ? <Check size={13} /> : null}{optionLabel}</span></label>
      })}</div>
    </fieldset>
  )

  return (
    <form ref={formRef} className="brief-workspace" onSubmit={submit} noValidate={false}>
      <aside className="brief-stage-nav" aria-label={locale === 'es' ? 'Secciones del brief' : 'Brief sections'}>
        {text.steps.map((item, index) => (
          <button key={item.title} type="button" className={index === step ? 'is-active' : index < step ? 'is-complete' : ''} onClick={() => index <= step ? move(index) : undefined}>
            <span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong>{index < step ? <Check size={14} /> : null}
          </button>
        ))}
      </aside>

      <div className="brief-form-panel">
        <div className="brief-form-progress">
          <div><span>{text.step} {step + 1} {text.of} {text.steps.length}</span><strong>{text.steps[step].title}</strong></div>
          <i><span style={{ width: `${((step + 1) / text.steps.length) * 100}%` }} /></i>
        </div>

        <section className="brief-step" data-brief-step="0" hidden={step !== 0}>
          <header><h2>{text.steps[0].title}</h2><p>{text.steps[0].intro}</p></header>
          <div className="brief-field-grid">{field('business', 'textarea', true)}{field('brandValues', 'textarea', true)}{field('differentiators', 'textarea', true)}{field('brandPerception', 'text', true)}</div>
        </section>
        <section className="brief-step" data-brief-step="1" hidden={step !== 1}>
          <header><h2>{text.steps[1].title}</h2><p>{text.steps[1].intro}</p></header>
          <div className="brief-field-grid">{field('audience', 'textarea', true)}{field('competitors')}</div>
        </section>
        <section className="brief-step" data-brief-step="2" hidden={step !== 2}>
          <header><h2>{text.steps[2].title}</h2><p>{text.steps[2].intro}</p></header>
          <div className="brief-field-grid">{select('objective', text.objective, choices.objective, true)}{select('primaryAction', text.action, choices.action, true)}{field('successCriteria')}</div>
        </section>
        <section className="brief-step" data-brief-step="3" hidden={step !== 3}>
          <header><h2>{text.steps[3].title}</h2><p>{text.steps[3].intro}</p></header>
          <div className="brief-field-grid">{select('brandAssets', text.assets, choices.assets)}{field('brandColors')}{multi('visualStyle', text.styles, choices.styles)}{multi('typography', text.typography, choices.typography)}</div>
        </section>
        <section className="brief-step" data-brief-step="4" hidden={step !== 4}>
          <header><h2>{text.steps[4].title}</h2><p>{text.steps[4].intro}</p></header>
          <div className="brief-field-grid">{select('contentStatus', text.contentStatus, choices.content, true)}{field('currentSite', 'url')}{field('references')}</div>
        </section>
        <section className="brief-step" data-brief-step="5" hidden={step !== 5}>
          <header><h2>{text.steps[5].title}</h2><p>{text.steps[5].intro}</p></header>
          <div className="brief-field-grid">{select('deadline', text.deadline, choices.deadline)}{field('decisionMaker', 'text')}{field('requirements')}</div>
        </section>

        <footer className="brief-form-footer">
          <p><i />{text.saved}</p>
          <div>
            {step > 0 ? <button type="button" className="brief-button-secondary" onClick={() => move(step - 1)}><ArrowLeft size={16} />{text.previous}</button> : <Link href={`/${locale}/calculadora`} className="brief-button-secondary"><ArrowLeft size={16} />{processCopy(locale)}</Link>}
            {step < text.steps.length - 1
              ? <button type="button" className="brand-button-primary" onClick={() => move(step + 1)}>{text.next}<ArrowRight size={16} /></button>
              : <button type="submit" className="brand-button-primary">{text.finish}<ArrowRight size={16} /></button>}
          </div>
        </footer>
      </div>
    </form>
  )
}

function processCopy(locale: Locale) {
  return locale === 'es' ? 'Volver a cotización' : 'Back to estimate'
}
