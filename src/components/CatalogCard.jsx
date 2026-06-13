export default function CatalogCard({ catalog, onOpen }) {
  return (
    <button
      onClick={() => onOpen(catalog)}
      className="group relative bg-surface-low/50 border border-white/5 rounded-xl overflow-hidden
        hover:border-primary/30 hover:-translate-y-0.5 active:scale-[0.98]
        transition-all duration-200 text-left cursor-pointer"
    >
      <div className="aspect-[4/3] flex items-center justify-center bg-surface/80">
        <span
          className="material-symbols-outlined text-7xl text-outline/30 group-hover:text-primary/40 transition-colors duration-200"
          style={{ fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48" }}
        >
          picture_as_pdf
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-on-surface mb-1 leading-tight">
          {catalog.title}
        </h3>
        {catalog.subtitle && (
          <p className="text-sm text-on-surface-variant mb-3 line-clamp-1">
            {catalog.subtitle}
          </p>
        )}
        <span className="inline-block px-2.5 py-1 rounded-full bg-surface-high text-[10px] font-semibold uppercase tracking-widest text-outline">
          {catalog.pages} páginas
        </span>
      </div>
    </button>
  )
}
