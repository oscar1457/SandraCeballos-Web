# Sandra Ceballos Portfolio

Web estática en Astro para portafolio visual de artista. Usa Astro, TypeScript estricto, componentes `.astro`, CSS nativo y una capa pequeña de TypeScript de cliente.

## Requisitos

- Node `>=22.12.0`.
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

## Pendiente de la propietaria

- Confirmar biografía definitiva.
- Completar CV con años, títulos y sedes de exposiciones individuales/colectivas.
- Confirmar premios, becas y residencias.
- Sustituir textos legales provisionales.
- Confirmar correo de contacto y dominio canonical final en `src/data/site.ts` y `astro.config.mjs`.
