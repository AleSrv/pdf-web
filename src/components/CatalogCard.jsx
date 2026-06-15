const COLORS = ['#c0c1ff', '#ddb7ff', '#8083ff', '#ffb783', '#6f00be']

function hashColor(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h) + id.charCodeAt(i)
  return COLORS[Math.abs(h) % COLORS.length]
}

export default function CatalogCard({ catalog, onOpen }) {
  const accent = hashColor(catalog.id)
  const thumb = catalog.images[0]

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
          <img
            src={thumb}
            alt={catalog.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          <div
            className="absolute top-0 left-0 right-0 px-1.5 py-1 rounded-t bg-black/75 text-white/90 text-[9px] font-semibold leading-snug truncate text-center"
          >
            {catalog.title}
          </div>
        </div>
      </div>
    </button>
  )
}
