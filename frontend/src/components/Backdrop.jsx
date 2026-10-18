import { motion } from 'framer-motion'
import { bandIn, lineDraw } from '../animations/variants.js'

// Bandas diagonales del fondo del hero.
// Si más adelante sumás un fondo 3D (assets/models), este es el lugar para montarlo.
export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <motion.div
        variants={bandIn}
        className="slant-band absolute -right-[10%] top-10 h-[520px] w-[70%] bg-panel-light"
      />
      <motion.div
        variants={bandIn}
        className="absolute right-[8%] top-24 h-[560px] w-[18%] bg-accent/90 [clip-path:polygon(40%_0,100%_0,60%_100%,0_100%)]"
      />
      <motion.div
        variants={lineDraw}
        style={{ rotate: -4, originX: 0 }}
        className="absolute -left-[5%] bottom-10 h-1.5 w-[60%] bg-ice"
      />
    </div>
  )
}
