import Link from 'next/link'
import { Locale } from '@/lib/i18n'

const processCopy = {
  es: ['Cotización', 'Brief', 'Envío'],
  en: ['Estimate', 'Brief', 'Submit'],
} as const

export function ProjectProcess({ locale, activeStep }: { locale: Locale; activeStep: 1 | 2 | 3 }) {
  const paths = [`/${locale}/calculadora`, `/${locale}/brief`, `/${locale}/solicitud`]

  return (
    <nav className="project-process" aria-label={locale === 'es' ? 'Proceso del proyecto' : 'Project process'}>
      {processCopy[locale].map((label, index) => {
        const step = (index + 1) as 1 | 2 | 3
        const className = step === activeStep ? 'is-active' : step < activeStep ? 'is-complete' : ''
        return (
          <div key={label} className={className}>
            <Link href={paths[index]} aria-current={step === activeStep ? 'step' : undefined}>
              <span>{String(step).padStart(2, '0')}</span>
              <strong>{label}</strong>
            </Link>
            {step < 3 ? <i aria-hidden="true" /> : null}
          </div>
        )
      })}
    </nav>
  )
}
