const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY

export async function downloadFromDrive(fileId) {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${API_KEY}`
  const res = await fetch(url)
  if (!res.ok) {
    if (res.status === 404) throw new Error('Archivo no encontrado en Google Drive')
    if (res.status === 403) throw new Error('Sin permisos para acceder al archivo')
    throw new Error('Error al descargar de Google Drive')
  }
  return await res.arrayBuffer()
}
