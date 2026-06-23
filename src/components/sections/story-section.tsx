'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { useContent } from '@/hooks/use-content'
import { aboutContent, images, storyContent as defaults } from '@/lib/site-content'

const ease = [0.22, 1, 0.36, 1] as const

export function StorySection() {
  const { data } = useContent('home', { story: defaults })
  const story = data.story ?? defaults
  const reduceMotion = useReducedMotion()

  const main = story.image ?? defaults.image
  const small1 = images.aboutGallery[1]
  const small2 = images.aboutGallery[2]

  return (
    <section className="bg-[oklch(0.913_0.024_80)] dark:bg-[oklch(0.22_0.015_110)]">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Collage photo */}
          <motion.div
            initial={{ opacity: 0, x: reduceMotion ? 0 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease }}
            className="relative mx-auto w-full max-w-md lg:mx-0"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-secondary shadow-[var(--shadow-lg)] ring-1 ring-border/50">
              <Image src={main} alt="Véronique Jan" fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
            </div>
            {/* Petite photo haut-gauche */}
            <div className="absolute -left-5 -top-6 hidden aspect-square w-32 overflow-hidden rounded-2xl bg-secondary shadow-[var(--shadow-md)] ring-4 ring-[oklch(0.913_0.024_80)] dark:ring-[oklch(0.22_0.015_110)] sm:block lg:w-36">
              <Image src={small1} alt="" fill sizes="160px" className="object-cover" />
            </div>
            {/* Petite photo bas-droite */}
            <div className="absolute -bottom-6 -right-5 hidden aspect-square w-32 overflow-hidden rounded-2xl bg-secondary shadow-[var(--shadow-md)] ring-4 ring-[oklch(0.913_0.024_80)] dark:ring-[oklch(0.22_0.015_110)] sm:block lg:w-36">
              <Image src={small2} alt="" fill sizes="160px" className="object-cover" />
            </div>
          </motion.div>

          {/* Texte */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          >
            <motion.span
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
              className="inline-flex items-center rounded-full bg-card px-3.5 py-1.5 text-xs font-medium tracking-wide text-foreground/70 shadow-[var(--shadow-xs)] ring-1 ring-border/70"
            >
              {story.eyebrow}
            </motion.span>

            <motion.h2
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
              className="mt-5 font-display text-balance text-[2rem] leading-[1.08] tracking-[-0.01em] text-foreground sm:text-[2.6rem]"
            >
              {story.title}
            </motion.h2>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
              className="mt-6 space-y-5"
            >
              <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">{story.paragraph1}</p>
              <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">{story.paragraph2}</p>
            </motion.div>

            <motion.dl
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } } }}
              className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border/70 pt-8 sm:grid-cols-4"
            >
              {aboutContent.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-2xl tracking-[-0.01em] text-foreground sm:text-[1.75rem]">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </motion.dl>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
              className="mt-8"
            >
              <Link href="/a-propos" className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <span className="border-b border-foreground/40 pb-0.5 transition-colors duration-300 group-hover:border-foreground">
                  En savoir plus sur mon parcours
                </span>
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
