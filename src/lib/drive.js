const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY

async function tryApi(fileId) {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${API_KEY}`
  const res = await fetch(url)
  if (!res.ok) return null
  return await res.arrayBuffer()
}

async function tryProxy(fileId) {
  const directUrl = `https://docs.google.com/uc?export=download&confirm=t&id=${fileId}`
  const proxyUrl = `https://corsproxy.io/?${new URLSearchParams({ url: directUrl })}`
  const res = await fetch(proxyUrl)
  if (!res.ok) return null
  return await res.arrayBuffer()
}

export async function downloadFromDrive(fileId) {
  const result = await tryApi(fileId)
  if (result) return result

  const fallback = await tryProxy(fileId)
  if (fallback) return fallback

  throw new Error(
    'No se pudo descargar de Drive. Compartí el PDF como público ' +
    '("Cualquiera con el enlace" → "Lector") en Google Drive.'
  )
}

export async function downloadFromUrl(url) {
  const res = await fetch(encodeURI(url))
  if (!res.ok) throw new Error('Error al descargar el archivo')
  return await res.arrayBuffer()
}
