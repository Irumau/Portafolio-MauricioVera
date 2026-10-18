import { useEffect, useState } from 'react'

// Devuelve true mientras la media query se cumpla. Se actualiza al redimensionar.
// Ej: const isDesktop = useMediaQuery('(min-width: 1024px)')
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return matches
}
