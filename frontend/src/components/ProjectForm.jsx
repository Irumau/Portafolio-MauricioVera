import { useEffect, useState } from 'react'
import { ApiError } from '../services/api.js'

const inputClass =
  'min-h-11 w-full min-w-0 border border-panel-light bg-night px-3 py-2 text-ice placeholder:text-dim/70'
const labelClass = 'font-mono text-xs font-bold uppercase tracking-[0.12em] text-mist'

const MAX_COVER_MB = 2
const COVER_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

function FieldError({ messages }) {
  if (!messages?.length) return null
  return <p className="text-sm text-warn">{messages[0]}</p>
}

// Convierte un proyecto (o nada, si es nuevo) en los valores del formulario
function toFormValues(project) {
  return {
    title: project?.title ?? '',
    summary: project?.summary ?? '',
    description: project?.description ?? '',
    tech: project?.tech ?? [],
    repoUrl: project?.repoUrl ?? '',
    demoUrl: project?.demoUrl ?? '',
    featured: project?.featured ?? false,
    status: project?.status ?? 'draft',
    order: project?.order ?? '',
  }
}

/*
  Formulario para crear o editar un proyecto.
  project: el proyecto a editar, o null para uno nuevo.
  onSubmit(data, cover): guarda; si el backend rechaza los datos, los errores aparecen bajo cada campo.
    cover = { file: File | null, remove: boolean }
*/
export default function ProjectForm({ project, onSubmit, onCancel }) {
  const isEditing = Boolean(project?.id)
  const [values, setValues] = useState(() => toFormValues(project))
  const [techInput, setTechInput] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [removeCover, setRemoveCover] = useState(false)
  const [coverError, setCoverError] = useState('')

  // Vista previa local de la imagen elegida (se libera al cambiarla o al cerrar el formulario)
  useEffect(() => {
    if (!coverFile) {
      setCoverPreview(null)
      return
    }
    const url = URL.createObjectURL(coverFile)
    setCoverPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [coverFile])

  function handleCoverChange(event) {
    const file = event.target.files?.[0] ?? null
    setCoverError('')
    if (!file) return setCoverFile(null)

    // Se revisa acá para avisar al instante; el backend vuelve a validar igual
    if (!COVER_TYPES.includes(file.type)) {
      event.target.value = ''
      return setCoverError('Formato no permitido. Usá JPG, PNG, WebP o AVIF.')
    }
    if (file.size > MAX_COVER_MB * 1024 * 1024) {
      event.target.value = ''
      return setCoverError(`La imagen supera los ${MAX_COVER_MB} MB.`)
    }
    setCoverFile(file)
    setRemoveCover(false)
  }

  const currentCover = coverPreview ?? (removeCover ? null : project?.cover)

  const set = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function addTech() {
    const name = techInput.trim().replace(/,$/, '')
    if (name && !values.tech.some((t) => t.toLowerCase() === name.toLowerCase())) {
      setValues((prev) => ({ ...prev, tech: [...prev.tech, name] }))
    }
    setTechInput('')
  }

  function removeTech(name) {
    setValues((prev) => ({ ...prev, tech: prev.tech.filter((t) => t !== name) }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrors({})
    setFormError('')

    const data = {
      title: values.title,
      summary: values.summary,
      description: values.description,
      tech: values.tech,
      repoUrl: values.repoUrl,
      demoUrl: values.demoUrl,
      featured: values.featured,
      status: values.status,
    }
    if (values.order !== '') data.order = Number(values.order)

    setSaving(true)
    try {
      await onSubmit(data, { file: coverFile, remove: removeCover && !coverFile })
    } catch (error) {
      if (error instanceof ApiError && error.errors?.body) {
        setErrors(error.errors.body)
        setFormError('Revisá los campos marcados.')
      } else {
        setFormError(error.message || 'No se pudo guardar el proyecto.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 bg-panel p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-3xl font-black uppercase">
          {isEditing ? 'Editar proyecto' : 'Nuevo proyecto'}
        </h2>
        <span className="bg-accent px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-night">
          {isEditing ? `PATCH /${project.id}` : 'POST'}
        </span>
      </div>

      {formError && (
        <p role="alert" className="border border-warn px-4 py-3 text-sm text-warn">
          {formError}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="pf-title" className={labelClass}>Título</label>
        <input id="pf-title" type="text" value={values.title} onChange={set('title')} className={inputClass} required />
        <FieldError messages={errors.title} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="pf-summary" className={labelClass}>Resumen</label>
        <textarea id="pf-summary" rows={2} value={values.summary} onChange={set('summary')} className={`${inputClass} resize-y`} />
        <p className="text-xs text-dim">Se muestra en la tarjeta. Hasta 160 caracteres ({values.summary.length}/160).</p>
        <FieldError messages={errors.summary} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="pf-description" className={labelClass}>Descripción (Markdown, opcional)</label>
        <textarea id="pf-description" rows={4} value={values.description} onChange={set('description')} className={`${inputClass} resize-y`} />
        <FieldError messages={errors.description} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="pf-tech" className={labelClass}>Tecnologías</label>
        <div className="flex flex-wrap items-center gap-1.5 border border-panel-light bg-night p-2">
          {values.tech.map((name) => (
            <span key={name} className="inline-flex items-center gap-1 bg-panel py-1 pl-2.5 pr-1 font-mono text-xs font-bold">
              {name}
              <button
                type="button"
                aria-label={`Quitar ${name}`}
                onClick={() => removeTech(name)}
                className="grid size-6 cursor-pointer place-items-center text-dim hover:text-ice"
              >
                ×
              </button>
            </span>
          ))}
          <input
            id="pf-tech"
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                addTech()
              }
            }}
            onBlur={addTech}
            placeholder="Escribí y apretá Enter"
            className="min-h-8 min-w-0 flex-1 basis-32 bg-transparent px-1.5 text-ice placeholder:text-dim/70"
          />
        </div>
        <FieldError messages={errors.tech} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="pf-cover" className={labelClass}>Portada</label>
        <div className="flex flex-wrap items-start gap-4 border border-panel-light bg-night p-3">
          <div className="aspect-video w-48 max-w-full overflow-hidden bg-panel">
            {currentCover ? (
              <img src={currentCover} alt="Vista previa de la portada" className="size-full object-cover" />
            ) : (
              <div className="stripes grid size-full place-items-center font-mono text-[11px] uppercase tracking-[0.14em] text-dim">
                Sin portada
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 basis-48 flex-col gap-2">
            <input
              id="pf-cover"
              type="file"
              accept={COVER_TYPES.join(',')}
              onChange={handleCoverChange}
              className="max-w-full text-sm text-mist file:mr-3 file:cursor-pointer file:border-0 file:bg-panel file:px-3 file:py-2 file:font-bold file:text-ice"
            />
            <p className="text-xs text-dim">JPG, PNG, WebP o AVIF · hasta {MAX_COVER_MB} MB · se recorta a 16:9.</p>
            {project?.cover && !coverFile && (
              <label htmlFor="pf-remove-cover" className="flex cursor-pointer items-center gap-2 text-sm text-mist">
                <input
                  id="pf-remove-cover"
                  type="checkbox"
                  checked={removeCover}
                  onChange={(e) => setRemoveCover(e.target.checked)}
                  className="size-4 accent-accent"
                />
                Quitar la portada actual
              </label>
            )}
            {coverError && <p className="text-sm text-warn">{coverError}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pf-repo" className={labelClass}>Repositorio</label>
          <input id="pf-repo" type="url" value={values.repoUrl} onChange={set('repoUrl')} placeholder="https://github.com/…" className={inputClass} />
          <FieldError messages={errors.repoUrl} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pf-demo" className={labelClass}>Demo</label>
          <input id="pf-demo" type="url" value={values.demoUrl} onChange={set('demoUrl')} placeholder="https://…" className={inputClass} />
          <FieldError messages={errors.demoUrl} />
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pf-status" className={labelClass}>Estado</label>
          <select id="pf-status" value={values.status} onChange={set('status')} className={inputClass}>
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </select>
          <FieldError messages={errors.status} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pf-order" className={labelClass}>Orden</label>
          <input id="pf-order" type="number" min="0" step="1" value={values.order} onChange={set('order')} className={inputClass} />
          <FieldError messages={errors.order} />
        </div>
        <label htmlFor="pf-featured" className="flex min-h-11 cursor-pointer items-center gap-3 font-bold">
          <input id="pf-featured" type="checkbox" checked={values.featured} onChange={set('featured')} className="size-5 accent-accent" />
          Destacar en la home
        </label>
      </div>

      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="min-h-12 cursor-pointer border-2 border-panel-light px-5 font-display text-lg font-extrabold uppercase tracking-[0.06em] hover:border-ice">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="slant min-h-12 cursor-pointer bg-accent px-7 font-display text-lg font-extrabold uppercase tracking-[0.06em] text-night focus-visible:bg-ice disabled:opacity-60"
        >
          {saving ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear proyecto'}
        </button>
      </div>
    </form>
  )
}
