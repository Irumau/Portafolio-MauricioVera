// Caché en memoria para las consultas PÚBLICAS de proyectos.
//
// Los proyectos solo cambian cuando el admin los edita, pero cada visitante
// dispararía la misma consulta a Turso. Con esta caché, la primera visita consulta
// la base y las siguientes reciben la respuesta guardada, sin salir del servidor.
//
// Cada vez que el admin crea, edita o borra algo, se llama a invalidateProjectsCache()
// y la próxima visita vuelve a consultar la base con los datos nuevos.

// Red de seguridad: aunque nadie invalide, los datos se renuevan cada 10 minutos.
const TTL_MS = 10 * 60 * 1000

// clave → { promise, expires }
// Se guarda la PROMESA (no el resultado): si llegan 5 visitas a la vez con la caché vacía,
// las 5 esperan la misma consulta en vez de lanzar 5 consultas iguales a Turso.
const store = new Map()

export async function getOrLoad(key, loader) {
  const entry = store.get(key)
  if (entry && Date.now() < entry.expires) {
    return entry.promise
  }

  const promise = loader()
  store.set(key, { promise, expires: Date.now() + TTL_MS })

  try {
    return await promise
  } catch (err) {
    // Si la consulta falló, no guardamos el error: la próxima visita reintenta
    store.delete(key)
    throw err
  }
}

export function invalidateProjectsCache() {
  store.clear()
}
