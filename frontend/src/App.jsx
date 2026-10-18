import { AnimatePresence, MotionConfig } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Hero from './pages/Hero.jsx'
import Compendium from './pages/Compendium.jsx'
import SocialLinks from './pages/SocialLinks.jsx'
import Login from './pages/Login.jsx'
import AdminPanel from './pages/AdminPanel.jsx'

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    // reducedMotion="user": si el sistema pide menos movimiento, Framer desactiva las animaciones
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-clip">
        {/* El panel tiene su propia barra lateral, así que el header público no se muestra ahí */}
        {!isAdmin && <Header />}

        {/* mode="wait": la página que sale termina su animación antes de que entre la nueva */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Hero />} />
            <Route path="/compendium" element={<Compendium />} />
            <Route path="/social-links" element={<SocialLinks />} />

            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
