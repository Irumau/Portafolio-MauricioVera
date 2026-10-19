import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { slideFromRight, stagger } from '../animations/variants.js'
import useMediaQuery from '../hooks/useMediaQuery.js'

const MotionLink = motion.create(Link)

// Menú de comandos escalonado e inclinado.
// items: [{ to: '/ruta', label: 'Texto' }] o [{ href: 'https://...', label: 'Texto' }]
export default function DiagonalMenu({ items, title = 'Seleccioná' }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return (
    // La rotación va en un div aparte para que no choque con las transformaciones de Framer
    <div className="w-full max-w-sm lg:-rotate-[4deg]">
      <motion.ul variants={stagger(0.08, 0.5)} className="flex flex-col gap-2.5">
        <motion.li variants={slideFromRight}>
          <span className="inline-block bg-accent px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-night">
            {title}
          </span>
        </motion.li>

        {items.map((item, index) => {
          const className =
            'slant-right group flex items-baseline justify-between bg-panel px-5 py-3 font-display text-3xl font-black uppercase text-ice no-underline outline-none transition-colors hover:bg-ice hover:text-night focus-visible:bg-ice focus-visible:text-night'
          const content = (
            <>
              <span>{item.label}</span>
              <span aria-hidden="true" className="font-mono text-sm opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {item.href ? '↗' : '▶'}
              </span>
            </>
          )

          return (
            <motion.li
              key={item.label}
              variants={slideFromRight}
              style={{ marginLeft: isDesktop ? index * 18 : 0 }}
            >
              {item.href ? (
                <motion.a href={item.href} target="_blank" rel="noreferrer" className={className} whileHover={{ x: 10 }}>
                  {content}
                </motion.a>
              ) : (
                <MotionLink to={item.to} className={className} whileHover={{ x: 10 }}>
                  {content}
                </MotionLink>
              )}
            </motion.li>
          )
        })}
      </motion.ul>
    </div>
  )
}
