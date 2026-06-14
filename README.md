# Catálogo PDF Web

Visor de catálogos PDF con navegación por arrastre (drag/swipe), similar a un flipbook.
Construido con React 19, Vite 6, Tailwind CSS v4 y pdfjs-dist.

![vite](https://img.shields.io/badge/Vite-6-646CFF) ![react](https://img.shields.io/badge/React-19-58c4dc) ![tailwind](https://img.shields.io/badge/Tailwind-4-06b6d4) ![pdfjs](https://img.shields.io/badge/pdfjs--dist-4-f39f0b)

## Características

- **Grid de catálogos** — 40 fichas técnicas de Samsung (TVs, barras de sonido, The Frame, etc.)
- **Carga desde Google Drive** — Los PDFs se descargan mediante la API de Google Drive
- **Navegación por arrastre** — Deslizar con mouse o dedo (táctil)
- **Navegación por teclado** — ← →, Home, End
- **Tap en bordes** — Toca el 30% izquierdo/derecho para avanzar/retroceder
- **Miniaturas** — Strip inferior con scroll automático a la página activa
- **Pantalla completa** — Botón para expandir
- **Tema oscuro** — Diseño Stitch con acentos periwinkle (#c0c1ff)
- **Responsive** — Funciona en móvil y desktop

## Requisitos

Antes de arrancar, necesitás una **API Key de Google** con Drive API activada:

1. Ir a [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Crear proyecto → Activar [Drive API](https://console.cloud.google.com/apis/library/drive.googleapis.com)
3. Crear API Key con restricción HTTP referrers: `http://localhost:5173/*` y `https://tu-dominio.com/*`
4. Copiar la key a `.env`:

```bash
VITE_GOOGLE_API_KEY=tu_api_key_aqui
```

## Uso

```bash
npm install
npm run dev
```

Abrir en `http://localhost:5173`

## Agregar un catálogo

1. Subí el PDF a Google Drive como **público**
2. Copiá el `fileId` de la URL (ej: `1ABCxyz...`)
3. Agregalo en `src/data/catalogos.js`:

```js
{
  id: 'mi-catalogo',
  title: 'Mi Catálogo',
  subtitle: 'Descripción opcional',
  fileId: '1ABCxyz...',
  pages: 24,
}
```

## Build producción

```bash
npm run build
npm run preview
```

## Stack

| | |
|---|---|
| Runtime | Vite 6 |
| Frontend | React 19 |
| Estilos | Tailwind CSS v4 |
| PDF | pdfjs-dist 4 |
| Drive API | Google Drive v3 |
| Iconos | Material Symbols Outlined |
| Tipografía | Inter |
