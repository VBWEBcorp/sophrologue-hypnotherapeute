'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { useContent } from '@/hooks/use-content'
import { heroContent as defaults } from '@/lib/site-content'

const ease = [0.22, 1, 0.36, 1] as const

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
  const image = (hero.images ?? defaults.images)[0]
  const { lead, accent } = splitTitle(hero.title)

  return (
    <section className="relative isolate overflow-hidden">
      {/* Image de fond plein écran */}
      <div className="absolute inset-0 -z-20" aria-hidden>
        <Image src={image} alt="" fill sizes="100vw" priority className="object-cover" />
      </div>
      {/* Voile noir opaque + dégradé pour la lisibilité */}
      <div
        className="absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            'linear-gradient(180deg, oklch(0.18 0.01 110 / 0.78) 0%, oklch(0.18 0.01 110 / 0.66) 55%, oklch(0.16 0.01 110 / 0.82) 100%)',
        }}
      />
      <div className="absolute inset-0 -z-10 bg-black/30" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 sm:py-40 lg:px-8 lg:py-48">
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
            className="mt-6 font-display text-balance text-[2.75rem] leading-[1.05] tracking-[-0.02em] text-white sm:text-6xl lg:text-[4.25rem]"
          >
            {lead ? (
              <>
                {lead}{' '}
                <span className="font-serif italic font-normal text-[oklch(0.82_0.07_305)]">{accent}</span>
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
            {/* Bouton crème (contraste sur fond sombre) */}
            <Link
              href="/contact"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-card px-7 text-[0.95rem] font-medium text-foreground shadow-[var(--shadow-md)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {hero.button1}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
            </Link>
            {/* Bouton contour blanc */}
            <Link
              href="/services"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/5 px-7 text-[0.95rem] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              {hero.button2}
            </Link>
          </motion.div>

          {/* Réassurance */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70"
          >
            <span>Hypnose ericksonienne &amp; sophrologie caycédienne</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/40 sm:inline" aria-hidden />
            <span>Acigné · Rennes · domicile</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
