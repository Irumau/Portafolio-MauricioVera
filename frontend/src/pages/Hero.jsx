import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition.jsx'
import Backdrop from '../components/Backdrop.jsx'
import DiagonalMenu from '../components/DiagonalMenu.jsx'
import SlantButton from '../components/SlantButton.jsx'
import { fadeUp, tagOpen, wipeText } from '../animations/variants.js'
import { profile } from '../services/profile.js'

const menuItems = [
  { to: '/compendium', label: 'Compendium' },
  { to: '/social-links', label: 'Social Links' },
  ...profile.socials.map((social) => ({ href: social.url, label: social.label })),
]

export default function Hero() {
  const [firstLine, ...rest] = profile.name.split(' ')
  const secondLine = rest.join(' ')

  return (
    <PageTransition className="relative overflow-hidden">
      <Backdrop />

      <section className="relative z-10 mx-auto flex max-w-7xl flex-wrap items-center gap-12 px-4 pb-32 pt-10 sm:px-6">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-7">
          <motion.span
            variants={tagOpen}
            style={{ skewX: -12, originX: 0 }}
            className="self-start bg-ice px-3.5 py-1.5 font-mono text-[13px] font-bold uppercase tracking-[0.18em] text-night"
          >
            {profile.role}
          </motion.span>

          <h1
            className="font-display text-[clamp(64px,11vw,168px)] font-black uppercase leading-[0.86] -skew-x-[8deg] origin-left"
          >
            <motion.span variants={wipeText} className="block text-ice">
              {firstLine}
            </motion.span>
            {secondLine && (
              <motion.span variants={wipeText} className="block text-accent">
                {secondLine}
              </motion.span>
            )}
          </h1>

          <motion.p variants={fadeUp} className="max-w-[34ch] text-xl leading-relaxed text-mist">
            {profile.tagline}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3.5">
            <SlantButton to="/compendium">Ver proyectos</SlantButton>
            <SlantButton to="/social-links" variant="ice">
              Contactame
            </SlantButton>
          </motion.div>
        </div>

        <div className="flex min-w-0 flex-[1_1_300px] justify-center lg:justify-end">
          <DiagonalMenu items={menuItems} />
        </div>
      </section>
    </PageTransition>
  )
}
