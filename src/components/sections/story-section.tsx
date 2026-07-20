'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import { useContent } from '@/hooks/use-content'
import { aboutContent, storyContent as defaults } from '@/lib/site-content'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = (y = 14) => ({
  hidden: { opacity: 0, y },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
})

export function StorySection() {
  const { data } = useContent('home', { story: defaults })
  const story = data.story ?? defaults

  return (
    <section className="border-y border-border/50 bg-[oklch(0.985_0.006_85)] dark:bg-[oklch(0.225_0.028_305)]">
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 sm:py-28 lg:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
          className="flex flex-col items-center"
        >
          <motion.span
            variants={fadeUp(10)}
            className="inline-flex items-center rounded-full bg-secondary px-3.5 py-1.5 text-xs font-medium tracking-wide text-secondary-foreground shadow-[var(--shadow-xs)] ring-1 ring-border/50"
          >
            {story.eyebrow}
          </motion.span>

          <motion.h2
            variants={fadeUp(16)}
            className="mt-5 max-w-2xl font-display text-balance text-[2rem] leading-[1.08] tracking-[-0.01em] text-foreground sm:text-[2.6rem]"
          >
            {story.title}
          </motion.h2>

          <motion.div variants={fadeUp(12)} className="mt-6 max-w-2xl space-y-5">
            <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {story.paragraph1}
            </p>
            <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {story.paragraph2}
            </p>
          </motion.div>

          <dl className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {aboutContent.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 22, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group/stat rounded-2xl bg-background p-5 text-center shadow-[var(--shadow-xs)] ring-1 ring-border/60 transition-[box-shadow,border-color] duration-300 hover:shadow-[var(--shadow-md)] hover:ring-primary/30"
              >
                <dt className="font-display text-2xl tracking-[-0.01em] text-foreground transition-colors duration-300 group-hover/stat:text-primary sm:text-[1.85rem]">
                  {stat.value}
                </dt>
                <dd className="mt-1.5 text-xs leading-snug text-muted-foreground sm:text-[13px]">
                  {stat.label}
                </dd>
              </motion.div>
            ))}
          </dl>

          <motion.div variants={fadeUp(8)} className="mt-10">
            <Link
              href="/a-propos"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground"
            >
              <span className="border-b border-foreground/40 pb-0.5 transition-colors duration-300 group-hover:border-foreground">
                En savoir plus sur mon parcours
              </span>
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
