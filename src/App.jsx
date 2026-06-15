import { useState, useCallback } from 'react'
import CatalogGrid from './components/CatalogGrid'
import CatalogViewer from './components/CatalogViewer'

export default function App() {
  const [view, setView] = useState('grid')
  const [currentCatalog, setCurrentCatalog] = useState(null)

  const handleOpenCatalog = useCallback((catalog) => {
    setCurrentCatalog(catalog)
    setView('viewer')
  }, [])

  const handleBack = useCallback(() => {
    setView('grid')
    setCurrentCatalog(null)
    window.location.hash = ''
  }, [])

  if (view === 'grid') {
    return <CatalogGrid onOpenCatalog={handleOpenCatalog} />
  }

  if (!currentCatalog) return null

  return <CatalogViewer catalog={currentCatalog} onBack={handleBack} />
}
