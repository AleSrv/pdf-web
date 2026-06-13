# Catálogo PDF Web

Visor de catálogos PDF con navegación por arrastre (drag/swipe), similar a un flipbook.
Construido con React 19, Vite 6, Tailwind CSS v4 y pdfjs-dist.

![vite](https://img.shields.io/badge/Vite-6-646CFF) ![react](https://img.shields.io/badge/React-19-58c4dc) ![tailwind](https://img.shields.io/badge/Tailwind-4-06b6d4) ![pdfjs](https://img.shields.io/badge/pdfjs--dist-4-f39f0b)

## Características

- **Subir PDF** — Arrastra y suelta o selecciona tu archivo PDF
- **Navegación por arrastre** — Deslizar con mouse o dedo (táctil)
- **Navegación por teclado** — ← →, Home, End
- **Tap en bordes** — Toca el 30% izquierdo/derecho para avanzar/retroceder
- **URLs con hash** — `#page/1`, `#page/2` — compatible con back/forward
- **Miniaturas** — Strip inferior con scroll automático a la página activa
- **Pantalla completa** — Botón para expandir
- **Persistencia local** — El PDF renderizado se guarda en localStorage
- **Tema oscuro** — Diseño Stitch con acentos periwinkle (#c0c1ff)
- **Responsive** — Funciona en móvil y desktop

## Uso

```bash
npm install
npm run dev
```

Abrir en `http://localhost:5173`

Arrastra un PDF al área de carga y navega por las páginas.

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
| Iconos | Material Symbols Outlined |
| Tipografía | Inter |
