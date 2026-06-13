import { useRef, useEffect } from 'react'

export default function ThumbnailStrip({ pages, currentPage, goTo }) {
  const stripRef = useRef(null)
  const activeRef = useRef(null)

  useEffect(() => {
    if (activeRef.current && stripRef.current) {
      const strip = stripRef.current
      const active = activeRef.current
      const scrollLeft = active.offsetLeft - strip.offsetWidth / 2 + active.offsetWidth / 2
      strip.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }, [currentPage])

  return (
    <div
      ref={stripRef}
      className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3 bg-surface/60 backdrop-blur-sm border-t border-white/5"
    >
      {pages.map((page, i) => (
        <button
          key={i}
          ref={i + 1 === currentPage ? activeRef : null}
          onClick={() => goTo(i + 1)}
          className={`
            shrink-0 rounded-lg overflow-hidden transition-all duration-200 border border-white/5
            ${i + 1 === currentPage
              ? 'ring-2 ring-primary shadow-lg shadow-primary/20 scale-105'
              : 'opacity-60 hover:opacity-90 hover:scale-[1.02]'
            }
          `}
          style={{ width: 60, height: 85 }}
        >
          <img
            src={page.thumbnail}
            alt={`Página ${i + 1}`}
            className="w-full h-full object-cover"
            draggable={false}
            loading="lazy"
          />
        </button>
      ))}
    </div>
  )
}
