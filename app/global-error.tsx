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
    <html lang="es" className="bg-[var(--brand-paper)]">
      <body>
        <ErrorShell
          badge="Error de aplicacion"
          code="500"
          title="No pudimos completar esta navegación"
          description="La aplicacion encontro un problema inesperado. Puedes reintentar o volver al inicio."
          homeHref="/es"
          homeLabel="Volver al inicio"
          secondaryAction={
            <button
              type="button"
              onClick={reset}
              className="brand-button-secondary min-w-44"
            >
              Reintentar
            </button>
          }
        />
      </body>
    </html>
  )
}
