import { useState } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition.jsx'
import SlantButton from '../components/SlantButton.jsx'
import { fadeUp, slideFromLeft, slideFromRight } from '../animations/variants.js'
import { profile } from '../services/profile.js'

const facts = [
  { label: 'Base', value: profile.location },
  { label: 'Estado', value: profile.availability, highlight: true },
  { label: 'Idiomas', value: profile.languages },
]

export default function SocialLinks() {
  const [copied, setCopied] = useState(false)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <PageTransition className="min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-20 px-4 pb-24 pt-16 sm:px-6">
        {/* Sobre mí */}
        <section aria-labelledby="sobre-mi">
          <div className="flex min-w-0 max-w-4xl flex-col gap-6">
            <motion.h1
              id="sobre-mi"
              variants={slideFromLeft}
              style={{ skewX: -8, originX: 0 }}
              className="font-display text-[clamp(56px,8vw,112px)] font-black uppercase leading-[0.9]"
            >
              Social Links
            </motion.h1>
            <motion.p variants={fadeUp} className="max-w-[60ch] text-lg text-mist">
              {profile.bio}
            </motion.p>
            <motion.dl
              variants={fadeUp}
              className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-0.5 border-2 border-night bg-night"
            >
              {facts.map((fact) => (
                <div key={fact.label} className="bg-panel px-5 py-4">
                  <dt className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-dim">{fact.label}</dt>
                  <dd className={`mt-1 font-bold ${fact.highlight ? 'text-accent' : ''}`}>{fact.value}</dd>
                </div>
              ))}
            </motion.dl>
          </div>
        </section>

        {/* Contacto */}
        <section aria-labelledby="contacto" className="flex flex-col gap-8">
          <motion.h2
            id="contacto"
            variants={slideFromLeft}
            style={{ skewX: -8, originX: 0 }}
            className="font-display text-[clamp(72px,14vw,200px)] font-black uppercase leading-[0.82]"
          >
            Hablemos
          </motion.h2>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3.5">
            <span className="select-all break-all bg-panel px-5 py-3.5 font-mono text-[clamp(16px,2.4vw,24px)] font-bold">
              {profile.email}
            </span>
            <SlantButton onClick={copyEmail} aria-live="polite">
              {copied ? 'Email copiado' : 'Copiar email'}
            </SlantButton>
          </motion.div>

          <ul className="flex flex-col gap-2.5">
            {profile.socials.map((social, index) => (
              <motion.li key={social.label} variants={slideFromRight} style={{ marginLeft: index * 18 }}>
                <motion.a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ x: 10 }}
                  className="slant-right flex max-w-md items-baseline justify-between bg-panel px-5 py-3 font-display text-3xl font-black uppercase text-ice no-underline outline-none transition-colors hover:bg-ice hover:text-night focus-visible:bg-ice focus-visible:text-night"
                >
                  <span>{social.label}</span>
                  <span aria-hidden="true" className="font-mono text-sm">↗</span>
                </motion.a>
              </motion.li>
            ))}
          </ul>
        </section>

        <footer className="flex flex-wrap justify-between gap-3 border-t-2 border-panel pt-5 font-mono text-xs text-dim">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Hecho con React y Node.js</span>
        </footer>
      </div>
    </PageTransition>
  )
}
