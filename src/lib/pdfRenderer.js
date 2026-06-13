import * as pdfjsLib from 'pdfjs-dist'

const WORKER_CDN = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`
pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_CDN

export async function renderPdfPages(arrayBuffer) {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const totalPages = pdf.numPages
  const pages = []

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i)
    const viewport = page.getViewport({ scale: 1.5 })
    const thumbViewport = page.getViewport({ scale: 0.25 })

    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')
    await page.render({ canvasContext: ctx, viewport }).promise
    const src = canvas.toDataURL('image/jpeg', 0.88)

    const thumbCanvas = document.createElement('canvas')
    thumbCanvas.width = thumbViewport.width
    thumbCanvas.height = thumbViewport.height
    const thumbCtx = thumbCanvas.getContext('2d')
    await page.render({ canvasContext: thumbCtx, viewport: thumbViewport }).promise
    const thumbnail = thumbCanvas.toDataURL('image/jpeg', 0.6)

    pages.push({ src, thumbnail, width: viewport.width, height: viewport.height })
  }

  return { totalPages, pages }
}
