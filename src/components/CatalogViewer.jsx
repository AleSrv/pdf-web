import { useState, useRef, useEffect, useCallback } from 'react'
import PageControls from './PageControls'
import ThumbnailStrip from './ThumbnailStrip'

export default function CatalogViewer({ pages, totalPages, title, catalog, pdfBlob, onBack }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [fullscreen, setFullscreen] = useState(false)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [showShareMenu, setShowShareMenu] = useState(false)
  const containerRef = useRef(null)
  const shareRef = useRef(null)
  const g = useRef({
    pointers: new Map(),
    mode: null, // 'pinch' | 'pan' | 'navigate' | null
    startScale: 1,
    startOffset: { x: 0, y: 0 },
    startDist: 0,
    startMid: { x: 0, y: 0 },
    startPage: 1,
    startX: 0,
    startY: 0,
    moved: false,
    containerWidth: 0,
    clickX: 0,
    clickY: 0,
  })

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

  useEffect(() => {
    const handler = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShowShareMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

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

  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
  const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })

  const handlePointerDown = (e) => {
    g.current.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (g.current.pointers.size === 1) {
      const rect = e.currentTarget.getBoundingClientRect()
      g.current.startX = e.clientX
      g.current.startY = e.clientY
      g.current.startPage = currentPage
      g.current.moved = false
      g.current.containerWidth = rect.width
      g.current.clickX = e.clientX - rect.left
      g.current.clickY = e.clientY - rect.top
      g.current.mode = null
      e.currentTarget.setPointerCapture(e.pointerId)
    } else if (g.current.pointers.size === 2) {
      const ptrs = [...g.current.pointers.values()]
      g.current.mode = 'pinch'
      g.current.startDist = dist(ptrs[0], ptrs[1])
      g.current.startMid = mid(ptrs[0], ptrs[1])
      g.current.startScale = scale
      g.current.startOffset = { ...offset }
    }
  }

  const handlePointerMove = (e) => {
    const prev = g.current.pointers.get(e.pointerId)
    if (!prev) return
    g.current.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (g.current.mode === 'pinch' && g.current.pointers.size === 2) {
      const ptrs = [...g.current.pointers.values()]
      const d = dist(ptrs[0], ptrs[1])
      const m = mid(ptrs[0], ptrs[1])
      const s = Math.max(0.5, Math.min(3, g.current.startScale * (d / g.current.startDist)))
      setScale(s)
      setOffset({
        x: g.current.startOffset.x + (m.x - g.current.startMid.x),
        y: g.current.startOffset.y + (m.y - g.current.startMid.y),
      })
      return
    }

    if (g.current.pointers.size !== 1) return

    const dx = e.clientX - g.current.startX
    const dy = e.clientY - g.current.startY

    if (!g.current.moved && Math.abs(dx) < 8 && Math.abs(dy) < 8) return

    g.current.moved = true

    if (g.current.mode === null) {
      g.current.mode = scale > 1.05 ? 'pan' : 'navigate'
    }

    if (g.current.mode === 'pan') {
      setOffset({ x: g.current.startOffset.x + dx, y: g.current.startOffset.y + dy })
    } else if (g.current.mode === 'navigate') {
      // existing drag feedback
    }
  }

  const handlePointerUp = (e) => {
    g.current.pointers.delete(e.pointerId)

    if (g.current.mode === 'pinch') {
      if (g.current.pointers.size < 2) g.current.mode = null
      return
    }

    if (g.current.mode === 'pan') {
      g.current.mode = null
      return
    }

    if (g.current.mode === 'navigate' || g.current.mode === null) {
      const r = g.current
      if (!r.moved) {
        const w = r.containerWidth
        if (r.clickX < w * 0.3 && r.startPage > 1) {
          goTo(r.startPage - 1)
        } else if (r.clickX > w * 0.7 && r.startPage < totalPages) {
          goTo(r.startPage + 1)
        }
      } else {
        const threshold = (containerRef.current?.offsetWidth || 800) * 0.18
        const delta = e.clientX - r.startX
        if (delta > threshold && r.startPage > 1) {
          goTo(r.startPage - 1)
        } else if (delta < -threshold && r.startPage < totalPages) {
          goTo(r.startPage + 1)
        }
      }
    }
    g.current.mode = null
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = -e.deltaY * 0.002
        setScale((s) => Math.max(0.5, Math.min(3, s + delta)))
      }
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [])

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 3))
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5))
  const handleZoomReset = () => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }
  const handleDoubleClick = () => {
    if (scale > 1.05) {
      setScale(1)
      setOffset({ x: 0, y: 0 })
    } else {
      setScale(2)
      setOffset({ x: 0, y: 0 })
    }
  }

  const page = pages[currentPage - 1]
  if (!page) return null

  const driveDownloadUrl = catalog?.fileId
    ? `https://drive.google.com/uc?export=download&id=${catalog.fileId}`
    : window.location.href
  const shareText = encodeURIComponent(`${title} — Ficha técnica Samsung`)
  const shareUrl = encodeURIComponent(driveDownloadUrl)

  const downloadUrl = pdfBlob ? URL.createObjectURL(pdfBlob) : null

  const isZoomed = scale > 1.05
  const cursorStyle = isZoomed ? 'grab' : 'default'

  const handleNativeShare = async () => {
    if (!pdfBlob || !navigator.share) return false
    const file = new File([pdfBlob], `${title || 'catalogo'}.pdf`, { type: 'application/pdf' })
    if (navigator.canShare && !navigator.canShare({ files: [file] })) return false
    try {
      await navigator.share({ files: [file], title: title })
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="flex flex-col h-full">
      <header className="relative flex items-center justify-between px-4 py-2 bg-surface/80 backdrop-blur-lg border-b border-white/5 shrink-0 gap-2 z-20">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors shrink-0 z-10"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="text-sm font-medium">Volver<span className="hidden sm:inline"> a Fichas</span></span>
        </button>

        <span className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-on-surface truncate max-w-40 lg:max-w-64">
          {title}
        </span>

        <div className="flex items-center gap-1.5 lg:gap-2">
          <div className="hidden sm:flex items-center gap-0.5 bg-surface-high/50 rounded-lg px-1.5 py-1">
            <button
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="p-0.5 rounded hover:bg-surface-highest transition-colors text-on-surface-variant hover:text-on-surface disabled:opacity-30"
              title="Alejar"
            >
              <span className="material-symbols-outlined text-base">zoom_out</span>
            </button>
            <button
              onClick={handleZoomReset}
              className="px-1.5 py-0.5 rounded text-[11px] font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-highest transition-colors tabular-nums"
              title="Restablecer zoom"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={scale >= 3}
              className="p-0.5 rounded hover:bg-surface-highest transition-colors text-on-surface-variant hover:text-on-surface disabled:opacity-30"
              title="Acercar"
            >
              <span className="material-symbols-outlined text-base">zoom_in</span>
            </button>
          </div>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`${title || 'catalogo'}.pdf`}
              className="p-2 rounded-lg hover:bg-surface-high transition-colors text-on-surface-variant hover:text-on-surface"
              title="Descargar PDF"
            >
              <span className="material-symbols-outlined">download</span>
            </a>
          )}

          <div className="relative" ref={shareRef}>
            <button
              onClick={async () => {
                const shared = await handleNativeShare()
                if (!shared) setShowShareMenu((v) => !v)
              }}
              className="p-2 rounded-lg hover:bg-surface-high transition-colors text-on-surface-variant hover:text-on-surface"
              title="Compartir"
            >
              <span className="material-symbols-outlined">share</span>
            </button>

            {showShareMenu && (
              <div className="absolute right-0 top-full mt-1 bg-surface-high border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 min-w-48">
                <button
                  onClick={() => { setShowShareMenu(false); window.location.href = `https://wa.me/?text=${shareText}%20${shareUrl}` }}
                  className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-surface-highest transition-colors text-sm text-on-surface cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </button>
                <div className="border-t border-white/5" />
                <button
                  onClick={() => { setShowShareMenu(false); window.location.href = `https://t.me/share/url?url=${shareUrl}&text=${shareText}` }}
                  className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-surface-highest transition-colors text-sm text-on-surface cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-[#0088cc]"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  Telegram
                </button>
              </div>
            )}
          </div>

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
        className="flex-1 flex items-center justify-center overflow-hidden relative select-none p-4 lg:p-8"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={(e) => g.current.pointers.delete(e.pointerId)}
        onDoubleClick={handleDoubleClick}
        style={{ touchAction: 'none', cursor: cursorStyle }}
      >
          <div
            className="relative"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transition: g.current.mode ? 'none' : 'transform 0.2s ease-out',
            }}
          >
            <img
              src={page.src}
              alt={`Página ${currentPage}`}
              className="max-h-[calc(100vh-20rem)] max-w-[85vw] object-contain rounded-lg shadow-2xl"
              draggable={false}
            />
          </div>

          {!isZoomed && currentPage > 1 && (
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 hidden lg:block"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => goTo(currentPage - 1)}
                className="w-10 h-10 rounded-full bg-surface-mid/80 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-surface-high transition-colors cursor-pointer opacity-0 hover:opacity-100"
              >
                <span className="material-symbols-outlined text-on-surface-variant">chevron_left</span>
              </button>
            </div>
          )}
          {!isZoomed && currentPage < totalPages && (
            <div
              className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:block"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => goTo(currentPage + 1)}
                className="w-10 h-10 rounded-full bg-surface-mid/80 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-surface-high transition-colors cursor-pointer opacity-0 hover:opacity-100"
              >
                <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </button>
            </div>
          )}
        </div>

      <div className="shrink-0">
        <PageControls currentPage={currentPage} totalPages={totalPages} goTo={goTo} />
        <ThumbnailStrip pages={pages} currentPage={currentPage} goTo={goTo} />
      </div>
    </div>
  )
}
