'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronRight, Home } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

import { CtaSection } from '@/components/sections/cta-section'
import { SectionTitle } from '@/components/ui/section-title'
import { useContent } from '@/hooks/use-content'
import { getIcon } from '@/lib/icons'
import { aboutContent } from '@/lib/site-content'

const ease = [0.22, 1, 0.36, 1] as const

const defaults = aboutContent

function splitTitle(title: string): { lead: string; accent: string } {
  const words = title.trim().split(/\s+/)
  if (words.length <= 2) return { lead: '', accent: title }
  const accentCount = Math.min(2, Math.max(1, Math.floor(words.length / 3)))
  return {
    lead: words.slice(0, words.length - accentCount).join(' '),
    accent: words.slice(words.length - accentCount).join(' '),
  }
}

function AboutHero({
  hero,
  stats,
}: {
  hero: typeof defaults.hero
  stats: { value: string; label: string }[]
}) {
  const { lead, accent } = splitTitle(hero.title)

  return (
    <section className="relative isolate overflow-hidden border-b border-border/60 bg-[oklch(0.985_0.006_85)] dark:bg-[oklch(0.225_0.028_305)]">

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="pt-24 sm:pt-28">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <Link
                href="/"
                className="flex items-center gap-1 transition-colors hover:text-foreground"
              >
                <Home className="size-3" aria-hidden />
                <span>Accueil</span>
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="size-3 text-muted-foreground/50" aria-hidden />
              <span aria-current="page" className="font-medium text-foreground">
                À propos
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid items-center gap-12 pt-10 pb-16 sm:pt-14 sm:pb-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pt-20 lg:pb-28">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            {/* Eyebrow en mono */}
            <p className="font-display text-xs font-semibold tracking-[0.22em] uppercase text-primary">
              {hero.eyebrow}
            </p>

            <h1 className="mt-6 font-display text-balance pb-1 text-4xl leading-[1.15] font-semibold tracking-[-0.035em] text-foreground sm:text-5xl lg:text-[56px]">
              {lead ? (
                <>
                  {lead}{' '}
                  <span className="relative inline-block pb-1 font-serif italic font-normal tracking-[-0.01em] text-primary">
                    {accent}
                  </span>
                </>
              ) : (
                accent
              )}
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {hero.description}
            </p>

            {/* Stats — panneau unifié avec séparateurs */}
            <div className="mt-9 grid grid-cols-2 overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm sm:grid-cols-4">
              {stats.map((s, i) => (
                <motion.div
                  key={`${s.label}-${i}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.06, ease }}
                  className="relative border-border/50 px-4 py-4 [&:nth-child(-n+2)]:border-b [&:nth-child(odd)]:border-r sm:border-b-0 sm:border-r sm:last:border-r-0"
                >
                  <div className="font-display text-2xl font-semibold tracking-tight text-foreground whitespace-nowrap">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs leading-snug text-muted-foreground sm:text-[13px]">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image preview card glassy */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="relative"
          >
            {/* Glow violet derrière */}
            <div
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-70 blur-3xl"
              aria-hidden
              style={{
                background:
                  'radial-gradient(ellipse at center, oklch(0.42 0.10 303 / 0.3) 0%, transparent 70%)',
              }}
            />

            <div className="relative overflow-hidden rounded-2xl bg-background/40 p-1.5 shadow-[0_30px_60px_-20px_oklch(0.2_0.02_303/0.3)] backdrop-blur-xl ring-1 ring-border/60">
              {/* Bordure dégradée */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl p-px"
                aria-hidden
                style={{
                  background:
                    'linear-gradient(135deg, oklch(0.42 0.10 303 / 0.4) 0%, oklch(0.93 0.025 305 / 0.5) 50%, oklch(0.42 0.10 303 / 0.4) 100%)',
                  WebkitMask:
                    'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />

              <div className="relative aspect-[4/5] overflow-hidden rounded-xl lg:aspect-[3/4]">
                <Image
                  src={hero.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 500px, 100vw"
                  priority
                  className="object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
            </div>

            {/* Floating badge sur l'image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease }}
              className="absolute -bottom-4 -left-4 hidden rounded-2xl bg-background/90 px-4 py-3 shadow-[0_20px_40px_-12px_oklch(0.2_0.02_303/0.25)] backdrop-blur-xl ring-1 ring-border/60 sm:block lg:-bottom-6 lg:-left-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="size-7 rounded-full ring-2 ring-background"
                      style={{
                        background: `linear-gradient(135deg, oklch(${0.55 + i * 0.05} 0.18 ${100 + i * 10} / 0.8), oklch(${0.65 + i * 0.04} 0.15 ${120 + i * 8} / 0.6))`,
                      }}
                      aria-hidden
                    />
                  ))}
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-foreground">À votre écoute</div>
                  <div className="text-muted-foreground">Acigné & Rennes</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ValuesTimeline({ values }: { values: any[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 70%', 'end 60%'],
  })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div ref={ref} className="relative mx-auto mt-14 max-w-4xl">
      {/* Vertical line (background) */}
      <div
        aria-hidden
        className="absolute left-4 top-0 h-full w-px bg-border md:left-1/2 md:-translate-x-1/2"
      />
      {/* Vertical line (animated fill) */}
      <motion.div
        aria-hidden
        style={{ height: lineHeight }}
        className="absolute left-4 top-0 w-px bg-gradient-to-b from-primary via-primary to-[oklch(0.45_0.10_303)] md:left-1/2 md:-translate-x-1/2"
      />

      <ul className="space-y-12 md:space-y-16">
        {values.map((v: any, i: number) => {
          const Icon = getIcon(v.iconName ?? aboutContent.values[i]?.iconName)
          const isRight = i % 2 === 1
          return (
            <li key={v.title || i} className="relative">
              {/* Dot */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4, ease, delay: 0.15 }}
                className="absolute left-4 top-6 z-10 -translate-x-1/2 md:left-1/2"
              >
                <span className="relative flex size-10 items-center justify-center rounded-full bg-background ring-1 ring-primary/30 shadow-[0_0_20px_oklch(0.42_0.10_303/0.4)] dark:shadow-[0_0_20px_oklch(0.42_0.10_303/0.5)]">
                  {/* Overlay gradient sur fond opaque */}
                  <span
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/15 to-primary/5"
                    aria-hidden
                  />
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                  <Icon className="relative size-4 text-primary" aria-hidden />
                </span>
              </motion.div>

              {/* Card */}
              <motion.div
                initial={{ opacity: 0, x: isRight ? 20 : -20, y: 10 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, ease, delay: 0.1 }}
                className={`ml-14 md:ml-0 md:w-[calc(50%-2.5rem)] ${
                  isRight ? 'md:ml-[calc(50%+2.5rem)]' : 'md:mr-[calc(50%+2.5rem)]'
                }`}
              >
                <div className="group relative overflow-hidden rounded-2xl bg-card/80 p-6 shadow-[0_8px_24px_-12px_oklch(0.2_0.02_303/0.15)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_oklch(0.2_0.02_303/0.25)]">
                  {/* Bordure dégradée premium */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl p-px transition-opacity duration-500 group-hover:opacity-100"
                    aria-hidden
                    style={{
                      background:
                        'linear-gradient(135deg, oklch(0.42 0.10 303 / 0.35) 0%, oklch(0.93 0.025 305 / 0.6) 50%, oklch(0.42 0.10 303 / 0.35) 100%)',
                      WebkitMask:
                        'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    }}
                  />
                  {/* Soft gradient wash on hover */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-primary/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-[11px] font-bold tracking-[0.2em] text-primary">
                        0{i + 1}
                      </span>
                      <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                    </div>
                    <h3 className="mt-3 font-display text-xl leading-tight tracking-[-0.01em] text-foreground">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                      {v.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/**
 * Bandeau de 4 visuels, alimenté par le champ « Galerie photos » de
 * /admin/pages/a-propos. Sans photo renseignée, la section ne s'affiche pas.
 */
function AboutGallery({ gallery }: { gallery: string[] }) {
  const items = gallery.filter(Boolean)
  if (items.length === 0) return null

  return (
    <section className="border-b border-border/60 bg-[oklch(0.985_0.006_85)] dark:bg-[oklch(0.225_0.028_305)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {items.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease, delay: (i % 4) * 0.06 }}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-border/70"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 1024px) 280px, 45vw"
                loading="lazy"
                className="object-cover transition-transform duration-500 hover:scale-[1.04]"
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/gallery"
            className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline"
          >
            Voir toutes les photos
          </Link>
        </div>
      </div>
    </section>
  )
}

export function AboutContent() {
  const { data } = useContent('about', defaults)
  const hero = data.hero ?? defaults.hero
  const stats = data.stats ?? defaults.stats
  const values = data.values ?? defaults.values
  const gallery = data.gallery ?? defaults.gallery

  return (
    <>
      <AboutHero hero={hero} stats={stats} />

      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <SectionTitle eyebrow="Ma pratique" title="Ce qui guide mon accompagnement" />
          <ValuesTimeline values={values} />
        </div>
      </section>

      <AboutGallery gallery={gallery} />

      <CtaSection />
    </>
  )
}
