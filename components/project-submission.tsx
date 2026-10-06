'use client'

import Link from 'next/link'
import { ArrowLeft, Check, Download, LoaderCircle, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ContactForm } from '@/components/contact-form'
import { generateEstimatePdf } from '@/lib/generate-estimate-pdf'
import { Locale, translations } from '@/lib/i18n'

type Quote = {
  project?: string
  pages?: number
  design?: string
  features?: string[]
  extras?: string[]
  timing?: string
  total?: number
  rangeLow?: number
  rangeHigh?: number
  maintenance?: boolean
  seoAnalysis?: boolean
  breakdown?: Array<{ label: string; amount: number }>
}

type Brief = Record<string, string | string[]>

function formatMoney(value: number) {
  return `US$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)}`
}

function textValue(value: string | string[] | undefined, fallback: string) {
  if (Array.isArray(value)) return value.length ? value.join(', ') : fallback
  return value || fallback
}

export function ProjectSubmission({ locale }: { locale: Locale }) {
  const t = translations[locale]
  const [quote, setQuote] = useState<Quote | null>(null)
  const [brief, setBrief] = useState<Brief | null>(null)
  const [ready, setReady] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const empty = locale === 'es' ? 'Por definir' : 'To be defined'

  useEffect(() => {
    try {
      const storedQuote = window.localStorage.getItem('codigo-latino-quote-v1')
      const storedBrief = window.localStorage.getItem('codigo-latino-brief-v2')
      if (storedQuote) setQuote(JSON.parse(storedQuote) as Quote)
      if (storedBrief) setBrief(JSON.parse(storedBrief) as Brief)
    } catch {
      // Invalid local drafts are ignored and the user can restart the process.
    } finally {
      setReady(true)
    }
  }, [])

  if (!ready) return <div className="submission-loading" aria-live="polite" />

  if (!quote && !brief) {
    return (
      <section className="submission-empty">
        <span>01</span>
        <h2>{locale === 'es' ? 'Primero define el proyecto.' : 'Define the project first.'}</h2>
        <p>{locale === 'es'
          ? 'No encontramos una cotización o un brief guardado en este dispositivo. Inicia el proceso para preparar la información que enviaremos.'
          : 'We could not find a saved estimate or brief on this device. Start the process to prepare the information we will submit.'}</p>
        <Link href={`/${locale}/calculadora`} className="brand-button-primary">
          {locale === 'es' ? 'Iniciar cotización' : 'Start estimate'}
        </Link>
      </section>
    )
  }

  const capabilities = [...(quote?.features || []), ...(quote?.extras || [])]
  const quoteRows = quote ? [
    [locale === 'es' ? 'Tipo de proyecto' : 'Project type', quote.project || empty],
    [locale === 'es' ? 'Páginas o vistas' : 'Pages or views', String(quote.pages || 1)],
    [locale === 'es' ? 'Dirección visual' : 'Visual direction', quote.design || empty],
    [locale === 'es' ? 'Funciones y adicionales' : 'Capabilities and add-ons', capabilities.length ? capabilities.join(', ') : (locale === 'es' ? 'Sin adicionales' : 'No add-ons')],
    [locale === 'es' ? 'Ritmo de entrega' : 'Delivery pace', quote.timing || empty],
  ] : []

  const briefRows = brief ? [
    [locale === 'es' ? 'Negocio' : 'Business', textValue(brief.business, empty)],
    [locale === 'es' ? 'Audiencia' : 'Audience', textValue(brief.audience, empty)],
    [locale === 'es' ? 'Objetivo' : 'Objective', textValue(brief.objectiveLabel, empty)],
    [locale === 'es' ? 'Acción principal' : 'Primary action', textValue(brief.primaryActionLabel, empty)],
    [locale === 'es' ? 'Publicación' : 'Launch', textValue(brief.deadlineLabel, empty)],
  ] : []

  async function downloadEstimate() {
    if (!quote || typeof quote.total !== 'number') return

    setIsDownloading(true)
    try {
      await generateEstimatePdf({
        locale,
        project: { name: quote.project || empty },
        design: { name: quote.design || empty },
        pages: quote.pages || 1,
        timing: { name: quote.timing || empty },
        features: [
          {
            name: locale === 'es' ? 'SEO técnico inicial' : 'Initial technical SEO',
            meta: locale === 'es' ? 'Incluido' : 'Included',
          },
          ...(quote.features || []).map((name) => ({ name })),
        ],
        extras: (quote.extras || []).map((name) => ({ name })),
        breakdown: quote.breakdown?.length
          ? quote.breakdown
          : [{ label: locale === 'es' ? 'Proyecto estimado' : 'Estimated project', amount: quote.total }],
        maintenance: Boolean(quote.maintenance),
        maintenancePrice: locale === 'es' ? 'US$15 / mes' : 'US$15 / month',
        seoAnalysis: Boolean(quote.seoAnalysis),
        seoPrice: locale === 'es' ? 'US$70 / mes' : 'US$70 / month',
        total: formatMoney(quote.total),
        range: `${formatMoney(quote.rangeLow || quote.total)} - ${formatMoney(quote.rangeHigh || quote.total)}`,
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="submission-workspace">
      <section className="submission-review" aria-label={locale === 'es' ? 'Resumen de la solicitud' : 'Request summary'}>
        <div className="submission-review-head">
          <div>
            <span><Check size={14} />{locale === 'es' ? 'Información preparada' : 'Information ready'}</span>
            <h2>{locale === 'es' ? 'Esto es lo que enviaremos.' : 'This is what we will submit.'}</h2>
          </div>
          <p>{locale === 'es'
            ? 'Revisa los puntos principales. Puedes volver a cualquier etapa sin perder el borrador.'
            : 'Review the key points. You can return to either stage without losing your draft.'}</p>
        </div>

        {quote ? (
          <article className="submission-summary-block">
            <header>
              <div><span>01</span><strong>{locale === 'es' ? 'Cotización' : 'Estimate'}</strong></div>
              <Link href={`/${locale}/calculadora`}><Pencil size={14} />{locale === 'es' ? 'Editar' : 'Edit'}</Link>
            </header>
            <dl>{quoteRows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            {typeof quote.total === 'number' ? (
              <footer>
                <span>{locale === 'es' ? 'Inversión orientativa' : 'Indicative investment'}</span>
                <strong>{formatMoney(quote.total)}</strong>
                <small>{formatMoney(quote.rangeLow || quote.total)} - {formatMoney(quote.rangeHigh || quote.total)}</small>
              </footer>
            ) : null}
          </article>
        ) : null}

        {brief ? (
          <article className="submission-summary-block">
            <header>
              <div><span>02</span><strong>Brief</strong></div>
              <Link href={`/${locale}/brief`}><Pencil size={14} />{locale === 'es' ? 'Editar' : 'Edit'}</Link>
            </header>
            <dl>{briefRows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          </article>
        ) : null}
      </section>

      <aside className="submission-form-panel">
        <p className="editorial-label">{locale === 'es' ? 'Datos de envío' : 'Submission details'}</p>
        <h2>{locale === 'es' ? '¿Dónde respondemos?' : 'Where should we reply?'}</h2>
        <p>{locale === 'es'
          ? 'Completa tus datos y envía el alcance para que podamos revisarlo.'
          : 'Add your details and submit the scope so we can review it.'}</p>
        <div className="section-rule" />
        <ContactForm
          locale={locale}
          mode="project"
          emailLabel={t.emailLabel}
          emailPlaceholder={t.emailPlaceholder}
          phoneLabel={t.phoneLabel}
          phonePlaceholder={t.phonePlaceholder}
          messageLabel={t.messageLabel}
          messagePlaceholder={t.messagePlaceholder}
          submitButton={t.submitButton}
          submittingButton={t.submittingButton}
          confirmationMessage={locale === 'es'
            ? 'Información enviada. Revisaremos el alcance y te responderemos pronto.'
            : 'Information submitted. We will review the scope and reply soon.'}
          errorMessage={t.errorMessage}
          onSuccess={() => setSubmitted(true)}
        />
        <Link href={`/${locale}/brief`} className="submission-back-link"><ArrowLeft size={14} />{locale === 'es' ? 'Volver al brief' : 'Back to brief'}</Link>
        {submitted && quote ? (
          <section className="submission-download-panel" aria-live="polite">
            <span><Check size={14} />{locale === 'es' ? 'Proceso completado' : 'Process completed'}</span>
            <h3>{locale === 'es' ? 'Guarda una copia de la estimación.' : 'Save a copy of the estimate.'}</h3>
            <p>{locale === 'es'
              ? 'El PDF reúne el alcance y la inversión orientativa que acabas de enviar.'
              : 'The PDF summarizes the scope and indicative investment you just submitted.'}</p>
            <button type="button" className="submission-download" onClick={downloadEstimate} disabled={isDownloading}>
              {isDownloading ? <LoaderCircle className="is-spinning" size={16} /> : <Download size={16} />}
              {isDownloading
                ? (locale === 'es' ? 'Preparando PDF' : 'Preparing PDF')
                : (locale === 'es' ? 'Descargar PDF' : 'Download PDF')}
            </button>
          </section>
        ) : null}
      </aside>
    </div>
  )
}
