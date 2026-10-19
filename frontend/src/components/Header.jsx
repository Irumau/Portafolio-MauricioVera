import { Link, NavLink } from 'react-router-dom'
import { profile } from '../services/profile.js'
import { useAuth } from '../hooks/useAuth.jsx'

const links = [
  { to: '/compendium', label: 'Compendium' },
  { to: '/social-links', label: 'Social Links' },
]

export default function Header() {
  // Solo con sesión iniciada en este navegador aparece el acceso al panel
  const { status } = useAuth()
  const isLoggedIn = status === 'authenticated'

  return (
    <header className="relative z-40 bg-night px-4 py-5 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <span aria-hidden="true" className="slant-band inline-block size-8 bg-accent" />
          <span className="font-display text-2xl font-black uppercase tracking-[0.04em] text-ice">
            {profile.name}
          </span>
        </Link>

        <nav aria-label="Principal" className="flex flex-wrap gap-1.5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `slant px-5 py-2.5 font-mono text-[13px] font-bold uppercase tracking-[0.12em] outline-none transition-colors ${
                  isActive
                    ? 'bg-accent text-night'
                    : 'bg-panel text-ice hover:bg-ice hover:text-night focus-visible:bg-ice focus-visible:text-night'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isLoggedIn && (
            <NavLink
              to="/admin"
              className="slant border border-accent px-5 py-2.5 font-mono text-[13px] font-bold uppercase tracking-[0.12em] text-accent outline-none transition-colors hover:bg-accent hover:text-night focus-visible:bg-accent focus-visible:text-night"
            >
              Panel
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
