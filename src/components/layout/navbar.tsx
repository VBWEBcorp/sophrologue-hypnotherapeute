'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, ChevronDown, MapPin, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { cn } from '@/lib/utils'

interface NavChild {
  to: string
  label: string
}

interface NavLink {
  to: string
  label: string
  children?: NavChild[]
}

// Sous-menu "Mes cabinets" (comme sur le site d'origine)
const CABINETS_CHILDREN: NavChild[] = [
  { to: '/cabinets/rennes', label: 'Rennes' },
  { to: '/cabinets/acigne', label: 'Acigné' },
]

const defaultLinks: NavLink[] = [
  { to: '/', label: 'Accueil' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/hypnotherapie', label: 'Hypnothérapie' },
  { to: '/seances-hypnose', label: "Séances d'hypnose" },
  { to: '/sophrologie', label: 'Sophrologie' },
  { to: '/cabinets', label: 'Mes cabinets', children: CABINETS_CHILDREN },
  { to: '/blog', label: 'Nos actualités' },
]

/**
 * Un lien est actif si la route courante correspond exactement, OU est une
 * sous-page (ex : /cabinets/rennes active "Mes cabinets", /blog/mon-article
 * active "Nos actualités"). L'accueil reste en correspondance stricte.
 */
function isLinkActive(pathname: string, to: string, children?: NavChild[]): boolean {
  if (to === '/') return pathname === '/'
  if (pathname === to || pathname.startsWith(`${to}/`)) return true
  return Boolean(children?.some((c) => pathname === c.to || pathname.startsWith(`${c.to}/`)))
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [links, setLinks] = useState<NavLink[]>(defaultLinks)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const checkFeatures = async () => {
      try {
        const [galleryRes, blogRes] = await Promise.all([
          fetch('/api/gallery/settings'),
          fetch('/api/blog/settings'),
        ])
        const gallery = await galleryRes.json()
        const blog = await blogRes.json()

        const dynamicLinks: NavLink[] = [
          { to: '/', label: 'Accueil' },
          { to: '/a-propos', label: 'À propos' },
          { to: '/hypnotherapie', label: 'Hypnothérapie' },
          { to: '/seances-hypnose', label: "Séances d'hypnose" },
          { to: '/sophrologie', label: 'Sophrologie' },
          { to: '/cabinets', label: 'Mes cabinets', children: CABINETS_CHILDREN },
        ]

        // "Nos actualités" = blog (masqué si désactivé dans le CMS)
        if (blog?.enabled !== false) dynamicLinks.push({ to: '/blog', label: 'Nos actualités' })
        // Galerie : ajoutée seulement si activée (absente de la nav d'origine)
        if (gallery?.enabled === true) dynamicLinks.push({ to: '/gallery', label: 'Galerie' })

        setLinks(dynamicLinks)
      } catch {
        // Liens par défaut conservés en cas d'erreur
      }
    }

    checkFeatures()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        {/* Wrapper avec bordure dégradée premium */}
        <div
          className={cn(
            'relative rounded-2xl transition-all duration-500',
            scrolled
              ? 'shadow-[0_20px_50px_-20px_oklch(0.2_0.02_303/0.25),0_0_0_1px_oklch(0.42_0.10_303/0.08)]'
              : 'shadow-[0_8px_24px_-12px_oklch(0.2_0.02_303/0.12)]'
          )}
        >
          {/* Halo gradient subtil derrière la navbar quand on scroll */}
          <div
            className={cn(
              'pointer-events-none absolute -inset-x-8 -inset-y-4 -z-10 rounded-[2rem] bg-gradient-to-r from-primary/0 via-primary/[0.07] to-primary/0 blur-2xl transition-opacity duration-700',
              scrolled ? 'opacity-100' : 'opacity-0'
            )}
            aria-hidden
          />

          {/* Bordure dégradée via mask */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl p-px"
            aria-hidden
            style={{
              background:
                'linear-gradient(135deg, oklch(0.42 0.10 303 / 0.35) 0%, oklch(0.93 0.025 305 / 0.4) 35%, oklch(0.93 0.025 305 / 0.4) 65%, oklch(0.42 0.10 303 / 0.35) 100%)',
              WebkitMask:
                'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />

          <div className="flex h-14 items-center justify-between gap-2 rounded-2xl bg-background/95 pl-3 pr-1.5 backdrop-blur-xl supports-[backdrop-filter]:bg-background/85 sm:pl-4">
            <Logo />

            <nav
              className="hidden items-center gap-0.5 xl:flex"
              aria-label="Navigation principale"
              onMouseLeave={() => setHoveredKey(null)}
            >
              {links.map((l) => {
                const isActive = isLinkActive(pathname, l.to, l.children)
                const isHovered = hoveredKey === l.to
                const hasChildren = Boolean(l.children?.length)
                return (
                  <div
                    key={l.to}
                    className="group/nav relative"
                    onMouseEnter={() => setHoveredKey(l.to)}
                  >
                    <Link
                      href={l.to}
                      className={cn(
                        'group relative flex items-center gap-1 whitespace-nowrap rounded-xl px-2.5 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60',
                        isActive
                          ? 'text-foreground'
                          : 'text-foreground/70 hover:text-foreground'
                      )}
                    >
                      {/* Hover background qui suit la souris */}
                      {isHovered && !isActive && (
                        <motion.span
                          layoutId="nav-hover-pill"
                          className="absolute inset-0 rounded-xl bg-foreground/[0.07] ring-1 ring-foreground/[0.04]"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          aria-hidden
                        />
                      )}

                      <span className={cn('relative', isActive && 'font-semibold')}>
                        {l.label}
                      </span>

                      {hasChildren && (
                        <ChevronDown
                          className="relative size-3 transition-transform duration-300 group-hover/nav:rotate-180 group-focus-within/nav:rotate-180"
                          aria-hidden
                        />
                      )}

                      {/* Underline fin animé sous le lien actif (style Linear/Vercel) */}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-underline"
                          className="absolute inset-x-3 bottom-0.5 h-[2px] rounded-full bg-primary"
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                          aria-hidden
                        />
                      )}
                    </Link>

                    {/* Sous-menu déroulant */}
                    {hasChildren && (
                      <div className="invisible absolute left-1/2 top-full z-50 w-44 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100">
                        <div className="relative overflow-hidden rounded-xl bg-background/95 p-1.5 shadow-[0_20px_50px_-20px_oklch(0.2_0.02_303/0.3)] ring-1 ring-border/60 backdrop-blur-xl">
                          {l.children!.map((c) => (
                            <Link
                              key={c.to}
                              href={c.to}
                              className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
                            >
                              <MapPin className="size-3.5 text-primary/70" aria-hidden />
                              {c.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-1.5">
              <ThemeToggle />

              {/* CTA premium : pilule arrondie + icône agenda + shimmer */}
              <Link
                href="/contact"
                className="group/cta relative hidden h-9 items-center gap-2 overflow-hidden rounded-full px-4 text-[13px] font-semibold text-primary-foreground shadow-[0_6px_18px_-5px_oklch(0.34_0.10_303/0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_-6px_oklch(0.34_0.10_303/0.7)] active:translate-y-0 sm:inline-flex"
              >
                {/* Fond gradient */}
                <span
                  className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[oklch(0.30_0.07_303)] dark:to-[oklch(0.40_0.09_303)]"
                  aria-hidden
                />
                {/* Shimmer animé au hover */}
                <span
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover/cta:translate-x-full"
                  aria-hidden
                />
                <CalendarDays
                  className="relative size-4 transition-transform duration-300 group-hover/cta:scale-110"
                  aria-hidden
                />
                <span className="relative">Prendre un RDV</span>
              </Link>

              {/* Burger mobile */}
              <button
                type="button"
                className="relative inline-flex size-8 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 xl:hidden"
                aria-expanded={open}
                aria-controls="mobile-nav"
                aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
                onClick={() => setOpen((v) => !v)}
              >
                <AnimatePresence initial={false} mode="wait">
                  {open ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <X className="size-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="open"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Menu className="size-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu avec stagger animation */}
        <AnimatePresence>
          {open ? (
            <motion.div
              id="mobile-nav"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-2 overflow-hidden rounded-2xl bg-background/95 shadow-[0_30px_60px_-20px_oklch(0.2_0.02_303/0.25)] backdrop-blur-xl xl:hidden"
            >
              {/* Bordure dégradée mobile */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl p-px"
                aria-hidden
                style={{
                  background:
                    'linear-gradient(135deg, oklch(0.42 0.10 303 / 0.3) 0%, oklch(0.93 0.025 305 / 0.4) 50%, oklch(0.42 0.10 303 / 0.3) 100%)',
                  WebkitMask:
                    'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />

              <div className="relative flex flex-col gap-1 p-3">
                {links.map((l, i) => {
                  const isActive = isLinkActive(pathname, l.to, l.children)
                  return (
                    <motion.div
                      key={l.to}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.22,
                        delay: 0.04 + i * 0.035,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={l.to}
                        className={cn(
                          'flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-foreground ring-1 ring-primary/20'
                            : 'text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground'
                        )}
                        onClick={() => setOpen(false)}
                      >
                        <span>{l.label}</span>
                        {isActive && (
                          <span
                            className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_oklch(0.42_0.10_303/0.7)]"
                            aria-hidden
                          />
                        )}
                      </Link>

                      {/* Sous-items (Mes cabinets → Rennes / Acigné) */}
                      {l.children?.length ? (
                        <div className="mt-1 ml-3 flex flex-col gap-0.5 border-l border-border/60 pl-3">
                          {l.children.map((c) => {
                            const childActive = pathname === c.to || pathname.startsWith(`${c.to}/`)
                            return (
                              <Link
                                key={c.to}
                                href={c.to}
                                onClick={() => setOpen(false)}
                                className={cn(
                                  'flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors hover:bg-foreground/[0.06] hover:text-foreground',
                                  childActive ? 'text-foreground' : 'text-muted-foreground'
                                )}
                              >
                                <MapPin className="size-3.5 text-primary/70" aria-hidden />
                                {c.label}
                              </Link>
                            )
                          })}
                        </div>
                      ) : null}
                    </motion.div>
                  )
                })}

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.24,
                    delay: 0.04 + links.length * 0.035,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mt-2 border-t border-border/60 pt-3"
                >
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="group/cta relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-full text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_-8px_oklch(0.34_0.10_303/0.5)]"
                  >
                    <span
                      className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[oklch(0.30_0.07_303)] dark:to-[oklch(0.40_0.09_303)]"
                      aria-hidden
                    />
                    <span
                      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      aria-hidden
                    />
                    <CalendarDays className="relative size-4" aria-hidden />
                    <span className="relative">Prendre un RDV</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  )
}
