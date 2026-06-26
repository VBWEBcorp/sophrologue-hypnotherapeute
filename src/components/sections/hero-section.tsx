'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { useContent } from '@/hooks/use-content'
import { siteConfig } from '@/lib/seo'
import { heroContent as defaults } from '@/lib/site-content'

const ease = [0.22, 1, 0.36, 1] as const

// Image de fond plein écran du hero (ambiance apaisante) — Unsplash
const HERO_BG =
  'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=2000&q=80'

// Petites photos pour la preuve sociale (cluster d'avatars) — Unsplash
const SOCIAL_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
]

function splitTitle(title: string): { lead: string; accent: string } {
  const words = title.trim().split(/\s+/)
  if (words.length <= 1) return { lead: '', accent: title }
  const accentCount = Math.min(2, Math.max(1, Math.floor(words.length / 3)))
  return {
    lead: words.slice(0, words.length - accentCount).join(' '),
    accent: words.slice(words.length - accentCount).join(' '),
  }
}

export function HeroSection() {
  const { data } = useContent('home', { hero: defaults })
  const hero = data.hero ?? defaults
  const { lead, accent } = splitTitle(hero.title)
  const telHref = `tel:${siteConfig.phone.replace(/\s+/g, '')}`

  return (
    <section className="px-3 pt-20 sm:px-4 sm:pt-24">
      {/* Carte hero arrondie, plein cadre (inspiration : hero encadré) */}
      <div className="relative isolate overflow-hidden rounded-[1.75rem] sm:rounded-[2.25rem]">
        {/* Image de fond */}
        <div className="absolute inset-0 -z-20" aria-hidden>
          <Image src={HERO_BG} alt="" fill sizes="100vw" priority className="object-cover" />
        </div>
        {/* Voile sombre + dégradé pour la lisibilité */}
        <div
          className="absolute inset-0 -z-10"
          aria-hidden
          style={{
            background:
              'linear-gradient(100deg, oklch(0.18 0.02 305 / 0.88) 0%, oklch(0.18 0.02 305 / 0.62) 48%, oklch(0.18 0.02 305 / 0.30) 100%)',
          }}
        />

        <div className="relative mx-auto flex min-h-[clamp(34rem,80vh,46rem)] max-w-7xl flex-col justify-between px-5 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          {/* Bloc texte principal */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
            className="max-w-2xl"
          >
            <motion.span
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
              className="inline-flex items-center rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-white/90 ring-1 ring-white/20 backdrop-blur-sm"
            >
              {hero.eyebrow}
            </motion.span>

            <motion.h1
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease } } }}
              className="mt-6 font-display text-balance text-[2.75rem] font-bold leading-[1.02] tracking-[-0.025em] text-white sm:text-6xl lg:text-[4.25rem]"
            >
              {lead ? (
                <>
                  {lead}{' '}
                  <span className="font-serif italic font-normal text-[oklch(0.85_0.07_305)]">{accent}</span>
                </>
              ) : (
                accent
              )}
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
              className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg"
            >
              {hero.description}
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } } }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              {/* CTA principal : appeler (pilule colorée, façon référence) */}
              <a
                href={telHref}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-[0.95rem] font-medium text-primary-foreground shadow-[var(--shadow-md)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Phone className="size-4" aria-hidden />
                Appeler&nbsp;: {siteConfig.phone}
              </a>
              {/* CTA secondaire : contour clair */}
              <Link
                href="/services"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/35 bg-white/5 px-7 text-[0.95rem] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/15"
              >
                {hero.button2}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </motion.div>
          </motion.div>

          {/* Preuve sociale, ancrée en bas (façon référence) */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.35 }}
            className="mt-12 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {SOCIAL_AVATARS.map((src, i) => (
                <span
                  key={src}
                  className="relative inline-block size-11 overflow-hidden rounded-full ring-2 ring-white/80"
                  style={{ zIndex: SOCIAL_AVATARS.length - i }}
                >
                  <Image src={src} alt="" fill sizes="44px" className="object-cover" />
                </span>
              ))}
            </div>
            <div className="text-sm leading-tight text-white/85">
              <p className="font-semibold text-white">Plus de 1 200 accompagnements</p>
              <p className="text-white/70">depuis 2006 à Acigné &amp; Rennes</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
