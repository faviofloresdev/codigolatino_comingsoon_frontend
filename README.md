# Codigo Latino Website

Sitio bilingüe de Codigo Latino construido con Next.js 16, React 19 y Tailwind CSS 4.

## Requisitos

- Node.js 20 o superior
- npm

## Desarrollo local

```bash
npm install
npm run dev
```

El sitio estará disponible en `http://localhost:3000` y redirigirá a `/es` o `/en` según el idioma del navegador.

## Variables de entorno

Crea un archivo `.env.local` a partir de `.env.example` y configura:

```bash
RESEND_API_KEY=tu_api_key
CONTACT_TO_EMAIL=tu-correo@dominio.com
CONTACT_FROM_EMAIL=Codigo Latino <contacto@tu-dominio.com>
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu_site_key_de_recaptcha_v3
RECAPTCHA_SECRET_KEY=tu_secret_key_de_recaptcha_v3
RECAPTCHA_MIN_SCORE=0.5
```

- `CONTACT_TO_EMAIL`: destino de las consultas y solicitudes de proyecto.
- `CONTACT_FROM_EMAIL`: remitente autorizado en Resend. En producción debe usar un dominio verificado.
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`: clave pública de Google reCAPTCHA v3.
- `RECAPTCHA_SECRET_KEY`: clave privada utilizada únicamente por el endpoint del servidor.
- `RECAPTCHA_MIN_SCORE`: puntuación mínima aceptada para los envíos.

## Verificación y producción

```bash
npm run typecheck
npm run build
npm run start
```

Las imágenes externas utilizadas se documentan en [IMAGE_CREDITS.md](./IMAGE_CREDITS.md).
