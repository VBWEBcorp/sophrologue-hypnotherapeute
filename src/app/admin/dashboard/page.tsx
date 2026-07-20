'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Home,
  Users,
  Brain,
  Sparkles,
  Leaf,
  Briefcase,
  MapPin,
  MessageSquare,
  Phone,
  FileText,
  Megaphone,
  Eye,
} from 'lucide-react'

import { siteConfig } from '@/lib/seo'

interface AdminUser {
  email: string
  name?: string
}

// Toutes les pages du site, éditables depuis l'admin (textes + images).
const pageModules = [
  { href: '/admin/pages/accueil', label: 'Accueil', desc: 'Hero, histoire, CTA', icon: Home },
  { href: '/admin/pages/a-propos', label: 'À propos', desc: 'Présentation, parcours', icon: Users },
  { href: '/admin/pages/hypnotherapie', label: 'Hypnothérapie', desc: 'Méthode, indications', icon: Brain },
  { href: '/admin/pages/seances-hypnose', label: "Séances d'hypnose", desc: 'Déroulé d’une séance', icon: Sparkles },
  { href: '/admin/pages/sophrologie', label: 'Sophrologie', desc: 'Méthode, bienfaits, tarifs', icon: Leaf },
  { href: '/admin/pages/services', label: 'Services', desc: 'Accompagnements', icon: Briefcase },
  { href: '/admin/pages/cabinets', label: 'Mes cabinets', desc: 'Rennes & Acigné', icon: MapPin },
  { href: '/admin/pages/cabinet-rennes', label: 'Cabinet de Rennes', desc: 'Centre SPORMED', icon: MapPin },
  { href: '/admin/pages/cabinet-acigne', label: "Cabinet d'Acigné", desc: 'Rue du Calvaire', icon: MapPin },
  { href: '/admin/pages/temoignages', label: 'Témoignages', desc: 'Avis Google', icon: MessageSquare },
  { href: '/admin/pages/contact', label: 'Contact', desc: 'Coordonnées, RDV', icon: Phone },
]

const contentModules = [
  { href: '/admin/blog', label: 'Blog / Actualités', desc: 'Articles et publications', icon: FileText },
  { href: '/admin/marketing', label: 'Marketing', desc: 'Popup et bandeau', icon: Megaphone },
]

const ease = [0.22, 1, 0.36, 1] as const

function ModuleGrid({
  items,
  delay,
}: {
  items: { href: string; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[]
  delay: number
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: delay } } }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((mod) => {
        const Icon = mod.icon
        return (
          <motion.div
            key={mod.href}
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } }}
          >
            <Link
              href={mod.href}
              className="group flex h-full items-center gap-4 rounded-3xl border border-border/70 bg-card p-5 ring-1 ring-transparent transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-md)]"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary ring-1 ring-border/50 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-[22px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[17px] tracking-[-0.01em] text-foreground">{mod.label}</p>
                <p className="mt-0.5 truncate text-[13px] text-muted-foreground">{mod.desc}</p>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default function AdminDashboardPage() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userStr = localStorage.getItem('authUser')
    if (!token || !userStr) {
      router.push('/admin/login')
      return
    }
    try {
      setUser(JSON.parse(userStr))
    } catch {
      router.push('/admin/login')
      return
    } finally {
      setLoading(false)
    }
  }, [router])

  if (loading || !user) return null

  const firstName = user.name?.split(' ')[0] || ''

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* En-tête, dans l'univers du site (serif éditorial + teinte lavande) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="relative overflow-hidden rounded-3xl border border-border/60 bg-[oklch(0.26_0.055_305)] p-7 sm:p-9"
        >
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-primary/25 blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
                Espace d&apos;administration
              </p>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">
                Bonjour{firstName ? ` ${firstName}` : ''},{' '}
                <span className="font-serif italic font-normal text-[oklch(0.85_0.07_305)]">
                  gérez votre contenu
                </span>
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/65">
                Modifiez les textes et les images de chaque page de votre site.
                Vos changements sont enregistrés et visibles en ligne.
              </p>
            </div>
            <Link
              href="/"
              target="_blank"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[oklch(0.26_0.055_305)] transition-transform hover:-translate-y-0.5"
            >
              <Eye className="size-4" />
              Voir le site
            </Link>
          </div>
        </motion.div>

        {/* Pages du site */}
        <section>
          <h2 className="mb-4 font-display text-lg tracking-[-0.01em] text-foreground">
            Pages du site
          </h2>
          <ModuleGrid items={pageModules} delay={0.1} />
        </section>

        {/* Autres contenus */}
        <section>
          <h2 className="mb-4 font-display text-lg tracking-[-0.01em] text-foreground">
            Autres contenus
          </h2>
          <ModuleGrid items={contentModules} delay={0.15} />
        </section>

        <p className="pt-2 text-center text-xs text-muted-foreground">
          {siteConfig.name} · Espace sécurisé
        </p>
      </div>
    </div>
  )
}
