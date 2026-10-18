import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const MotionLink = motion.create(Link)

// El clip-path recorta el outline de foco, así que el foco se marca cambiando el color.
const variants = {
  accent: 'bg-accent text-night focus-visible:bg-ice',
  ice: 'bg-ice text-night focus-visible:bg-accent',
  dark: 'bg-night text-ice focus-visible:bg-accent focus-visible:text-night',
}

const hover = { whileHover: { x: 6 }, whileTap: { scale: 0.97 } }

// Botón en paralelogramo.
// Con "to" navega dentro del sitio, con "href" abre un link externo, sin ninguno es un <button>.
export default function SlantButton({ to, href, variant = 'accent', className = '', children, ...props }) {
  const classes = `slant inline-flex min-h-12 items-center justify-center px-8 py-3 font-display text-xl font-extrabold uppercase tracking-[0.06em] outline-none ${variants[variant]} ${className}`

  if (to) {
    return (
      <MotionLink to={to} className={classes} {...hover} {...props}>
        {children}
      </MotionLink>
    )
  }

  if (href) {
    return (
      <motion.a href={href} target="_blank" rel="noreferrer" className={classes} {...hover} {...props}>
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button type="button" className={`${classes} cursor-pointer`} {...hover} {...props}>
      {children}
    </motion.button>
  )
}
