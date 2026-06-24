'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight, Home } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

interface PremiumHeroProps {
  eyebrow: string
  title: string
  description?: string
  /** Conservé pour compatibilité. */
  image?: string
  backgroundImage?: string
  breadcrumb: string
  compact?: boolean
  children?: ReactNode
}

function splitTitle(title: string): { lead: string; accent: string } {
  const words = title.trim().split(/\s+/)
  if (words.length <= 1) return { lead: '', accent: title }
  const accentCount = Math.min(2, Math.max(1, Math.floor(words.length / 3)))
  return {
    lead: words.slice(0, words.length - accentCount).join(' '),
    accent: words.slice(words.length - accentCount).join(' '),
  }
}

export function PremiumHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  backgroundImage,
  children,
}: PremiumHeroProps) {
  const { lead, accent } = splitTitle(title)

  // ── Variante image de fond plein écran (grand hero immersif) ──────────────
  if (backgroundImage) {
    return (
      <section className="relative isolate flex min-h-[82vh] flex-col overflow-hidden">
        {/* Image de fond plein écran */}
        <div className="absolute inset-0 -z-20" aria-hidden>
          <Image src={backgroundImage} alt="" fill sizes="100vw" priority className="object-cover" />
        </div>
        {/* Voile dégradé sombre pour la lisibilité */}
        <div
          className="absolute inset-0 -z-10"
          aria-hidden
          style={{
            background:
              'linear-gradient(180deg, oklch(0.18 0.01 110 / 0.82) 0%, oklch(0.18 0.01 110 / 0.62) 55%, oklch(0.16 0.01 110 / 0.88) 100%)',
          }}
        />
        <div className="absolute inset-0 -z-10 bg-black/25" aria-hidden />

        <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Fil d'Ariane" className="flex justify-center pt-28 sm:pt-32">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/70">
              <li className="flex items-center gap-1.5">
                <Link href="/" className="flex items-center gap-1 transition-colors hover:text-white">
                  <Home className="size-3" aria-hidden />
                  <span>Accueil</span>
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="size-3 text-white/40" aria-hidden />
                <span aria-current="page" className="font-medium text-white">
                  {breadcrumb}
                </span>
              </li>
            </ol>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex flex-1 flex-col items-center justify-center py-16 text-center sm:py-20"
          >
            <span className="inline-flex items-center rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-white/90 ring-1 ring-white/20 backdrop-blur-sm">
              {eyebrow}
            </span>

            <h1 className="mt-6 max-w-3xl font-display text-balance text-[2.75rem] leading-[1.05] tracking-[-0.02em] text-white sm:text-6xl lg:text-[4rem]">
              {lead ? (
                <>
                  {lead}{' '}
                  <span className="font-serif italic font-normal text-[oklch(0.82_0.07_305)]">{accent}</span>
                </>
              ) : (
                accent
              )}
            </h1>

            {description && (
              <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
                {description}
              </p>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-card px-7 text-[0.95rem] font-medium text-foreground shadow-[var(--shadow-md)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Prendre un RDV
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>

            {children && <div className="mt-10">{children}</div>}
          </motion.div>
        </div>
      </section>
    )
  }

  // ── Variante claire (repli sans image) ───────────────────────────────────
  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-background">
      {/* Halo doux */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-32 h-80 opacity-70"
        aria-hidden
        style={{
          background:
            'radial-gradient(55% 100% at 50% 0%, oklch(0.97 0.012 85) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="flex justify-center pt-28 sm:pt-32">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <Link href="/" className="flex items-center gap-1 transition-colors hover:text-foreground">
                <Home className="size-3" aria-hidden />
                <span>Accueil</span>
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="size-3 text-muted-foreground/50" aria-hidden />
              <span aria-current="page" className="font-medium text-foreground">
                {breadcrumb}
              </span>
            </li>
          </ol>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col items-center pt-10 pb-16 text-center sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24"
        >
          <span className="inline-flex items-center rounded-full bg-card px-3.5 py-1.5 text-xs font-medium tracking-wide text-foreground/70 shadow-[var(--shadow-xs)] ring-1 ring-border/70">
            {eyebrow}
          </span>

          <h1 className="mt-6 max-w-3xl font-display text-balance text-4xl leading-[1.06] tracking-[-0.02em] text-foreground sm:text-5xl lg:text-[3.5rem]">
            {lead ? (
              <>
                {lead}{' '}
                <span className="font-serif italic font-normal">{accent}</span>
              </>
            ) : (
              accent
            )}
          </h1>

          {description && (
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}

          {children && <div className="mt-10">{children}</div>}
        </motion.div>
      </div>
    </section>
  )
}
