import { createClient } from '@libsql/client'

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error('Falta TURSO_DATABASE_URL en backend/.env')
}

// Un solo cliente para toda la app. Los models lo importan desde acá.
export const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})
