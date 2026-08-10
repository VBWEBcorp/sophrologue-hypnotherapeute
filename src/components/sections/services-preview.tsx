'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { SectionTitle } from '@/components/ui/section-title'
import { Button } from '@/components/ui/button'
import { useContent } from '@/hooks/use-content'
import { getIcon } from '@/lib/icons'
import { servicesPreviewContent } from '@/lib/site-content'

const ease = [0.22, 1, 0.36, 1] as const

// L'aperçu appartient à la page d'accueil : son contenu vit dans le document
// « home », comme les autres sections de cette page. La page Séances garde sa
// propre liste, plus détaillée.
const defaults = { servicesPreview: servicesPreviewContent }

export function ServicesPreview() {
  const { data } = useContent('home', defaults)
  const preview = data.servicesPreview ?? servicesPreviewContent

  const services = (preview.items ?? servicesPreviewContent.items).slice(0, 4)
  const reduceMotion = useReducedMotion()

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionTitle
          eyebrow={preview.eyebrow ?? servicesPreviewContent.eyebrow}
          title={preview.title ?? servicesPreviewContent.title}
          description={preview.description ?? servicesPreviewContent.description}
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
          }}
          className="mt-14 grid gap-5 sm:grid-cols-2"
        >
          {services.map((s: any, i: number) => {
            const Icon = getIcon(s.iconName ?? servicesPreviewContent.items[i]?.iconName)
            return (
              <motion.div
                key={s.title || i}
                variants={{
                  hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
                }}
                className="group flex h-full flex-col rounded-3xl bg-card p-7 ring-1 ring-border/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] sm:p-8"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary ring-1 ring-border/50 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-6 font-display text-xl tracking-[-0.01em] text-foreground">
                  {s.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                  {s.desc || s.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          className="mt-12 flex justify-center"
        >
          <Button variant="outline" className="group" asChild>
            <Link href="/services">
              Découvrir toutes les séances
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
