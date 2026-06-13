import CatalogCard from './CatalogCard'
import { catalogos } from '../data/catalogos'

export default function CatalogGrid({ onOpenCatalog }) {
  return (
    <div className="h-full flex flex-col p-6 lg:p-8 overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-on-surface mb-2">
          Catálogos
        </h1>
        <p className="text-on-surface-variant text-sm">
          Selecciona un catálogo para visualizarlo
        </p>
      </header>

      {catalogos.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {catalogos.map((cat) => (
            <CatalogCard key={cat.id} catalog={cat} onOpen={onOpenCatalog} />
          ))}
        </div>
      )}
    </div>
  )
}
