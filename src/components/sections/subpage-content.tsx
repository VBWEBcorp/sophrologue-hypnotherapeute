'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Check, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { CtaSection } from '@/components/sections/cta-section'
import { PremiumHero } from '@/components/sections/premium-hero'
import { SectionTitle } from '@/components/ui/section-title'
import { getIcon } from '@/lib/icons'
import { images } from '@/lib/site-content'
import type { Subpage, SubpageSection } from '@/lib/subpages'

const ease = [0.22, 1, 0.36, 1] as const

// Photos d'ambiance fondues en arrière-plan, alternées pour rythmer la page.
const SECTION_AMBIANCES = [
  images.homeGallery[0],
  images.homeGallery[2],
  images.homeGallery[4],
  images.homeGallery[1],
  images.homeGallery[5],
  images.homeGallery[3],
]

function SectionBackdrop({ index, tinted }: { index: number; tinted: boolean }) {
  const ambiance = SECTION_AMBIANCES[index % SECTION_AMBIANCES.length]
  const flip = index % 2 === 1
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Photo d'ambiance fondue dans un angle */}
      <div
        className="absolute -top-24 h-[34rem] w-[34rem] bg-cover bg-center opacity-[0.14] blur-[2px] dark:opacity-[0.07]"
        style={{
          backgroundImage: `url(${ambiance})`,
          left: flip ? '-7rem' : undefined,
          right: flip ? undefined : '-7rem',
          maskImage: 'radial-gradient(circle at center, black 0%, transparent 68%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 68%)',
        }}
      />
      {/* Halo sauge/olive opposé pour la profondeur */}
      <div
        className="absolute bottom-[-5rem] h-80 w-80 rounded-full blur-3xl"
        style={{
          left: flip ? undefined : '-5rem',
          right: flip ? '-5rem' : undefined,
          background: `radial-gradient(circle, oklch(0.45 0.09 303 / ${tinted ? 0.18 : 0.1}) 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}

function SectionShell({
  index,
  tinted,
  children,
}: {
  index: number
  tinted: boolean
  children: React.ReactNode
}) {
  return (
    <section
      className={`relative isolate overflow-hidden ${tinted ? 'bg-[oklch(0.90_0.035_305)] dark:bg-[oklch(0.22_0.03_305)]' : 'bg-background'}`}
    >
      <SectionBackdrop index={index} tinted={tinted} />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">{children}</div>
    </section>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-card px-3.5 py-1.5 text-xs font-medium tracking-wide text-foreground/70 shadow-[var(--shadow-xs)] ring-1 ring-border/70">
      {children}
    </span>
  )
}

function SerifTitle({ title, className = '' }: { title: string; className?: string }) {
  const words = title.trim().split(/\s+/)
  let lead = '', accent = title
  if (words.length > 1) {
    const n = Math.min(2, Math.max(1, Math.floor(words.length / 3)))
    lead = words.slice(0, words.length - n).join(' ')
    accent = words.slice(words.length - n).join(' ')
  }
  return (
    <h2 className={`font-display text-balance leading-[1.1] tracking-[-0.01em] text-foreground ${className}`}>
      {lead ? (
        <>
          {lead} <span className="font-serif italic font-normal">{accent}</span>
        </>
      ) : (
        accent
      )}
    </h2>
  )
}

function ProseBlock({ section }: { section: Extract<SubpageSection, { kind: 'prose' }> }) {
  return (
    <div className="mx-auto max-w-3xl">
      <SectionTitle eyebrow={section.eyebrow} title={section.title} align="center" />
      <div className="mt-8 space-y-5">
        {section.paragraphs.map((p, i) => (
          <motion.p key={i} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5, ease, delay: i * 0.08 }} className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {p}
          </motion.p>
        ))}
      </div>
    </div>
  )
}

function SplitBlock({ section }: { section: Extract<SubpageSection, { kind: 'split' }> }) {
  return (
    <div className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-16 ${section.reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7, ease }} className="relative aspect-[5/6] overflow-hidden rounded-[1.75rem] bg-secondary shadow-[var(--shadow-lg)] ring-1 ring-border/50">
        <Image src={section.image} alt={section.title} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.6, ease, delay: 0.1 }}>
        {section.eyebrow ? <Eyebrow>{section.eyebrow}</Eyebrow> : null}
        <SerifTitle title={section.title} className="mt-5 text-[2rem] sm:text-[2.4rem]" />
        <div className="mt-5 space-y-4">
          {section.paragraphs.map((p, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">{p}</p>
          ))}
        </div>
        {section.bullets?.length ? (
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {section.bullets.map((b, i) => (
              <li key={i} className="inline-flex items-center gap-1.5 rounded-full bg-card px-3.5 py-1.5 text-sm text-foreground/80 ring-1 ring-border/70">
                <Check className="size-3.5 text-primary" aria-hidden /> {b}
              </li>
            ))}
          </ul>
        ) : null}
      </motion.div>
    </div>
  )
}

function FeatureCard({ item }: { item: { iconName: string; title: string; desc: string; href?: string; external?: boolean } }) {
  const Icon = getIcon(item.iconName)
  const inner = (
    <>
      <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary ring-1 ring-border/50 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="mt-6 flex items-center gap-1.5 font-display text-lg tracking-[-0.01em] text-foreground">
        {item.title}
        {item.href ? <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /> : null}
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{item.desc}</p>
    </>
  )
  const cls = 'group flex h-full flex-col rounded-3xl bg-card p-7 ring-1 ring-border/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]'
  const variants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }

  if (item.href) {
    return (
      <motion.a variants={variants} href={item.href} {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={cls}>
        {inner}
      </motion.a>
    )
  }
  return <motion.div variants={variants} className={cls}>{inner}</motion.div>
}

function FeaturesBlock({ section }: { section: Extract<SubpageSection, { kind: 'features' }> }) {
  return (
    <>
      <SectionTitle eyebrow={section.eyebrow} title={section.title} description={section.description} />
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {section.items.map((item, i) => <FeatureCard key={i} item={item} />)}
      </motion.div>
    </>
  )
}

function ChecklistBlock({ section }: { section: Extract<SubpageSection, { kind: 'checklist' }> }) {
  return (
    <>
      <SectionTitle eyebrow={section.eyebrow} title={section.title} description={section.description} />
      <motion.ul initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }} className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2">
        {section.items.map((item, i) => (
          <motion.li key={i} variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease } } }} className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3.5 ring-1 ring-border/60">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"><Check className="size-3.5" aria-hidden /></span>
            <span className="text-sm text-foreground/85">{item}</span>
          </motion.li>
        ))}
      </motion.ul>
    </>
  )
}

function TimelineBlock({ section }: { section: Extract<SubpageSection, { kind: 'timeline' }> }) {
  return (
    <>
      <SectionTitle eyebrow={section.eyebrow} title={section.title} description={section.description} />
      <div className="relative mx-auto mt-14 max-w-2xl">
        <div aria-hidden className="absolute left-[27px] top-2 bottom-2 w-px bg-border" />
        <ul className="space-y-7">
          {section.steps.map((s, i) => {
            const Icon = getIcon(s.iconName)
            return (
              <motion.li key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.5, ease, delay: 0.05 }} className="relative flex gap-5">
                <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-card text-primary ring-1 ring-border/70 shadow-[var(--shadow-xs)]">
                  <Icon className="size-5" aria-hidden />
                  <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{i + 1}</span>
                </span>
                <div className="flex-1 rounded-2xl bg-card px-5 py-4 ring-1 ring-border/60">
                  <h3 className="font-display text-lg text-foreground">{s.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

function HighlightBlock({ section }: { section: Extract<SubpageSection, { kind: 'highlight' }> }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease }} className="overflow-hidden rounded-[2rem] bg-[oklch(0.26_0.055_305)] shadow-[var(--shadow-lg)]">
      <div className={`grid gap-8 ${section.image ? 'lg:grid-cols-[1.2fr_1fr]' : ''}`}>
        <div className="flex flex-col justify-center p-10 sm:p-14">
          {section.eyebrow ? (
            <span className="inline-flex w-fit items-center rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-medium tracking-wide text-[oklch(0.93_0.02_85)]">{section.eyebrow}</span>
          ) : null}
          <h2 className="mt-5 max-w-md font-display text-balance text-[1.8rem] leading-[1.1] text-[oklch(0.96_0.014_85)] sm:text-[2.3rem]">{section.title}</h2>
          <div className="mt-5 space-y-4">
            {section.paragraphs.map((p, i) => (
              <p key={i} className="max-w-md text-[15px] leading-relaxed text-[oklch(0.9_0.02_85)] sm:text-base">{p}</p>
            ))}
          </div>
        </div>
        {section.image ? (
          <div className="relative min-h-[260px] lg:min-h-full">
            <Image src={section.image} alt="" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}

function PricingBlock({ section }: { section: Extract<SubpageSection, { kind: 'pricing' }> }) {
  return (
    <>
      <SectionTitle eyebrow={section.eyebrow} title={section.title} description={section.description} />
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }} className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-3">
        {section.items.map((item, i) => (
          <motion.div key={i} variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }} className="flex flex-col items-center rounded-3xl bg-card p-8 text-center ring-1 ring-border/70">
            <div className="font-display text-4xl tracking-tight text-primary">{item.price}</div>
            <div className="mt-3 font-display text-lg text-foreground">{item.label}</div>
            {item.note ? <p className="mt-1.5 text-sm text-muted-foreground">{item.note}</p> : null}
          </motion.div>
        ))}
      </motion.div>
    </>
  )
}

function CabinetsBlock({ section }: { section: Extract<SubpageSection, { kind: 'cabinets' }> }) {
  return (
    <>
      <SectionTitle eyebrow={section.eyebrow} title={section.title} description={section.description} />
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }} className="mt-14 grid gap-6 lg:grid-cols-2">
        {section.items.map((c, i) => (
          <motion.div key={i} id={c.id} variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } } }} className="flex scroll-mt-28 flex-col rounded-3xl bg-card p-8 ring-1 ring-border/70 sm:p-9">
            <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary ring-1 ring-border/50"><MapPin className="size-5" aria-hidden /></span>
            <h3 className="mt-5 font-display text-2xl tracking-[-0.01em] text-foreground">{c.name}</h3>
            <p className="mt-2 text-base text-muted-foreground">{c.address}</p>
            {c.note ? <p className="mt-2 text-sm text-muted-foreground/85">{c.note}</p> : null}
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
              {c.href ? (
                <Link href={c.href} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5">
                  Voir le cabinet <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              ) : null}
              {c.bookingUrl ? (
                <a href={c.bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-card px-5 text-sm font-medium text-foreground ring-1 ring-border/70 transition-colors hover:bg-secondary">
                  {c.bookingLabel ?? 'Réserver'} <ArrowUpRight className="size-4" aria-hidden />
                </a>
              ) : null}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </>
  )
}

function renderSection(section: SubpageSection) {
  switch (section.kind) {
    case 'prose': return <ProseBlock section={section} />
    case 'split': return <SplitBlock section={section} />
    case 'features': return <FeaturesBlock section={section} />
    case 'checklist': return <ChecklistBlock section={section} />
    case 'timeline': return <TimelineBlock section={section} />
    case 'highlight': return <HighlightBlock section={section} />
    case 'pricing': return <PricingBlock section={section} />
    case 'cabinets': return <CabinetsBlock section={section} />
  }
}

export function SubpageContent({ data }: { data: Subpage }) {
  return (
    <>
      <PremiumHero eyebrow={data.hero.eyebrow} title={data.hero.title} description={data.hero.description} breadcrumb={data.hero.breadcrumb} backgroundImage={data.hero.backgroundImage} compact />
      {data.sections.map((section, i) => (
        <SectionShell key={i} index={i} tinted={i % 2 === 0}>
          {renderSection(section)}
        </SectionShell>
      ))}
      <CtaSection />
    </>
  )
}
