const COLORS = ['#c0c1ff', '#ddb7ff', '#8083ff', '#ffb783', '#6f00be']

function hashColor(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h) + id.charCodeAt(i)
  return COLORS[Math.abs(h) % COLORS.length]
}

export default function CatalogCard({ catalog, thumbnail, onOpen }) {
  const accent = hashColor(catalog.id)
  const hasThumbnail = thumbnail && thumbnail.startsWith('http')

  return (
    <button
      onClick={() => onOpen(catalog)}
      className="group relative bg-surface-low/50 border border-white/5 rounded-md overflow-hidden
        hover:border-primary/30 hover:-translate-y-0.5 active:scale-[0.98]
        transition-all duration-200 text-left cursor-pointer"
    >
      <div className="p-1">
        <div
          className="w-full rounded overflow-hidden shadow-sm
            transition-shadow duration-200 group-hover:shadow-md group-hover:shadow-[var(--accent)]/10"
          style={{ aspectRatio: '210/297', '--accent': accent, position: 'relative' }}
        >
          {hasThumbnail ? (
            <img
              src={thumbnail}
              alt={catalog.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="h-full flex flex-col"
              style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #0f0f1a 100%)' }}
            >
              <div className="px-2 pt-2 pb-1" style={{ background: `linear-gradient(135deg, ${accent}66 0%, ${accent}22 100%)` }}>
                <div className="w-3 h-0.5 rounded-full mb-1" style={{ background: accent }} />
                <h4 className="text-[6px] font-semibold uppercase tracking-[0.12em] text-white/50">
                  Catálogo
                </h4>
              </div>

              <div className="flex-1 flex flex-col justify-center px-2 py-1">
                <h3 className="text-[7px] font-bold text-white/90 leading-snug mb-0.5 line-clamp-3">
                  {catalog.title}
                </h3>
              </div>
            </div>
          )}

          <div
            className="absolute bottom-0 left-0 right-0 px-1.5 py-1 rounded-b bg-black/75 text-white/90 text-[9px] font-semibold leading-snug truncate text-center"
          >
            {catalog.title}
          </div>
        </div>
      </div>
    </button>
  )
}
