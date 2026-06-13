import { useState, useRef } from 'react'

export default function PdfUploader({ onPdfLoad }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const loadPdf = (file) => {
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader()
      reader.onload = () => onPdfLoad(reader.result)
      reader.readAsArrayBuffer(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    loadPdf(file)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    loadPdf(file)
  }

  return (
    <div className="flex items-center justify-center h-full p-8">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative w-full max-w-2xl aspect-[4/3] rounded-2xl
          flex flex-col items-center justify-center gap-6
          cursor-pointer transition-all duration-300
          ${dragging
            ? 'border-2 border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-[1.02]'
            : 'border border-outline-variant bg-surface-low/50 hover:bg-surface-low hover:border-outline/50'
          }
        `}
      >
        <div className="absolute top-6 right-6 opacity-[0.03] pointer-events-none select-none">
          <span
            className="material-symbols-outlined text-[120px]"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48" }}
          >
            picture_as_pdf
          </span>
        </div>

        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
          <span
            className="material-symbols-outlined text-4xl text-primary"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 40" }}
          >
            upload_file
          </span>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-on-surface mb-2">
            Sube tu catálogo PDF
          </h2>
          <p className="text-on-surface-variant text-sm max-w-sm">
            Arrastra y suelta tu archivo PDF aquí o haz clic para seleccionarlo
          </p>
        </div>

        <span className="px-4 py-1.5 rounded-full bg-surface-high text-xs font-semibold uppercase tracking-widest text-outline">
          PDF soportado
        </span>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  )
}
