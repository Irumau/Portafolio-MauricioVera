import { useState } from 'react'

function StatusPill({ status }) {
  if (status === 'published') {
    return (
      <span className="inline-block bg-ok px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-night">
        Publicado
      </span>
    )
  }
  return (
    <span className="inline-block border border-dashed border-warn px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-warn">
      Borrador
    </span>
  )
}

function DeleteButton({ onConfirm }) {
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className="min-h-10 cursor-pointer px-2 font-bold text-mist hover:text-ice">
        Borrar
      </button>
    )
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-sm text-warn">¿Seguro?</span>
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true)
          try {
            await onConfirm()
          } finally {
            setBusy(false)
            setConfirming(false)
          }
        }}
        className="min-h-10 cursor-pointer bg-warn px-3 font-bold text-night disabled:opacity-60"
      >
        {busy ? 'Borrando…' : 'Sí, borrar'}
      </button>
      <button type="button" onClick={() => setConfirming(false)} className="min-h-10 cursor-pointer px-2 text-mist hover:text-ice">
        Cancelar
      </button>
    </span>
  )
}

export default function AdminProjectTable({ projects, onEdit, onDelete }) {
  if (projects.length === 0) {
    return (
      <div className="border border-dashed border-panel-light p-8 text-mist">
        Todavía no cargaste ningún proyecto. Usá <strong className="text-ice">Nuevo proyecto</strong> para crear el primero.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-panel">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="bg-panel text-left font-mono text-[11px] uppercase tracking-[0.14em] text-dim">
            <th scope="col" className="px-4 py-3 font-bold">Proyecto</th>
            <th scope="col" className="px-4 py-3 font-bold">Tecnologías</th>
            <th scope="col" className="px-4 py-3 font-bold">Estado</th>
            <th scope="col" className="px-4 py-3 font-bold">Orden</th>
            <th scope="col" className="px-4 py-3 font-bold"><span className="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-t border-panel">
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="aspect-video w-16 shrink-0 overflow-hidden bg-panel">
                    {project.cover && <img src={project.cover} alt="" loading="lazy" className="size-full object-cover" />}
                  </div>
                  <div>
                    <div className="font-bold text-ice">{project.title}</div>
                    {project.featured && <div className="font-mono text-xs text-accent">★ Destacado</div>}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 font-mono text-xs text-mist">
                {project.tech?.length ? project.tech.join(' · ') : '—'}
              </td>
              <td className="px-4 py-3.5">
                <StatusPill status={project.status} />
              </td>
              <td className="px-4 py-3.5 font-mono tabular-nums text-mist">{project.order ?? '—'}</td>
              <td className="whitespace-nowrap px-4 py-3.5 text-right">
                <span className="inline-flex items-center gap-3">
                  <button type="button" onClick={() => onEdit(project)} className="min-h-10 cursor-pointer px-2 font-bold text-accent hover:text-ice">
                    Editar
                  </button>
                  <DeleteButton onConfirm={() => onDelete(project.id)} />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
