import type { jsPDF as JsPDF } from 'jspdf'

type EstimateItem = {
  name: string
  description?: string
  meta?: string
}

export type EstimatePdfSection = {
  title: string
  fields: Array<{
    label: string
    value: string
  }>
}

export type EstimatePdfData = {
  locale: 'es' | 'en'
  project: EstimateItem
  design: EstimateItem
  pages: number
  timing: EstimateItem
  features: EstimateItem[]
  extras: EstimateItem[]
  breakdown: Array<{ label: string; amount: number }>
  maintenance: boolean
  maintenancePrice: string
  seoAnalysis: boolean
  seoPrice: string
  total: string
  range: string
  briefSections: EstimatePdfSection[]
}

const colors = {
  ink: '#1C1C1C',
  paper: '#F5F3EE',
  white: '#FFFFFF',
  muted: '#5F6368',
  aqua: '#2EC4B6',
  emerald: '#00A68B',
  coral: '#E63946',
  magenta: '#E91E63',
  yellow: '#FFC400',
  purple: '#7B2CBF',
  line: '#D8D5CE',
}

const documentCopy = {
  es: {
    eyebrow: 'ESTIMACIÓN DE PROYECTO',
    title: ['Una base clara', 'para empezar.'],
    investment: 'INVERSIÓN ESTIMADA',
    range: 'RANGO ORIENTATIVO',
    project: 'PROYECTO',
    design: 'DIRECCIÓN VISUAL',
    pages: 'PÁGINAS O VISTAS',
    pageUnitSingular: 'página',
    pageUnit: 'páginas',
    notice: 'Esta estimación es referencial. Revisaremos el alcance del brief antes de enviarte el plan final.',
    detailTitle: 'Lo que compone la estimación.',
    breakdown: 'DESGLOSE DE INVERSIÓN',
    scope: 'ALCANCE SELECCIONADO',
    noExtras: 'Sin funciones o servicios adicionales.',
    included: 'Incluido',
    recurring: 'SERVICIOS MENSUALES',
    maintenance: 'Soporte y hosting administrado',
    seo: 'Análisis SEO continuo',
    notSelected: 'No seleccionado',
    delivery: 'RITMO DE ENTREGA',
    next: 'SIGUIENTE PASO',
    nextTitle: 'Completa el brief del proyecto.',
    nextBody: 'Con esa información validamos objetivos, contenido e integraciones para preparar una propuesta final.',
    briefEyebrow: 'BRIEF DEL PROYECTO',
    briefTitle: 'El contexto detrás del alcance.',
    briefIntro: 'Información proporcionada durante el proceso para orientar la propuesta final.',
    continuation: 'Continuación',
    disclaimer: 'No constituye una oferta contractual. El importe puede variar según objetivos, contenido, integraciones y requerimientos técnicos.',
    generated: 'Documento generado desde codigolatino.studio',
  },
  en: {
    eyebrow: 'PROJECT ESTIMATE',
    title: ['A clear foundation', 'to get started.'],
    investment: 'ESTIMATED INVESTMENT',
    range: 'SUGGESTED RANGE',
    project: 'PROJECT',
    design: 'VISUAL DIRECTION',
    pages: 'PAGES OR VIEWS',
    pageUnitSingular: 'page',
    pageUnit: 'pages',
    notice: 'This estimate is for reference. We will review your brief before sending the final project plan.',
    detailTitle: 'What shapes the estimate.',
    breakdown: 'INVESTMENT BREAKDOWN',
    scope: 'SELECTED SCOPE',
    noExtras: 'No additional capabilities or services.',
    included: 'Included',
    recurring: 'MONTHLY SERVICES',
    maintenance: 'Managed support and hosting',
    seo: 'Ongoing SEO analysis',
    notSelected: 'Not selected',
    delivery: 'DELIVERY PACE',
    next: 'NEXT STEP',
    nextTitle: 'Complete the project brief.',
    nextBody: 'We use that information to validate goals, content and integrations before preparing the final proposal.',
    briefEyebrow: 'PROJECT BRIEF',
    briefTitle: 'The context behind the scope.',
    briefIntro: 'Information provided during the process to guide the final proposal.',
    continuation: 'Continuation',
    disclaimer: 'This is not a contractual offer. The amount may vary according to goals, content, integrations and technical requirements.',
    generated: 'Document generated from codigolatino.studio',
  },
} as const

function addBrandRule(doc: JsPDF, y = 0) {
  const segments = [colors.coral, colors.magenta, colors.purple, colors.aqua, colors.emerald, colors.yellow]
  const segmentWidth = 210 / segments.length
  segments.forEach((color, index) => {
    doc.setFillColor(color)
    doc.rect(index * segmentWidth, y, segmentWidth + 0.2, 2.2, 'F')
  })
}

function addFooter(doc: JsPDF, page: string, text: string, dark = false) {
  doc.setDrawColor(dark ? '#3B3B3B' : colors.line)
  doc.line(18, 281, 192, 281)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(dark ? '#A9ADAE' : colors.muted)
  doc.text(text, 18, 287)
  doc.text(page, 192, 287, { align: 'right' })
}

async function loadLogo(): Promise<string | null> {
  try {
    const response = await fetch('/mask.png')
    if (!response.ok) return null
    const blob = await response.blob()
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

function addBrandMark(doc: JsPDF, logo: string | null, dark = false) {
  if (logo) doc.addImage(logo, 'PNG', 18, 11, 8.5, 12)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setCharSpace(1.3)
  doc.setTextColor(dark ? colors.white : colors.ink)
  doc.text('CÓDIGO LATINO', 31, 18.4)
  doc.setCharSpace(0)
}

function drawInfoCell(doc: JsPDF, x: number, y: number, width: number, label: string, value: string) {
  doc.setDrawColor('#474747')
  doc.line(x, y, x + width, y)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setCharSpace(1)
  doc.setTextColor('#9FA3A4')
  doc.text(label, x, y + 8)
  doc.setCharSpace(0)
  doc.setFontSize(11)
  doc.setTextColor(colors.white)
  const lines = doc.splitTextToSize(value, width - 4)
  doc.text(lines.slice(0, 2), x, y + 16)
}

function drawScopeItem(doc: JsPDF, item: EstimateItem, x: number, y: number, width: number) {
  doc.setFillColor(colors.aqua)
  doc.circle(x + 1.5, y + 1.3, 1.5, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(colors.ink)
  doc.text(doc.splitTextToSize(item.name, width - 8).slice(0, 1), x + 7, y + 3)
  if (item.meta) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(colors.muted)
    doc.text(item.meta, x + 7, y + 8)
  }
}

function addPaperPage(doc: JsPDF, logo: string | null) {
  doc.addPage()
  doc.setFillColor(colors.paper)
  doc.rect(0, 0, 210, 297, 'F')
  addBrandRule(doc)
  addBrandMark(doc, logo)
}

export async function generateEstimatePdf(data: EstimatePdfData) {
  const [{ jsPDF }, logo] = await Promise.all([import('jspdf'), loadLogo()])
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
  const text = documentCopy[data.locale]

  doc.setProperties({
    title: data.locale === 'es' ? 'Estimación de proyecto - Código Latino' : 'Project estimate - Código Latino',
    subject: data.locale === 'es' ? 'Alcance e inversión referencial' : 'Reference scope and investment',
    author: 'Código Latino',
    creator: 'codigolatino.studio',
  })

  doc.setFillColor(colors.ink)
  doc.rect(0, 0, 210, 297, 'F')
  addBrandRule(doc)
  addBrandMark(doc, logo, true)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setCharSpace(1.6)
  doc.setTextColor(colors.aqua)
  doc.text(text.eyebrow, 18, 48)
  doc.setCharSpace(0)

  doc.setFontSize(32)
  doc.setTextColor(colors.white)
  doc.text(text.title[0], 18, 66)
  doc.text(text.title[1], 18, 80)

  doc.setFillColor(colors.coral)
  doc.rect(18, 94, 21, 2.2, 'F')
  doc.setFillColor(colors.aqua)
  doc.rect(39, 94, 21, 2.2, 'F')
  doc.setFillColor(colors.yellow)
  doc.rect(60, 94, 21, 2.2, 'F')

  doc.setFontSize(7)
  doc.setCharSpace(1.3)
  doc.setTextColor('#A9ADAE')
  doc.text(text.investment, 18, 119)
  doc.setCharSpace(0)
  doc.setFontSize(37)
  doc.setTextColor(colors.white)
  doc.text(data.total, 18, 137)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(colors.aqua)
  doc.text(`${text.range}: ${data.range}`, 18, 146)

  drawInfoCell(doc, 18, 169, 53, text.project, data.project.name)
  drawInfoCell(doc, 78.5, 169, 53, text.design, data.design.name)
  const pageUnit = data.pages === 1 ? text.pageUnitSingular : text.pageUnit
  drawInfoCell(doc, 139, 169, 53, text.pages, `${data.pages} ${pageUnit}`)

  doc.setFillColor('#252525')
  doc.roundedRect(18, 217, 174, 39, 2, 2, 'F')
  doc.setFillColor(colors.yellow)
  doc.rect(18, 217, 2.2, 39, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(colors.white)
  doc.text(doc.splitTextToSize(text.notice, 154), 28, 230, { lineHeightFactor: 1.55 })
  addPaperPage(doc, logo)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(colors.ink)
  doc.text(text.detailTitle, 18, 45)

  doc.setFontSize(7)
  doc.setCharSpace(1.3)
  doc.setTextColor(colors.coral)
  doc.text(text.breakdown, 18, 62)
  doc.setCharSpace(0)
  let breakdownY = 71
  data.breakdown.forEach((item) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(colors.muted)
    doc.text(item.label, 18, breakdownY)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(item.amount < 0 ? colors.emerald : colors.ink)
    const amount = `${item.amount < 0 ? '- ' : ''}US$${Math.abs(item.amount).toLocaleString('en-US')}`
    doc.text(amount, 103, breakdownY, { align: 'right' })
    doc.setDrawColor(colors.line)
    doc.line(18, breakdownY + 3, 103, breakdownY + 3)
    breakdownY += 10
  })

  doc.setFontSize(7)
  doc.setCharSpace(1.3)
  doc.setTextColor(colors.purple)
  doc.text(text.delivery, 118, 62)
  doc.setCharSpace(0)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(colors.ink)
  doc.text(data.timing.name, 118, 73)
  if (data.timing.description) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(colors.muted)
    doc.text(doc.splitTextToSize(data.timing.description, 74), 118, 81, { lineHeightFactor: 1.45 })
  }

  const scopeY = 130
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setCharSpace(1.3)
  doc.setTextColor(colors.emerald)
  doc.text(text.scope, 18, scopeY)
  doc.setCharSpace(0)
  const scopeItems = [...data.features, ...data.extras]
  if (scopeItems.length === 0) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(colors.muted)
    doc.text(text.noExtras, 18, scopeY + 12)
  } else {
    scopeItems.forEach((item, index) => {
      const column = index % 2
      const row = Math.floor(index / 2)
      drawScopeItem(doc, item, 18 + column * 90, scopeY + 11 + row * 10, 82)
    })
  }

  const recurringY = 194
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setCharSpace(1.3)
  doc.setTextColor(colors.magenta)
  doc.text(text.recurring, 18, recurringY)
  doc.setCharSpace(0)
  const recurring = [
    [text.maintenance, data.maintenance ? data.maintenancePrice : text.notSelected],
    [text.seo, data.seoAnalysis ? data.seoPrice : text.notSelected],
  ]
  recurring.forEach(([label, value], index) => {
    const x = 18 + index * 90
    doc.setDrawColor(colors.line)
    doc.line(x, recurringY + 7, x + 82, recurringY + 7)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(colors.ink)
    doc.text(label, x, recurringY + 15)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(value === text.notSelected ? colors.muted : colors.emerald)
    doc.text(value, x, recurringY + 22)
  })

  doc.setFillColor(colors.ink)
  doc.roundedRect(18, 226, 174, 38, 2, 2, 'F')
  doc.setFillColor(colors.coral)
  doc.rect(18, 226, 2.2, 38, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setCharSpace(1.2)
  doc.setTextColor(colors.aqua)
  doc.text(text.next, 28, 237)
  doc.setCharSpace(0)
  doc.setFontSize(11)
  doc.setTextColor(colors.white)
  doc.text(text.nextTitle, 28, 245)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor('#CFD2D2')
  doc.text(doc.splitTextToSize(text.nextBody, 145), 28, 252, { lineHeightFactor: 1.35 })

  doc.setFontSize(6.5)
  doc.setTextColor(colors.muted)
  doc.text(doc.splitTextToSize(text.disclaimer, 155), 18, 271)
  if (data.briefSections.length > 0) {
    const contentBottom = 270
    const valueLineHeight = 4.4
    let y = 0
    let briefPage = 0

    const startBriefPage = () => {
      addPaperPage(doc, logo)
      briefPage += 1

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.setCharSpace(1.3)
      doc.setTextColor(colors.coral)
      doc.text(text.briefEyebrow, 18, 39)
      doc.setCharSpace(0)

      doc.setFontSize(briefPage === 1 ? 23 : 18)
      doc.setTextColor(colors.ink)
      doc.text(briefPage === 1 ? text.briefTitle : `${text.briefTitle} · ${text.continuation}`, 18, 50)

      if (briefPage === 1) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8.5)
        doc.setTextColor(colors.muted)
        doc.text(doc.splitTextToSize(text.briefIntro, 174), 18, 59, { lineHeightFactor: 1.4 })
        y = 75
      } else {
        y = 63
      }
    }

    const ensureSpace = (height: number) => {
      if (y + height > contentBottom) startBriefPage()
    }

    const drawField = (label: string, value: string) => {
      let lines = doc.splitTextToSize(value, 174) as string[]
      let continuation = false
      const completeFieldHeight = 19 + lines.length * valueLineHeight
      const availableOnFreshPage = contentBottom - 63

      if (completeFieldHeight <= availableOnFreshPage && y + completeFieldHeight > contentBottom) {
        startBriefPage()
      }

      do {
        ensureSpace(16)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(6.8)
        doc.setCharSpace(0.9)
        doc.setTextColor(colors.muted)
        doc.text(continuation ? `${label} · ${text.continuation}` : label, 18, y)
        doc.setCharSpace(0)
        y += 7

        const availableLines = Math.max(1, Math.floor((contentBottom - y - 5) / valueLineHeight))
        const currentLines = lines.splice(0, availableLines)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9.2)
        doc.setTextColor(colors.ink)
        doc.text(currentLines, 18, y, { lineHeightFactor: 1.35 })
        y += currentLines.length * valueLineHeight + 5

        doc.setDrawColor(colors.line)
        doc.line(18, y, 192, y)
        y += 7

        if (lines.length > 0) {
          startBriefPage()
          continuation = true
        }
      } while (lines.length > 0)
    }

    startBriefPage()
    data.briefSections.forEach((section, sectionIndex) => {
      const firstFieldLines = section.fields[0]
        ? (doc.splitTextToSize(section.fields[0].value, 174) as string[]).length
        : 0
      const firstFieldHeight = Math.min(55, 19 + firstFieldLines * valueLineHeight)
      ensureSpace(12 + firstFieldHeight)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.setCharSpace(1.1)
      doc.setTextColor(colors.emerald)
      doc.text(String(sectionIndex + 1).padStart(2, '0'), 18, y)
      doc.setCharSpace(0)
      doc.setFontSize(13)
      doc.setTextColor(colors.ink)
      doc.text(section.title, 31, y)
      y += 12

      section.fields.forEach((field) => drawField(field.label, field.value))
      y += 3
    })
  }

  const totalPages = doc.getNumberOfPages()
  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    doc.setPage(pageNumber)
    addFooter(
      doc,
      `${String(pageNumber).padStart(2, '0')} / ${String(totalPages).padStart(2, '0')}`,
      text.generated,
      pageNumber === 1,
    )
  }

  const date = new Date().toISOString().slice(0, 10)
  doc.save(`codigo-latino-${data.locale === 'es' ? 'estimacion' : 'estimate'}-${date}.pdf`)
}
