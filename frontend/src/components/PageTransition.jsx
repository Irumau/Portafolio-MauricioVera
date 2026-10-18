import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { stagger, wipe } from '../animations/variants.js'

// Envuelve cada página: escalona la entrada de sus hijos
// y pasa la cortina diagonal al entrar y al salir.
export default function PageTransition({ children, className = '' }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <motion.main
      initial="initial"
      animate="animate"
      exit="exit"
      variants={stagger(0.08, 0.2)}
      className={`relative ${className}`}
    >
      <motion.div
        aria-hidden="true"
        variants={wipe}
        style={{ skewX: -12 }}
        className="pointer-events-none fixed inset-y-0 -left-[15%] z-50 w-[130%] bg-accent"
      />
      {children}
    </motion.main>
  )
}
