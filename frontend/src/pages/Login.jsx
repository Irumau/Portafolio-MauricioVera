import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

const inputClass =
  'min-h-11 w-full min-w-0 border border-panel-light bg-night px-3 py-2 text-ice placeholder:text-dim/70'
const labelClass = 'font-mono text-xs font-bold uppercase tracking-[0.12em] text-mist'

export default function Login() {
  const { status, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const destination = location.state?.from ?? '/admin'

  if (status === 'authenticated') return <Navigate to={destination} replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSending(true)
    try {
      await login(email, password)
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.')
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-night-deep px-4 py-12">
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-5 bg-panel p-8">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="slant-band inline-block size-7 bg-accent" />
          <h1 className="font-display text-4xl font-black uppercase">Panel</h1>
        </div>

        {error && (
          <p role="alert" className="border border-warn px-4 py-3 text-sm text-warn">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className={labelClass}>Email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-password" className={labelClass}>Contraseña</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="slant min-h-12 cursor-pointer bg-accent px-7 font-display text-xl font-extrabold uppercase tracking-[0.06em] text-night focus-visible:bg-ice disabled:opacity-60"
        >
          {sending ? 'Entrando…' : 'Iniciar sesión'}
        </button>
      </form>
    </main>
  )
}
