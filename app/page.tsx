import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { resolveLocaleFromAcceptLanguage } from '@/lib/i18n'

export default async function Page() {
  const acceptLanguage = (await headers()).get('accept-language')
  const locale = resolveLocaleFromAcceptLanguage(acceptLanguage)

  redirect(`/${locale}`)
}
