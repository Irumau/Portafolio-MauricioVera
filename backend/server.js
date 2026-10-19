// ── 1. Imports ──────────────────────────────────────────────────────
import express from 'express'
import cors from 'cors'
import { initDB } from './config/initDB.js'
import routesProyectos from './routes/routesProyectos.js'
import routesAdminProyectos from './routes/routesAdminProyectos.js'
import routesAuth from './routes/routesAuth.js'

// ── 2. Configuración ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000
const api = '/api'

const app = express()

// En producción el backend suele estar detrás de un proxy (Render, Railway, etc.).
// Sin esto, el límite de intentos vería la IP del proxy y no la de cada visitante.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
}

// ── 3. Middlewares globales (se aplican a todas las rutas) ──────────
const corsOptions = {
  // URL de tu frontend. Se le quita la barra final: el navegador compara el origen exacto
  // y 'https://sitio.app/' no es igual a 'https://sitio.app'.
  origin: (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, ''),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.use(express.json())

// ── 4. Rutas ────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('API funcionando correctamente')
})

app.use(`${api}/projects`, routesProyectos)
app.use(`${api}/admin/projects`, routesAdminProyectos)
app.use(`${api}/auth`, routesAuth)

// ── 5. Arranque: primero la base, después el servidor ───────────────
await initDB()

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
