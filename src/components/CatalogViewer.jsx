import { useState, useRef, useEffect, useCallback } from 'react'
import PageControls from './PageControls'
import ThumbnailStrip from './ThumbnailStrip'

export default function CatalogViewer({ pages, totalPages, title, onBack }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [fullscreen, setFullscreen] = useState(false)
  const [dragState, setDragState] = useState({ active: false, x: 0 })
  const containerRef = useRef(null)
  const dragRef = useRef({ startX: 0, startPage: 0, delta: 0, active: false })

  const goTo = useCallback((page) => {
    const next = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(next)
  }, [totalPages])

  useEffect(() => {
    window.location.hash = `page/${currentPage}`
  }, [currentPage])

  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith('#page/')) {
      const page = parseInt(hash.split('/')[1], 10)
      if (page >= 1 && page <= totalPages) setCurrentPage(page)
    }
  }, [totalPages])

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash
      if (hash.startsWith('#page/')) {
        const page = parseInt(hash.split('/')[1], 10)
        if (page >= 1 && page <= totalPages) goTo(page)
      }
    }
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [totalPages, goTo])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(currentPage - 1)
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(currentPage + 1)
      if (e.key === 'Home') goTo(1)
      if (e.key === 'End') goTo(totalPages)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [currentPage, totalPages, goTo])

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const handlePointerDown = (e) => {
    if (!e.isPrimary) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = e.currentTarget.getBoundingClientRect()
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPage: currentPage,
      delta: 0,
      moved: false,
      active: true,
      containerWidth: rect.width,
      clickX: e.clientX - rect.left,
    }
    setDragState({ active: true, x: 0 })
  }

  const handlePointerMove = (e) => {
    if (!dragRef.current.active) return
    const deltaX = e.clientX - dragRef.current.startX
    const deltaY = e.clientY - dragRef.current.startY
    if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return
    dragRef.current.delta = deltaX
    dragRef.current.moved = true
    setDragState({ active: true, x: deltaX })
  }

  const handlePointerUp = () => {
    if (!dragRef.current.active) return
    const r = dragRef.current
    r.active = false
    if (!r.moved) {
      const w = r.containerWidth
      if (r.clickX < w * 0.3 && r.startPage > 1) {
        goTo(r.startPage - 1)
      } else if (r.clickX > w * 0.7 && r.startPage < totalPages) {
        goTo(r.startPage + 1)
      }
    } else {
      const threshold = (containerRef.current?.offsetWidth || 800) * 0.18
      if (r.delta > threshold && r.startPage > 1) {
        goTo(r.startPage - 1)
      } else if (r.delta < -threshold && r.startPage < totalPages) {
        goTo(r.startPage + 1)
      }
    }
    setDragState({ active: false, x: 0 })
  }

  const page = pages[currentPage - 1]
  if (!page) return null

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-4 py-2 bg-surface/80 backdrop-blur-lg border-b border-white/5 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="text-sm font-medium truncate max-w-48">{title || 'Volver'}</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-sm text-on-surface-variant">
            Página <span className="text-on-surface font-semibold">{currentPage}</span> de {totalPages}
          </span>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-surface-high transition-colors text-on-surface-variant hover:text-on-surface"
            title={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            <span className="material-symbols-outlined">
              {fullscreen ? 'fullscreen_exit' : 'fullscreen'}
            </span>
          </button>
        </div>
      </header>

      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-hidden relative select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        <div
          className="relative max-h-full max-w-full"
          style={{
            transform: dragState.active ? `translateX(${dragState.x}px) rotate(${dragState.x * 0.01}deg)` : 'none',
            transition: dragState.active ? 'none' : 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <img
            src={page.src}
            alt={`Página ${currentPage}`}
            className="max-h-[calc(100vh-10rem)] max-w-[95vw] object-contain rounded-lg shadow-2xl"
            draggable={false}
          />
        </div>

        {currentPage > 1 && (
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 hidden lg:block"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => goTo(currentPage - 1)}
              className="w-10 h-10 rounded-full bg-surface-mid/80 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-surface-high transition-colors cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined text-on-surface-variant">chevron_left</span>
            </button>
          </div>
        )}
        {currentPage < totalPages && (
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:block"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => goTo(currentPage + 1)}
              className="w-10 h-10 rounded-full bg-surface-mid/80 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-surface-high transition-colors cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </button>
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none lg:pointer-events-auto lg:opacity-0 lg:hover:opacity-100 transition-opacity" />
      </div>

      <div className="shrink-0">
        <PageControls currentPage={currentPage} totalPages={totalPages} goTo={goTo} />
        <ThumbnailStrip pages={pages} currentPage={currentPage} goTo={goTo} />
      </div>
    </div>
  )
}
