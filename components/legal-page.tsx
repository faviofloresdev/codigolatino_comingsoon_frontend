import Link from 'next/link'
import { Locale } from '@/lib/i18n'

type LegalSection = {
  title: string
  paragraphs?: string[]
  items?: string[]
}

type LegalPageProps = {
  locale: Locale
  label: string
  title: string
  intro: string
  updated: string
  sections: LegalSection[]
  relatedHref: string
  relatedLabel: string
}

export function LegalPage({
  locale,
  label,
  title,
  intro,
  updated,
  sections,
  relatedHref,
  relatedLabel,
}: LegalPageProps) {
  return (
    <section className="legal-page brand-section">
      <header className="legal-page-header">
        <p className="editorial-label">{label}</p>
        <h1 className="brand-display">{title}</h1>
        <p className="legal-page-intro">{intro}</p>
        <p className="legal-page-date">{updated}</p>
      </header>

      <div className="legal-page-grid">
        <aside>
          <p>{locale === 'es' ? 'En esta página' : 'On this page'}</p>
          <ol>
            {sections.map((section, index) => (
              <li key={section.title}>
                <a href={`#section-${index + 1}`}>{section.title}</a>
              </li>
            ))}
          </ol>
        </aside>

        <article className="legal-content">
          {sections.map((section, index) => (
            <section id={`section-${index + 1}`} key={section.title}>
              <p className="editorial-number">{String(index + 1).padStart(2, '0')}</p>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.items ? (
                <ul>
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : null}
            </section>
          ))}

          <Link href={`/${locale}/${relatedHref}`} className="brand-button-secondary">
            {relatedLabel}
          </Link>
        </article>
      </div>
    </section>
  )
}
