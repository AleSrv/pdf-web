import { useState, useEffect } from 'react'
import PdfUploader from './components/PdfUploader'
import CatalogViewer from './components/CatalogViewer'
import { renderPdfPages } from './lib/pdfRenderer'

const STORAGE_KEY = 'catalogo-pdf-data'
const MAX_STORAGE = 4.5 * 1024 * 1024

export default function App() {
  const [pages, setPages] = useState(null)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const { totalPages: t, pages: p } = JSON.parse(saved)
        if (Array.isArray(p) && p.length > 0) {
          setTotalPages(t)
          setPages(p)
        }
      } catch {}
    }
  }, [])

  const handlePdfLoad = async (arrayBuffer) => {
    setLoading(true)
    setError(null)
    try {
      const result = await renderPdfPages(arrayBuffer)
      setTotalPages(result.totalPages)
      setPages(result.pages)
      try {
        const serialized = JSON.stringify(result)
        if (serialized.length < MAX_STORAGE) {
          localStorage.setItem(STORAGE_KEY, serialized)
        }
      } catch {}
    } catch (err) {
      setError('Error al cargar el PDF. Verifica que el archivo sea válido.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setPages(null)
    setTotalPages(0)
    setError(null)
    localStorage.removeItem(STORAGE_KEY)
    window.location.hash = ''
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant text-sm">Procesando PDF...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-5xl text-tertiary">error_outline</span>
          <p className="text-on-surface-variant text-sm max-w-md">{error}</p>
          <button
            onClick={() => setError(null)}
            className="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  if (!pages) {
    return <PdfUploader onPdfLoad={handlePdfLoad} />
  }

  return (
    <CatalogViewer
      pages={pages}
      totalPages={totalPages}
      onBack={handleBack}
    />
  )
}
