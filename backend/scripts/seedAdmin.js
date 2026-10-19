// Crea (o actualiza la contraseña de) tu usuario admin.
// Uso: pnpm --filter backend seed:admin
// Lee ADMIN_EMAIL y ADMIN_PASSWORD de backend/.env
import bcrypt from 'bcrypt'
import { db } from '../config/db.js'
import { initDB } from '../config/initDB.js'

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
const password = process.env.ADMIN_PASSWORD

if (!email || !password) {
  console.error('Faltan ADMIN_EMAIL o ADMIN_PASSWORD en backend/.env')
  process.exit(1)
}

await initDB()

const passwordHash = await bcrypt.hash(password, 12)

await db.execute({
  sql: `INSERT INTO users (email, password_hash) VALUES (?, ?)
        ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash`,
  args: [email, passwordHash],
})

console.log(`Usuario admin listo: ${email}`)
