import { useState, useCallback } from 'react'
import CatalogGrid from './components/CatalogGrid'
import CatalogViewer from './components/CatalogViewer'
import { renderPdfPages } from './lib/pdfRenderer'
import { downloadFromDrive, downloadFromUrl } from './lib/drive'

export default function App() {
  const [view, setView] = useState('grid')
  const [pages, setPages] = useState(null)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [catalogTitle, setCatalogTitle] = useState('')

  const handleOpenCatalog = useCallback(async (catalog) => {
    setLoading(true)
    setError(null)
    setCatalogTitle(catalog.title)
    setView('viewer')
    try {
      const arrayBuffer = catalog.url
        ? await downloadFromUrl(catalog.url)
        : await downloadFromDrive(catalog.fileId)
      const result = await renderPdfPages(arrayBuffer)
      setTotalPages(result.totalPages)
      setPages(result.pages)
    } catch (err) {
      setError(err.message || 'Error al cargar el catálogo')
      setPages(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleBack = useCallback(() => {
    setView('grid')
    setPages(null)
    setTotalPages(0)
    setError(null)
    setCatalogTitle('')
    window.location.hash = ''
  }, [])

  if (view === 'grid') {
    return <CatalogGrid onOpenCatalog={handleOpenCatalog} />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant text-sm">
            {catalogTitle ? `Cargando ${catalogTitle}...` : 'Cargando...'}
          </p>
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
            onClick={handleBack}
            className="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Volver a catálogos
          </button>
        </div>
      </div>
    )
  }

  if (!pages) return null

  return (
    <CatalogViewer
      pages={pages}
      totalPages={totalPages}
      title={catalogTitle}
      onBack={handleBack}
    />
  )
}
