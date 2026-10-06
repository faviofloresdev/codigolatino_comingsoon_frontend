import { ContactForm } from '@/components/contact-form'
import { ParallaxImage } from '@/components/parallax-image'
import { Locale, translations } from '@/lib/i18n'

type ContactSectionProps = {
  locale: Locale
}

const sectionCopy: Record<Locale, { asideTitle: string; asideText: string }> = {
  es: {
    asideTitle: 'Una propuesta útil empieza con un problema bien definido.',
    asideText:
      'Cuanto más claro sea el contexto, más precisa será la recomendación sobre alcance, tiempos y nivel de mantenimiento.',
  },
  en: {
    asideTitle: 'A useful proposal starts with a clearly defined problem.',
    asideText:
      'The clearer the context, the more precise the recommendation around scope, timing and maintenance level.',
  },
}

export function ContactSection({ locale }: ContactSectionProps) {
  const t = translations[locale]
  const copy = sectionCopy[locale]

  return (
    <section className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
      <div className="brand-dark-panel motion-card overflow-hidden p-6 text-white sm:p-8">
        <div className="mb-8 border border-white/8">
          <ParallaxImage
            src="/contact-project-discussion.jpg"
            alt={locale === 'es' ? 'Sesión de trabajo sobre un proyecto digital' : 'Working session about a digital project'}
            width={1800}
            height={1202}
            className="h-48 w-full object-cover object-center opacity-88"
            strength={16}
          />
        </div>

        <p className="editorial-label text-white/56">{locale === 'es' ? 'Antes de escribir' : 'Before you write'}</p>
        <h2 className="brand-display mt-6 max-w-lg text-4xl leading-[0.92] font-semibold text-balance sm:text-5xl">
          {copy.asideTitle}
        </h2>
        <p className="mt-5 max-w-md text-base leading-8 text-white/74">{copy.asideText}</p>
      </div>

      <div className="section-frame motion-card p-6 sm:p-8">
        <p className="editorial-label">{t.contactTitle}</p>
        <h3 className="brand-display mt-6 max-w-xl text-4xl leading-[0.94] font-semibold text-[var(--brand-ink)] sm:text-5xl">
          {t.contactDescription}
        </h3>

        <div className="section-rule my-8" />

        <ContactForm
          locale={locale}
          emailLabel={t.emailLabel}
          emailPlaceholder={t.emailPlaceholder}
          phoneLabel={t.phoneLabel}
          phonePlaceholder={t.phonePlaceholder}
          messageLabel={t.messageLabel}
          messagePlaceholder={t.messagePlaceholder}
          submitButton={t.submitButton}
          submittingButton={t.submittingButton}
          confirmationMessage={t.confirmationMessage}
          errorMessage={t.errorMessage}
        />
      </div>
    </section>
  )
}
