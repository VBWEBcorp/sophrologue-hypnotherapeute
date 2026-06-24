import { ArrowUpRight, Facebook, Linkedin, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { siteConfig } from '@/lib/seo'
import { NewsletterSignup } from '@/components/newsletter-signup'

const socialLinks = [
  { label: 'Facebook', href: siteConfig.social.facebook, Icon: Facebook },
  { label: 'LinkedIn', href: siteConfig.social.linkedin, Icon: Linkedin },
  { label: 'Avis Google', href: siteConfig.social.google, Icon: Star },
]

const navLinks = [
  { label: 'À propos', to: '/a-propos' },
  { label: 'Hypnothérapie', to: '/hypnotherapie' },
  { label: "Séances d'hypnose", to: '/seances-hypnose' },
  { label: 'Sophrologie', to: '/sophrologie' },
  { label: 'Mes cabinets', to: '/cabinets' },
  { label: 'Actualités', to: '/blog' },
  { label: 'Prendre rendez-vous', to: '/contact' },
]

const legalLinks = [
  { label: 'Mentions légales', to: '/mentions-legales' },
  { label: 'Confidentialité', to: '/politique-de-confidentialite' },
  { label: 'CGU', to: '/conditions-generales' },
  { label: 'Cookies', to: '/politique-cookies' },
]

export function Footer() {
  return (
    <footer className="bg-[oklch(0.25_0.055_305)] text-stone-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Top: brand + nav columns */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-16">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" aria-label={siteConfig.name} className="inline-flex items-center gap-2.5">
              <span className="relative inline-flex size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/25">
                <Image
                  src="/photos/veronique-jan.png"
                  alt={siteConfig.name}
                  fill
                  sizes="40px"
                  className="object-cover object-center"
                />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg font-semibold tracking-tight text-white">
                  {siteConfig.name}
                </span>
                <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-400">
                  Sophrologue · Hypnothérapeute
                </span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
              {siteConfig.description}
            </p>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-2.5 pt-1">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 text-zinc-200 ring-1 ring-white/15 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="pt-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Newsletter
              </h3>
              <p className="mt-2 max-w-sm text-sm text-zinc-400">
                Recevez nos actualités et conseils directement dans votre boîte mail.
              </p>
              <NewsletterSignup source="footer" className="mt-3 max-w-sm" />
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Navigation">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Navigation
            </h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.to}
                    className="group inline-flex items-center gap-1 text-sm text-zinc-300 transition-colors hover:text-white"
                  >
                    <span className="relative">
                      {l.label}
                      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Légal">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Légal
            </h3>
            <ul className="mt-5 space-y-3">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.to}
                    className="group inline-flex items-center gap-1 text-sm text-zinc-300 transition-colors hover:text-white"
                  >
                    <span className="relative">
                      {l.label}
                      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-white transition-transform duration-300 group-hover:scale-x-100" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Contact
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="group inline-flex items-center gap-1 text-zinc-300 transition-colors hover:text-white"
                >
                  {siteConfig.email}
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="text-zinc-300 transition-colors hover:text-white"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li className="text-zinc-500">
                {siteConfig.address.street}
                <br />
                {siteConfig.address.postalCode} {siteConfig.address.city}
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-3 py-6 sm:flex-row sm:items-center">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p className="text-xs text-zinc-500">
            Tous droits réservés
          </p>
        </div>
      </div>

      {/* Bandeau de protection — mention anti-reproduction */}
      <div className="bg-red-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wide">
            Maquette de démonstration, propriété exclusive de{' '}
            <a
              href={siteConfig.url}
              className="underline underline-offset-2 transition-opacity hover:opacity-80"
            >
              {siteConfig.url.replace(/^https?:\/\/(www\.)?/, '').toUpperCase()}
            </a>
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/90">
            Ce site est une présentation à but de démonstration uniquement. Toute reproduction,
            exploitation ou utilisation à des fins professionnelles ou commerciales est strictement
            interdite.
          </p>
        </div>
      </div>
    </footer>
  )
}
