import { ArrowRight, Home, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { nature } from '@/lib/photos'
import { siteConfig } from '@/lib/seo'

// Fond nature apaisante (brume sur le lac) — même univers que le reste du site.
const BG = nature.brumeSurLac

const quickLinks = [
  { label: 'Hypnothérapie', href: '/hypnotherapie' },
  { label: 'Sophrologie', href: '/sophrologie' },
  { label: 'Mes cabinets', href: '/cabinets' },
]

export default function NotFound() {
  const telHref = `tel:${siteConfig.phoneE164}`

  return (
    <section className="relative isolate flex min-h-[85vh] items-center overflow-hidden px-4 py-24 sm:px-6">
      {/* Fond nature + voile sombre pour la lisibilité */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <Image src={BG} alt="" fill sizes="100vw" priority className="object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(120deg, oklch(0.18 0.02 305 / 0.90) 0%, oklch(0.18 0.02 305 / 0.66) 55%, oklch(0.18 0.02 305 / 0.42) 100%)',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-2xl text-center">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
          Erreur 404
        </p>

        <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl">
          Cette page s&apos;est{' '}
          <span className="font-serif italic font-normal text-[oklch(0.85_0.07_305)]">
            évaporée
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/75">
          Prenez une inspiration… La page que vous cherchez a changé d&apos;adresse
          ou n&apos;existe plus. Laissez-vous guider vers un endroit qui vous fera
          du bien.
        </p>

        {/* Actions principales */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-[0.95rem] font-medium text-primary-foreground shadow-[var(--shadow-md)] transition-transform hover:-translate-y-0.5"
          >
            <Home className="size-4" aria-hidden />
            Retour à l&apos;accueil
          </Link>
          <a
            href={telHref}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/35 bg-white/5 px-7 text-[0.95rem] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            <Phone className="size-4" aria-hidden />
            Prendre rendez-vous
          </a>
        </div>

        {/* Liens rapides */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group inline-flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-white"
            >
              {link.label}
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
