import { motion } from 'framer-motion'
import { cardReveal } from '../animations/variants.js'

function Cover({ src, title, light }) {
  if (src) {
    return <img src={src} alt={`Captura de ${title}`} loading="lazy" className="size-full object-cover" />
  }
  return (
    <div
      aria-hidden="true"
      className={`grid size-full place-items-center font-display text-6xl font-black uppercase ${
        light ? 'stripes-light text-ink/40' : 'stripes text-dim/40'
      }`}
    >
      {title.slice(0, 2)}
    </div>
  )
}

function TechList({ tech, light }) {
  if (!tech?.length) return null
  return (
    <ul aria-label="Tecnologías" className="flex flex-wrap gap-2">
      {tech.map((name) => (
        <li
          key={name}
          className={`border px-2.5 py-1 font-mono text-xs font-bold ${light ? 'border-ink/40' : 'border-ink'}`}
        >
          {name}
        </li>
      ))}
    </ul>
  )
}

function ProjectLinks({ demoUrl, repoUrl, light }) {
  const base = 'font-mono text-sm font-bold uppercase tracking-[0.1em] underline-offset-4 hover:underline'
  return (
    <div className="flex flex-wrap gap-5">
      {demoUrl && (
        <a href={demoUrl} target="_blank" rel="noreferrer" className={`${base} ${light ? 'text-night' : 'text-accent'}`}>
          Ver demo ↗
        </a>
      )}
      {repoUrl && (
        <a href={repoUrl} target="_blank" rel="noreferrer" className={`${base} ${light ? 'text-night' : 'text-ice'}`}>
          Ver código ↗
        </a>
      )}
    </div>
  )
}

// Tarjeta de proyecto. Aparece al entrar en pantalla.
// featured: versión grande y oscura para el proyecto destacado.
export default function ProjectCard({ project, index = 0, featured = false }) {
  const { title, summary, tech, repoUrl, demoUrl, cover } = project
  const reveal = {
    variants: cardReveal,
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, amount: 0.25 },
    custom: index,
  }

  if (featured) {
    return (
      <motion.article {...reveal} className="slant-card flex flex-wrap bg-night text-ice">
        <div className="aspect-video min-h-64 flex-[1_1_420px] overflow-hidden">
          <Cover src={cover} title={title} />
        </div>
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4 py-10 pl-8 pr-16 sm:pl-11">
          <span className="self-start bg-accent px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.16em] text-night">
            Destacado
          </span>
          <h3 className="font-display text-5xl font-black uppercase leading-[0.95] text-balance">{title}</h3>
          <p className="max-w-[46ch] text-mist">{summary}</p>
          <TechList tech={tech} />
          <ProjectLinks demoUrl={demoUrl} repoUrl={repoUrl} />
        </div>
      </motion.article>
    )
  }

  return (
    <motion.article
      {...reveal}
      whileHover={{ y: -4 }}
      className="flex flex-col border-2 border-night bg-white text-night"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <Cover src={cover} title={title} light />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-display text-3xl font-black uppercase leading-none">{title}</h3>
        <p className="text-[15px] text-ink">{summary}</p>
        <div className="mt-auto flex flex-col gap-4 pt-2">
          <TechList tech={tech} light />
          <ProjectLinks demoUrl={demoUrl} repoUrl={repoUrl} light />
        </div>
      </div>
    </motion.article>
  )
}
