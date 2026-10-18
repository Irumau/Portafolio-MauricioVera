// Configuraciones "variants" de Framer Motion.
// Convención: los estados se llaman initial / animate / exit, así los hijos
// heredan el estado del contenedor (PageTransition) sin repetir props.

const easeSharp = [0.7, 0, 0.2, 1] // arranque lento, frenada seca: barridos y cortinas
const easeOut = [0.2, 0.8, 0.2, 1] // entradas suaves

// Contenedor que escalona la entrada de sus hijos
export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  initial: {},
  animate: { transition: { staggerChildren, delayChildren } },
  exit: {},
})

// Cortina diagonal que barre la pantalla al cambiar de página.
// Al entrar: arranca tapando todo y sale por la derecha.
// Al salir: entra desde la izquierda y vuelve a tapar.
export const wipe = {
  initial: { x: '0%' },
  animate: { x: '120%', transition: { duration: 0.55, ease: easeSharp } },
  exit: { x: ['-120%', '0%'], transition: { duration: 0.4, ease: easeSharp } },
}

// Bandas de fondo que se deslizan desde la derecha
export const bandIn = {
  initial: { opacity: 0, x: '45%' },
  animate: { opacity: 1, x: '0%', transition: { duration: 0.7, ease: easeOut } },
}

// Línea que se dibuja de izquierda a derecha
export const lineDraw = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1, transition: { duration: 0.6, delay: 0.5, ease: easeSharp } },
}

// Etiqueta que se abre como persiana
export const tagOpen = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1, transition: { duration: 0.45, ease: easeSharp } },
}

// Texto que se revela con un barrido
export const wipeText = {
  initial: { clipPath: 'inset(0 100% 0 0)', x: -40 },
  animate: { clipPath: 'inset(0 0% 0 0)', x: 0, transition: { duration: 0.6, ease: easeSharp } },
}

// Subida corta
export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// Ítems del menú diagonal
export const slideFromRight = {
  initial: { opacity: 0, x: 90 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.45, ease: easeOut } },
}

// Títulos de sección
export const slideFromLeft = {
  initial: { opacity: 0, x: -80 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.55, ease: easeOut } },
}

// Tarjetas de proyecto: aparecen al entrar en pantalla (usar con whileInView).
// "custom" recibe el índice para escalonarlas.
export const cardReveal = {
  hidden: { opacity: 0, y: 70, skewY: 2.5 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: { duration: 0.6, ease: easeOut, delay: (index % 3) * 0.08 },
  }),
}
