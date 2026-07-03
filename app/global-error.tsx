'use client'

import { useEffect } from 'react'
import { ErrorShell } from '@/components/error-shell'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="es" className="bg-zinc-950">
      <body>
        <ErrorShell
          badge="Error de aplicacion"
          code="500"
          title="No pudimos completar esta navegacion"
          description="La aplicacion encontro un problema inesperado. Puedes reintentar o volver al inicio."
          homeHref="/es"
          homeLabel="Volver al inicio"
          secondaryAction={
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-w-44 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-800"
            >
              Reintentar
            </button>
          }
        />
      </body>
    </html>
  )
}
