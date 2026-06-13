import { useState, useEffect } from 'react'

export default function PageControls({ currentPage, totalPages, goTo }) {
  const [inputValue, setInputValue] = useState(String(currentPage))

  useEffect(() => {
    setInputValue(String(currentPage))
  }, [currentPage])

  const handleSubmit = (e) => {
    e.preventDefault()
    const page = parseInt(inputValue, 10)
    if (page >= 1 && page <= totalPages) goTo(page)
    setInputValue(String(currentPage))
  }

  return (
    <div className="flex items-center justify-center gap-4 py-2 px-4 bg-surface/80 backdrop-blur-lg border-t border-white/5">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <span className="material-symbols-outlined text-base">chevron_left</span>
        Anterior
      </button>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={totalPages}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={(e) => e.target.select()}
          className="w-14 text-center bg-surface-high border border-outline-variant rounded-lg px-2 py-1 text-sm text-on-surface font-medium outline-none focus:border-primary/50 transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="text-sm text-on-surface-variant">de {totalPages}</span>
      </form>

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Siguiente
        <span className="material-symbols-outlined text-base">chevron_right</span>
      </button>
    </div>
  )
}
