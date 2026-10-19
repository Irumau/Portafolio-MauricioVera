import { useCallback, useEffect, useState } from 'react'
import { getProjects } from '../services/projectsService.js'

// Carga los proyectos y expone el estado de la petición.
// status: 'loading' | 'success' | 'error'
export default function useProjects() {
  const [state, setState] = useState({ status: 'loading', projects: [], error: null })

  const load = useCallback(async (signal) => {
    setState((prev) => ({ ...prev, status: 'loading', error: null }))
    try {
      const projects = await getProjects({ signal })
      setState({ status: 'success', projects: Array.isArray(projects) ? projects : [], error: null })
    } catch (error) {
      if (error.name === 'AbortError') return
      setState({ status: 'error', projects: [], error })
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load])

  return { ...state, reload: () => load() }
}
