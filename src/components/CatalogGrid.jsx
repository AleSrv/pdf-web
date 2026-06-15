import { useState, useMemo, useRef } from 'react'
import CatalogCard from './CatalogCard'
import { catalogos } from '../data/catalogos'

const THRESHOLD = 60

export default function CatalogGrid({ onOpenCatalog }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [pullPhase, setPullPhase] = useState('idle')
  const [pullDistance, setPullDistance] = useState(0)
  const scrollRef = useRef(null)
  const pullRef = useRef({ startY: 0, phase: 'idle', distance: 0 })

  const filteredCatalogs = useMemo(() => {
    const q = search.trim().toLowerCase()
    return catalogos.filter(c => {
      if (filter !== 'all' && c.category !== filter) return false
      if (q) {
        const t = (c.title + ' ' + c.id).toLowerCase()
        if (!t.includes(q)) return false
      }
      return true
    })
  }, [filter, search])

  return (
    <div className="h-full flex flex-col overflow-y-auto relative" ref={scrollRef}>
      <div className="px-8 lg:px-16 xl:px-24 py-4 lg:py-6">
        <header className="mb-5 py-3">
          <div className="flex flex-wrap items-center gap-3 my-6">
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
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                    filter === cat.key
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface text-outline hover:text-on-surface-variant'
                  }`}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-on-surface-variant text-xs my-3">
            Selecciona un catálogo para visualizarlo
          </p>
          <div className="relative max-w-xs">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none"
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
            >search</span>
            <input
              type="text"
              placeholder="Buscar modelo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-surface-low border border-surface-high rounded-full pl-10 pr-10 py-2.5 text-sm text-on-surface placeholder:text-outline outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-surface-high transition-colors text-outline hover:text-on-surface"
              >
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                >close</span>
              </button>
            )}
          </div>
        </header>

        {catalogos.length === 0 ? (
          <div className="flex items-center justify-center py-20">
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
                onOpen={onOpenCatalog}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
