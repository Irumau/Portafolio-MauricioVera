// Cliente base para hablar con tu backend.
// En desarrollo, Vite redirige /api al puerto 3000 (ver vite.config.js).
// En producción podés definir VITE_API_URL en un archivo .env.
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'
const TOKEN_KEY = 'portfolio_token'

// Dónde se guarda el token del panel. localStorage puede fallar (modo privado, etc.),
// por eso cada acceso va en try/catch.
export const tokenStorage = {
  get() {
    try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
  },
  set(token) {
    try { localStorage.setItem(TOKEN_KEY, token) } catch { /* sin almacenamiento disponible */ }
  },
  clear() {
    try { localStorage.removeItem(TOKEN_KEY) } catch { /* nada que limpiar */ }
  },
}

// Qué hacer cuando el backend responde 401 en una ruta protegida (token vencido o inválido).
// Lo registra AuthProvider para cerrar la sesión.
let onUnauthorized = null
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

// Error con la info que manda el backend: { message, errors }
export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

/*
  request('/projects')                                         → GET público
  request('/admin/projects', { auth: true })                   → GET con token
  request('/admin/projects', { method: 'POST', body, auth: true })

  Devuelve json.data. Si la respuesta no es ok, lanza ApiError con el mensaje del backend.
*/
export async function request(path, { signal, headers, body, auth = false, ...options } = {}) {
  const token = auth ? tokenStorage.get() : null
  // FormData (archivos) se manda tal cual: el navegador arma el Content-Type con el "boundary"
  const isFormData = body instanceof FormData
  const hasJsonBody = body !== undefined && !isFormData

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    signal,
    headers: {
      ...(hasJsonBody && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: hasJsonBody ? JSON.stringify(body) : body,
  })

  // 204 No Content (por ejemplo, al borrar): no hay cuerpo que leer
  if (response.status === 204) return null

  const json = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401 && auth) onUnauthorized?.()
    throw new ApiError(
      json?.message ?? `La API respondió con el código ${response.status}`,
      response.status,
      json?.errors,
    )
  }

  return json?.data
}
