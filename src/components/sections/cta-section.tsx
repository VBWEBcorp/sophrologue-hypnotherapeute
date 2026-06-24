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

const ctaImage = images.ctaScrollColumns.col2[2]

export function CtaSection() {
  const { data } = useContent('home', { cta: defaults })
  const cta = data.cta ?? defaults

  return (
    <section className="bg-background">
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
            <div className="flex flex-col justify-center p-10 sm:p-14 lg:py-16">
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

            {/* Photo */}
            <div className="relative hidden min-h-[340px] self-stretch lg:block">
              <Image
                src={ctaImage}
                alt=""
                fill
                sizes="(min-width:1024px) 40vw, 0px"
                className="object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden
                style={{
                  background:
                    'linear-gradient(to right, oklch(0.26 0.055 305) 0%, transparent 35%)',
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
