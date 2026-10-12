# Sandra Ceballos Portfolio

Web estática en Astro para portafolio visual de artista. Usa Astro, TypeScript estricto, componentes `.astro`, CSS nativo y una capa pequeña de TypeScript de cliente.

## Requisitos

- Node 22 (fijado en `.nvmrc`; con nvm: `nvm use`).
- npm.

## Instalar y ejecutar

```bash
npm install
npm run dev
```

Comprobaciones:

```bash
npm run check
npm run build
```

## Tests

Todo con un solo comando, desde un checkout limpio:

```bash
npm ci
npm run verify
```

`verify` comprueba los tipos, construye la web, descarga los navegadores de
Playwright si faltan (solo la primera vez) y pasa todos los tests contra la web
construida. `npm run verify:full` añade Lighthouse.

| Qué | Dónde | Comando |
| --- | --- | --- |
| Rutas, recarga, enlaces internos, Atrás/Adelante | `tests/e2e/routes.spec.ts` | `npm test` |
| Menú, idioma, galería, diálogos, historias, formulario (Formspree simulado) | `tests/e2e/ui.spec.ts` | `npm test` |
| Tarjeta de noticias (News) | `tests/e2e/news.spec.ts` | `npm test` |
| Movimiento: cabecera (tono y color visible) y News fotograma a fotograma | `tests/e2e/motion.spec.ts` | `npm test` |
| Vídeos y trama WebGL: se dibujan, con sus colores y la forma de la C | `tests/e2e/media.spec.ts` | `npm test` |
| Accesibilidad (axe) en todas las rutas, idiomas y estados | `tests/e2e/a11y.spec.ts` | `npm test` |
| Responsive (360–768 px), incluidos textos o imágenes que se pisan | `tests/e2e/responsive.spec.ts` | `npm test` |
| Regresión visual (360, 390, 768, 1440 px) | `tests/e2e/visual.spec.ts` | `npm test` (solo Linux/CI) |
| WebKit (motor de Safari) | mismos tests | `npm run test:webkit` |
| Lighthouse con referencia | `tests/lighthouse.mjs` | `npm run test:lighthouse` |

Los tests se ejecutan en escritorio (1440 px), teléfono (Pixel 7) y con
movimiento reducido. El formulario nunca envía nada real: las peticiones a
Formspree se bloquean o se simulan.

**Regresión visual.** Las imágenes aprobadas están en `tests/visual/`. Si un
cambio de diseño es intencionado, se revisan las diferencias y se aprueban con
`npm run test:update-visual` (en Linux o en CI, porque cada sistema dibuja las
letras un poco distinto; en el Mac se saltan, o se fuerzan con `VISUAL=1`).

**Lighthouse.** La referencia está en `tests/lighthouse-baseline.json`. Si una
mejora o un cambio aceptado la mueve, se actualiza con
`npm run test:lighthouse:update`.

**GitHub.** `.github/workflows/ci.yml` lo ejecuta todo en cada push y pull
request; si algo falla, el informe queda en los artefactos del workflow.

## Editar contenido

- Datos generales: `src/data/site.ts`.
- Obras: `src/data/artworks.ts`.
- Trayectoria: `src/data/exhibitions.ts`.
- Imágenes: `src/assets/artworks/`.

Para reemplazar una obra, coloca la nueva imagen en `src/assets/artworks/`, importa el archivo en `src/data/artworks.ts` y actualiza `image`, `thumbnail`, `alt`, técnica, dimensiones y descripción.

## Formspree

Copia `.env.example` a `.env` y configura:

```bash
PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/tu-endpoint
```

El formulario funciona por POST estándar si el endpoint existe y mejora con `fetch` para mostrar estado sin recargar. Si falta el endpoint, nunca simula éxito.

## Despliegue en Vercel

1. Sube el proyecto al repositorio.
2. Importa el repositorio en Vercel.
3. Usa los valores por defecto de Astro:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Añade `PUBLIC_FORMSPREE_ENDPOINT` en Environment Variables.

## Antes de publicar

- Confirmar biografía final.
- Completar CV con años, títulos y sedes de exposiciones individuales/colectivas.
- Confirmar premios, becas y residencias.
- Revisar textos legales con la información fiscal/corporativa correspondiente.
- Confirmar correo de contacto y dominio canonical final en `src/data/site.ts` y `astro.config.mjs`.
