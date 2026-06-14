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
      className="group relative bg-surface-low/50 border border-white/5 rounded-lg overflow-hidden
        hover:border-primary/30 hover:-translate-y-0.5 active:scale-[0.98]
        transition-all duration-200 text-left cursor-pointer"
    >
      <div className="p-2 pb-0">
        <div
          className="w-full rounded-md overflow-hidden shadow-md
            transition-shadow duration-200 group-hover:shadow-lg group-hover:shadow-[var(--accent)]/10"
          style={{ aspectRatio: '210/297', '--accent': accent }}
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
              <div className="px-3 pt-3 pb-1.5" style={{ background: `linear-gradient(135deg, ${accent}66 0%, ${accent}22 100%)` }}>
                <div className="w-5 h-0.5 rounded-full mb-2" style={{ background: accent }} />
                <h4 className="text-[8px] font-semibold uppercase tracking-[0.15em] text-white/50">
                  Catálogo
                </h4>
              </div>

              <div className="flex-1 flex flex-col justify-center px-3 py-2">
                <h3 className="text-[10px] font-bold text-white/90 leading-snug mb-1 line-clamp-3">
                  {catalog.title}
                </h3>
                {catalog.subtitle && (
                  <p className="text-[7px] text-white/50 leading-relaxed line-clamp-2">
                    {catalog.subtitle}
                  </p>
                )}
              </div>

              <div className="px-3 pb-3 flex items-center justify-between">
                <span className="text-[7px] font-semibold uppercase tracking-[0.12em] text-white/30">
                  {catalog.pages} págs
                </span>
                <span
                  className="text-[7px] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: `${accent}99` }}
                >
                  PDF
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-2 py-1.5">
        <span className="inline-block px-1.5 py-0.5 rounded-sm bg-surface-high text-[8px] font-semibold uppercase tracking-widest text-outline">
          {catalog.pages} páginas
        </span>
      </div>
    </button>
  )
}
