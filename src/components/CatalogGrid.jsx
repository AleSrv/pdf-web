import { useState, useEffect } from 'react'
import CatalogCard from './CatalogCard'
import { catalogos } from '../data/catalogos'
import { getThumbnailUrl } from '../lib/drive'

export default function CatalogGrid({ onOpenCatalog }) {
  const [thumbnails, setThumbnails] = useState({})

  useEffect(() => {
    let mounted = true
    const fetchAll = async () => {
      const results = await Promise.allSettled(
        catalogos.map(cat =>
          getThumbnailUrl(cat.fileId).then(url => ({ id: cat.id, url }))
        )
      )
      if (!mounted) return
      const thumbs = {}
      for (const r of results) {
        if (r.status === 'fulfilled' && r.value.url) {
          thumbs[r.value.id] = r.value.url
        }
      }
      setThumbnails(thumbs)
    }
    fetchAll()
    return () => { mounted = false }
  }, [])

  return (
    <div className="h-full flex flex-col px-6 lg:px-10 xl:px-16 py-4 lg:py-6 overflow-y-auto">
      <header className="mb-5">
        <h1 className="text-xl lg:text-2xl font-bold text-on-surface mb-1">
          Catálogos
        </h1>
        <p className="text-on-surface-variant text-xs">
          Selecciona un catálogo para visualizarlo
        </p>
      </header>

      {catalogos.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <span
              className="material-symbols-outlined text-5xl text-outline/30 mb-4"
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48" }}
            >
              folder_off
            </span>
            <p className="text-on-surface-variant text-sm">No hay catálogos disponibles</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {catalogos.map((cat) => (
            <CatalogCard
              key={cat.id}
              catalog={cat}
              thumbnail={thumbnails[cat.id]}
              onOpen={onOpenCatalog}
            />
          ))}
        </div>
      )}
    </div>
  )
}
