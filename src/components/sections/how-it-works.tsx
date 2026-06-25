'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { SectionTitle } from '@/components/ui/section-title'
import { useContent } from '@/hooks/use-content'
import { getIcon } from '@/lib/icons'
import { howItWorksContent } from '@/lib/site-content'

const ease = [0.22, 1, 0.36, 1] as const

export function HowItWorks() {
  const { data } = useContent('how-it-works', {
    eyebrow: howItWorksContent.eyebrow,
    title: howItWorksContent.title,
    description: howItWorksContent.description,
    steps: howItWorksContent.steps,
  })

  const steps = (data.steps ?? howItWorksContent.steps) as typeof howItWorksContent.steps
  const reduceMotion = useReducedMotion()

  return (
    <section className="bg-[oklch(0.26_0.055_305)]">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionTitle
          eyebrow={data.eyebrow ?? howItWorksContent.eyebrow}
          title={data.title ?? howItWorksContent.title}
          description={data.description ?? howItWorksContent.description}
          tone="dark"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
          }}
          className="relative mt-16 grid gap-6 md:grid-cols-3 md:gap-8"
        >
          {steps.map((step, i) => {
            const Icon = getIcon(step.iconName ?? howItWorksContent.steps[i]?.iconName)
            return (
              <motion.div
                key={step.title || i}
                variants={{
                  hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
                }}
                className="group relative flex flex-col items-center rounded-3xl bg-card px-7 py-10 text-center ring-1 ring-border/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
              >
                {/* Numéro d'étape */}
                <span className="absolute right-5 top-5 font-display text-5xl font-bold leading-none text-secondary/70 transition-colors group-hover:text-primary/25">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Icône */}
                <span className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary ring-1 ring-border/50 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-7" aria-hidden />
                </span>

                <h3 className="mt-7 font-display text-xl tracking-[-0.01em] text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>

                {/* Flèche pointillée vers l'étape suivante (desktop), logée dans l'inter-carte */}
                {i < steps.length - 1 && (
                  <svg
                    aria-hidden
                    viewBox="0 0 32 24"
                    className="pointer-events-none absolute left-full top-1/2 z-10 hidden h-5 w-8 -translate-y-1/2 text-white/70 md:block"
                  >
                    <path
                      d="M1 12 H22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="2 6"
                    />
                    <path
                      d="M22 5 L31 12 L22 19"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
