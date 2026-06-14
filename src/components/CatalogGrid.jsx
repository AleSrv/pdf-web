import { useState, useEffect, useMemo } from 'react'
import CatalogCard from './CatalogCard'
import { catalogos } from '../data/catalogos'
import { getThumbnailUrl } from '../lib/drive'

export default function CatalogGrid({ onOpenCatalog }) {
  const [thumbnails, setThumbnails] = useState({})
  const [filter, setFilter] = useState('all')

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

  const filteredCatalogs = useMemo(
    () => filter === 'all' ? catalogos : catalogos.filter(c => c.category === filter),
    [filter]
  )

  return (
    <div className="h-full flex flex-col px-8 lg:px-16 xl:px-24 py-4 lg:py-6 overflow-y-auto">
      <header className="mb-5">
        <div className="flex items-center justify-between my-4">
          <h1 className="text-xl lg:text-2xl font-bold text-on-surface">
            Fichas Samsung 2026
          </h1>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'Todo' },
              { key: 'video', label: 'Video' },
              { key: 'audio', label: 'Audio' },
            ].map(cat => (
              <button key={cat.key}
                onClick={() => setFilter(cat.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  filter === cat.key
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface text-outline hover:text-on-surface-variant'
                }`}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
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
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-1.5">
          {filteredCatalogs.map((cat) => (
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
