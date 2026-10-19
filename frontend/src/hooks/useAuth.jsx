import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { setUnauthorizedHandler, tokenStorage } from '../services/api.js'
import * as authService from '../services/authService.js'

const AuthContext = createContext(null)

/*
  Estado global de la sesión del panel.
  status: 'checking'      → hay un token guardado y se está verificando con /auth/me
          'authenticated' → sesión válida
          'guest'         → sin sesión
*/
export function AuthProvider({ children }) {
  const [state, setState] = useState(() => ({
    status: tokenStorage.get() ? 'checking' : 'guest',
    user: null,
  }))

  const logout = useCallback(() => {
    authService.logout()
    setState({ status: 'guest', user: null })
  }, [])

  const login = useCallback(async (email, password) => {
    const user = await authService.login(email, password)
    setState({ status: 'authenticated', user })
    return user
  }, [])

  // Si el backend responde 401 en cualquier pedido del panel, se cierra la sesión
  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  // Al cargar la página: si hay un token guardado, comprobar que siga siendo válido
  useEffect(() => {
    if (state.status !== 'checking') return
    authService
      .getMe()
      .then((user) => setState({ status: 'authenticated', user }))
      .catch(() => logout())
  }, [state.status, logout])

  const value = useMemo(() => ({ ...state, login, logout }), [state, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth tiene que usarse dentro de <AuthProvider>')
  return context
}
