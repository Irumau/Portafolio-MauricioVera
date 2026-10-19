import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

// Deja pasar solo con sesión iniciada. Si no, manda al login
// y recuerda a dónde quería ir la persona.
export default function ProtectedRoute({ children }) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'checking') {
    return (
      <div className="grid min-h-screen place-items-center font-mono text-sm text-dim">
        Verificando sesión…
      </div>
    )
  }

  if (status !== 'authenticated') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return children
}
