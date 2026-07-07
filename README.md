# Codigo Latino Coming Soon Frontend

Landing page "coming soon" construida con Next.js 16 y React 19 para Codigo Latino.

## Requisitos

- Node.js 20 o superior
- npm

## Desarrollo local

```bash
npm install
npm run dev
```

## Configuracion del formulario de contacto

Para habilitar el envio de correos con Resend, define estas variables de entorno:

```bash
RESEND_API_KEY=tu_api_key
CONTACT_TO_EMAIL=tu-correo@dominio.com
CONTACT_FROM_EMAIL=Codigo Latino <onboarding@resend.dev>
```

- `CONTACT_TO_EMAIL`: correo que recibira los mensajes del formulario.
- `CONTACT_FROM_EMAIL`: remitente usado por Resend. En produccion conviene usar un dominio verificado.

## Build de produccion

```bash
npm run build
npm run start
```

## Notas

- Este repositorio usa `npm` como gestor principal de paquetes.
- Los artefactos generados como `.next`, `node_modules` y `*.tsbuildinfo` estan excluidos de Git.
- Si vas a subirlo a GitHub por primera vez, puedes inicializar el repo con `git init`, crear tu rama principal y luego conectar el remoto.
