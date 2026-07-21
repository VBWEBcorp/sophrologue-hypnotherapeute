'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { useContent } from '@/hooks/use-content'
import { ctaContent, images } from '@/lib/site-content'

const ease = [0.22, 1, 0.36, 1] as const

const defaults = {
  eyebrow: ctaContent.eyebrow,
  title: ctaContent.title,
  description: ctaContent.description,
  button: ctaContent.button,
}

const CARD_BG = 'oklch(0.26 0.055 305)'

/** Une colonne de photos qui défile verticalement (en boucle continue). */
function MarqueeColumn({
  images: imgs,
  direction,
}: {
  images: readonly string[]
  direction: 'up' | 'down'
}) {
  const anim = direction === 'up' ? 'animate-marquee-up' : 'animate-marquee-down'
  return (
    <div className="relative min-w-0 flex-1 overflow-hidden">
      {/* La liste est dupliquée pour un défilement sans couture (translate -50%). */}
      <div className={`flex flex-col gap-3 ${anim}`}>
        {[...imgs, ...imgs].map((src, i) => (
          <div key={i} className="relative aspect-[4/5] w-full overflow-hidden rounded-xl ring-1 ring-white/10">
            <Image src={src} alt="" fill sizes="220px" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CtaSection() {
  const { data } = useContent('home', { cta: defaults })
  const cta = data.cta ?? defaults

  return (
    <section className="bg-[oklch(0.985_0.006_85)] dark:bg-[oklch(0.225_0.028_305)]">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
          className="relative overflow-hidden rounded-[2rem] bg-[oklch(0.26_0.055_305)] shadow-[var(--shadow-lg)]"
        >
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_1fr]">
            {/* Texte */}
            <div className="relative z-10 flex flex-col justify-center p-10 sm:p-14 lg:py-16">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-[oklch(0.78_0.09_94)] uppercase">
                {cta.eyebrow}
              </p>
              <h2 className="mt-4 max-w-md font-display text-balance text-3xl leading-[1.1] tracking-[-0.01em] text-[oklch(0.96_0.014_85)] sm:text-[2.6rem]">
                {cta.title}
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[oklch(0.9_0.02_85)] sm:text-base">
                {cta.description}
              </p>
              <div className="mt-8">
                <Link
                  href="/contact"
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-card px-7 text-[0.95rem] font-medium text-foreground shadow-[var(--shadow-md)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {cta.button}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </div>
            </div>

            {/* Colonnes de photos qui défilent verticalement, inclinées en biais */}
            <div className="relative hidden min-h-[420px] self-stretch overflow-hidden lg:block">
              {/* Les deux colonnes, tiltées pour l'effet diagonal */}
              <div
                className="absolute inset-0 flex origin-center gap-3 [transform:rotate(-8deg)_scale(1.35)]"
                aria-hidden
              >
                <MarqueeColumn images={images.ctaScrollColumns.col1} direction="up" />
                <MarqueeColumn images={images.ctaScrollColumns.col2} direction="down" />
              </div>

              {/* Fondu vers la couleur de la carte : gauche (raccord avec le texte) + haut/bas */}
              <div
                className="pointer-events-none absolute inset-0 z-10"
                aria-hidden
                style={{ background: `linear-gradient(to right, ${CARD_BG} 0%, transparent 42%)` }}
              />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20"
                aria-hidden
                style={{ background: `linear-gradient(to bottom, ${CARD_BG} 0%, transparent 100%)` }}
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20"
                aria-hidden
                style={{ background: `linear-gradient(to top, ${CARD_BG} 0%, transparent 100%)` }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
