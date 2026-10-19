import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import SlantButton from '../components/SlantButton.jsx'
import useProjects from '../hooks/useProjects.js'
import { fadeUp, slideFromLeft } from '../animations/variants.js'

function LoadingGrid() {
  return (
    <div aria-label="Cargando proyectos" className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-7">
      {[0, 1, 2].map((key) => (
        <div key={key} className="stripes-light aspect-[4/5] animate-pulse border-2 border-night/20" />
      ))}
    </div>
  )
}

function Message({ title, children, action }) {
  return (
    <motion.div variants={fadeUp} className="flex max-w-xl flex-col items-start gap-4 border-2 border-night bg-white p-8">
      <h2 className="font-display text-4xl font-black uppercase leading-none">{title}</h2>
      <p className="text-ink">{children}</p>
      {action}
    </motion.div>
  )
}

export default function Compendium() {
  const { status, projects, reload } = useProjects()

  const featured = projects.find((project) => project.featured) ?? projects[0]
  const others = projects.filter((project) => project !== featured)

  return (
    <PageTransition className="min-h-screen bg-ice text-night">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-28 pt-16 sm:px-6">
        <motion.header variants={slideFromLeft} className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="origin-left -skew-x-[8deg] font-display text-[clamp(56px,8vw,112px)] font-black uppercase leading-[0.9]">
            Compendium
          </h1>
          {status === 'success' && (
            <p className="font-mono text-sm font-bold text-ink">
              {projects.length} {projects.length === 1 ? 'proyecto' : 'proyectos'}
            </p>
          )}
        </motion.header>

        {status === 'loading' && <LoadingGrid />}

        {status === 'error' && (
          <Message
            title="No se cargaron los proyectos"
            action={
              <SlantButton variant="dark" onClick={reload}>
                Reintentar
              </SlantButton>
            }
          >
            El backend no respondió en /api/projects. Revisá que esté corriendo con pnpm dev:back y volvé a intentar.
          </Message>
        )}

        {status === 'success' && projects.length === 0 && (
          <Message title="Todavía no hay proyectos">
            Cargá el primero desde el panel y va a aparecer acá.
          </Message>
        )}

        {status === 'success' && projects.length > 0 && (
          <>
            <ProjectCard project={featured} featured />
            {others.length > 0 && (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-7">
                {others.map((project, index) => (
                  <ProjectCard key={project.id ?? project.title} project={project} index={index} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  )
}
