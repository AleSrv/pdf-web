import { useState, useEffect, useMemo, useRef } from 'react'
import CatalogCard from './CatalogCard'
import { catalogos } from '../data/catalogos'
import { getThumbnailUrl } from '../lib/drive'

const THRESHOLD = 60

export default function CatalogGrid({ onOpenCatalog }) {
  const [thumbnails, setThumbnails] = useState({})
  const [filter, setFilter] = useState('all')
  const [pullPhase, setPullPhase] = useState('idle')
  const [pullDistance, setPullDistance] = useState(0)
  const scrollRef = useRef(null)
  const pullRef = useRef({ startY: 0, phase: 'idle', distance: 0 })

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

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onStart = (e) => {
      if (el.scrollTop === 0) {
        pullRef.current.startY = e.touches[0].clientY
        pullRef.current.phase = 'idle'
      }
    }

    const onMove = (e) => {
      if (el.scrollTop > 0) return
      const dy = e.touches[0].clientY - pullRef.current.startY
      if (dy <= 0) return
      e.preventDefault()
      const dist = Math.round(dy / 2.5)
      pullRef.current.distance = dist
      pullRef.current.phase = dist >= THRESHOLD ? 'ready' : 'pulling'
      setPullDistance(dist)
      setPullPhase(pullRef.current.phase)
    }

    const onEnd = () => {
      if (pullRef.current.phase === 'ready') {
        setPullPhase('refreshing')
        setPullDistance(THRESHOLD)
        window.location.reload()
      } else {
        pullRef.current.phase = 'idle'
        setPullPhase('idle')
        setPullDistance(0)
      }
    }

    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
    }
  }, [])

  return (
    <div className="h-full flex flex-col overflow-y-auto relative" ref={scrollRef}>
      {pullPhase !== 'idle' && (
        <div
          className="shrink-0 flex items-center justify-center gap-2 transition-none"
          style={{ height: pullDistance, minHeight: 0 }}
        >
          {pullPhase === 'refreshing' ? (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <span
              className={`material-symbols-outlined text-primary transition-transform duration-200 ${
                pullPhase === 'ready' ? 'rotate-180' : ''
              }`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
            >
              arrow_downward
            </span>
          )}
          <span className="text-xs text-on-surface-variant font-medium">
            {pullPhase === 'ready' ? 'Suelta para recargar' : 'Tira para recargar'}
          </span>
        </div>
      )}

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
                thumbnail={thumbnails[cat.id]}
                onOpen={onOpenCatalog}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
