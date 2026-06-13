const COLORS = ['#c0c1ff', '#ddb7ff', '#8083ff', '#ffb783', '#6f00be']

function hashColor(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h) + id.charCodeAt(i)
  return COLORS[Math.abs(h) % COLORS.length]
}

export default function CatalogCard({ catalog, onOpen }) {
  const accent = hashColor(catalog.id)

  return (
    <button
      onClick={() => onOpen(catalog)}
      className="group relative bg-surface-low/50 border border-white/5 rounded-xl overflow-hidden
        hover:border-primary/30 hover:-translate-y-0.5 active:scale-[0.98]
        transition-all duration-200 text-left cursor-pointer"
    >
      <div className="p-4 pb-0">
        <div
          className="w-full rounded-lg overflow-hidden shadow-lg
            transition-shadow duration-200 group-hover:shadow-xl group-hover:shadow-[var(--accent)]/10"
          style={{ aspectRatio: '210/297', '--accent': accent }}
        >
          <div
            className="h-full flex flex-col"
            style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #0f0f1a 100%)' }}
          >
            <div className="px-5 pt-6 pb-3" style={{ background: `linear-gradient(135deg, ${accent}66 0%, ${accent}22 100%)` }}>
              <div className="w-8 h-1 rounded-full mb-3" style={{ background: accent }} />
              <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
                Catálogo
              </h4>
            </div>

            <div className="flex-1 flex flex-col justify-center px-5 py-4">
              <h3 className="text-sm font-bold text-white/90 leading-snug mb-2 line-clamp-3">
                {catalog.title}
              </h3>
              {catalog.subtitle && (
                <p className="text-[10px] text-white/50 leading-relaxed line-clamp-2">
                  {catalog.subtitle}
                </p>
              )}
            </div>

            <div className="px-5 pb-5 flex items-center justify-between">
              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/30">
                {catalog.pages} págs
              </span>
              <span
                className="text-[9px] font-semibold uppercase tracking-[0.12em]"
                style={{ color: `${accent}99` }}
              >
                PDF
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        <span className="inline-block px-2 py-0.5 rounded-full bg-surface-high text-[9px] font-semibold uppercase tracking-widest text-outline">
          {catalog.pages} páginas
        </span>
      </div>
    </button>
  )
}
