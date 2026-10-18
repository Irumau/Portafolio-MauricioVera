import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminProjectTable from '../components/AdminProjectTable.jsx'
import ProjectForm from '../components/ProjectForm.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { adminProjects } from '../services/adminProjectsService.js'

export default function AdminPanel() {
  const { user, logout } = useAuth()
  const [projects, setProjects] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [loadError, setLoadError] = useState('')
  const [editing, setEditing] = useState(null)    // null = formulario cerrado, {} = nuevo, proyecto = edición
  const [notice, setNotice] = useState(null)     // { text, type: 'ok' | 'error' }

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      setProjects(await adminProjects.list())
      setStatus('success')
    } catch (error) {
      setLoadError(error.message)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function showNotice(text, type = 'ok') {
    setNotice({ text, type })
    setTimeout(() => setNotice(null), type === 'error' ? 6000 : 3000)
  }

  async function handleSave(data, cover) {
    // 1) Datos del proyecto (JSON)
    const saved = editing?.id
      ? await adminProjects.update(editing.id, data)
      : await adminProjects.create(data)
    const id = saved.id

    // 2) Portada (archivo aparte). Si falla, el proyecto ya quedó guardado igual.
    let coverFailed = ''
    try {
      if (cover.file) await adminProjects.uploadCover(id, cover.file)
      else if (cover.remove) await adminProjects.removeCover(id)
    } catch (error) {
      coverFailed = error.message
    }

    await load() // trae los proyectos tal como quedaron guardados
    setEditing(null)

    if (coverFailed) {
      showNotice(`El proyecto se guardó, pero la portada no: ${coverFailed}`, 'error')
    } else {
      showNotice(editing?.id ? 'Proyecto actualizado' : 'Proyecto creado')
    }
  }

  async function handleDelete(id) {
    try {
      await adminProjects.remove(id)
      setProjects((list) => list.filter((p) => p.id !== id))
      if (editing?.id === id) setEditing(null)
      showNotice('Proyecto borrado')
    } catch (error) {
      showNotice(error.message, 'error')
    }
  }

  return (
    <div className="flex min-h-screen flex-wrap bg-night text-ice">
      {/* Barra lateral */}
      <aside className="flex max-w-full flex-[1_1_220px] flex-col gap-6 bg-night-deep px-4 py-7">
        <div className="flex items-center gap-2.5 px-2">
          <span aria-hidden="true" className="slant-band inline-block size-6 bg-accent" />
          <span className="font-display text-xl font-black uppercase tracking-[0.04em]">Panel</span>
        </div>
        <nav aria-label="Panel" className="flex flex-col gap-1">
          <span aria-current="page" className="slant-right flex justify-between bg-accent px-4 py-3 font-display text-lg font-extrabold uppercase text-night">
            <span>Proyectos</span>
            <span className="font-mono text-sm">{projects.length}</span>
          </span>
          <Link to="/" className="px-4 py-3 font-display text-lg font-extrabold uppercase text-ice hover:bg-panel">
            Ver sitio
          </Link>
        </nav>
        <div className="mt-auto flex flex-col gap-2 border-t border-panel px-2 pt-4">
          <span className="break-all font-mono text-xs text-dim">{user?.email}</span>
          <button type="button" onClick={logout} className="min-h-10 cursor-pointer self-start font-mono text-xs font-bold uppercase tracking-[0.12em] text-mist hover:text-ice">
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex min-w-0 flex-[999_1_560px] flex-col gap-7 px-4 py-8 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="origin-left -skew-x-[8deg] font-display text-6xl font-black uppercase leading-[0.9]">
            Proyectos
          </h1>
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing({})}
              className="slant min-h-12 cursor-pointer bg-ice px-7 font-display text-lg font-extrabold uppercase tracking-[0.06em] text-night focus-visible:bg-accent"
            >
              + Nuevo proyecto
            </button>
          )}
        </div>

        {notice && (
          <p
            role="status"
            className={`self-start px-4 py-2 font-bold text-night ${notice.type === 'error' ? 'bg-warn' : 'bg-ok'}`}
          >
            {notice.text}
          </p>
        )}

        {editing && (
          <ProjectForm
            key={editing.id ?? 'new'}
            project={editing.id ? editing : null}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}

        {status === 'loading' && <p className="font-mono text-sm text-dim">Cargando proyectos…</p>}

        {status === 'error' && (
          <div className="flex flex-col items-start gap-3 border border-warn p-6">
            <p className="text-warn">{loadError}</p>
            <button type="button" onClick={load} className="min-h-10 cursor-pointer bg-warn px-4 font-bold text-night">
              Reintentar
            </button>
          </div>
        )}

        {status === 'success' && (
          <AdminProjectTable
            projects={projects}
            onEdit={(project) => {
              setEditing(project)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  )
}
