import { readFile } from 'node:fs/promises'
import { db } from './db.js'

// Crea las tablas si no existen, leyendo config/schema.sql.
// Se llama una vez al arrancar el servidor, antes de app.listen().
export async function initDB() {
  const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf8')
  await db.executeMultiple(schema)

  // Migración: bases creadas antes de tener portadas no tienen esta columna.
  // CREATE TABLE IF NOT EXISTS no modifica tablas existentes, así que se agrega a mano.
  const { rows: columns } = await db.execute('PRAGMA table_info(projects)')
  if (!columns.some((column) => column.name === 'cover_public_id')) {
    await db.execute('ALTER TABLE projects ADD COLUMN cover_public_id TEXT')
  }
  console.log('Base de datos lista')
}
