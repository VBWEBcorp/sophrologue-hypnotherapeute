'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarCheck, CheckCircle2, Clock, ExternalLink, Mail, MapPin, Phone, Send } from 'lucide-react'
import Image from 'next/image'

import { PremiumHero } from '@/components/sections/premium-hero'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useContent } from '@/hooks/use-content'
import { siteConfig } from '@/lib/seo'
import { contactContent, images as siteImages } from '@/lib/site-content'

const ease = [0.22, 1, 0.36, 1] as const

const defaults = {
  hero: { ...contactContent.hero, image: '' as string },
  booking: contactContent.booking,
  cabinets: contactContent.cabinets,
}

export function ContactContent() {
  const { data } = useContent('contact', defaults)
  const hero = data.hero ?? defaults.hero
  const booking = data.booking ?? defaults.booking
  const cabinets = data.cabinets ?? defaults.cabinets

  // Coordonnées : une seule source pour tout le site (pied de page, JSON-LD…).
  const phone = siteConfig.phone
  const email = siteConfig.email
  const telHref = `tel:${phone.replace(/\s+/g, '')}`

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'pending' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrorMsg(data.error || 'Une erreur est survenue. Merci de réessayer.')
        setStatus('error')
        return
      }
      setStatus(data.configured === false ? 'pending' : 'success')
      form.reset()
    } catch {
      setErrorMsg('Connexion impossible. Réessayez ou appelez-moi directement.')
      setStatus('error')
    }
  }

  const submitted = status === 'success' || status === 'pending'

  return (
    <>
      <PremiumHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        breadcrumb="Rendez-vous"
        compact
        backgroundImage={hero.image || siteImages.contactHero}
      >
        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary" aria-hidden />
            <span>Réponse rapide</span>
          </div>
          <span className="hidden h-1 w-1 rounded-full bg-border sm:inline" aria-hidden />
          <div className="flex items-center gap-2">
            <CalendarCheck className="size-4 text-primary" aria-hidden />
            <span>Réservation en ligne</span>
          </div>
          <span className="hidden h-1 w-1 rounded-full bg-border sm:inline" aria-hidden />
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-primary/70" aria-hidden />
            <span>2 cabinets + domicile</span>
          </div>
        </div>
      </PremiumHero>

      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Form card premium */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
            >
              <div className="relative overflow-hidden rounded-3xl bg-card/90 p-7 shadow-[0_20px_50px_-20px_oklch(0.2_0.02_303/0.25)] backdrop-blur-sm sm:p-9">
                {/* Bordure dégradée */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl p-px"
                  aria-hidden
                  style={{
                    background:
                      'linear-gradient(135deg, oklch(0.42 0.10 303 / 0.4) 0%, oklch(0.93 0.025 305 / 0.55) 50%, oklch(0.42 0.10 303 / 0.4) 100%)',
                    WebkitMask:
                      'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/20">
                      <Send className="size-4" aria-hidden />
                    </span>
                    <div>
                      <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
                        Me contacter
                      </h2>
                      <p className="text-xs text-muted-foreground">Je vous réponds dans les meilleurs délais</p>
                    </div>
                  </div>

                  {submitted ? (
                    <div className="mt-7 flex flex-col items-center rounded-2xl border border-primary/20 bg-primary/5 px-6 py-10 text-center">
                      <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CheckCircle2 className="size-6" aria-hidden />
                      </span>
                      <h3 className="mt-4 font-display text-lg text-foreground">Merci pour votre message</h3>
                      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                        {status === 'pending'
                          ? 'La messagerie du site sera active très prochainement. Pour me joindre dès maintenant, réservez en ligne ou appelez le '
                          : 'Je vous réponds dans les meilleurs délais. Pour un rendez-vous immédiat, vous pouvez aussi réserver en ligne ou appeler le '}
                        <a href={telHref} className="font-medium text-primary hover:underline">{phone}</a>.
                      </p>
                    </div>
                  ) : (
                  <form
                    className="mt-7 space-y-5"
                    onSubmit={handleSubmit}
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstname">Prénom</Label>
                        <Input
                          id="firstname"
                          name="firstname"
                          placeholder="Marie"
                          autoComplete="given-name"
                          className="h-11 rounded-xl bg-background/70 transition-shadow focus-visible:shadow-[0_0_0_4px_oklch(0.42_0.10_303/0.1)]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastname">Nom</Label>
                        <Input
                          id="lastname"
                          name="lastname"
                          placeholder="Dupont"
                          autoComplete="family-name"
                          className="h-11 rounded-xl bg-background/70 transition-shadow focus-visible:shadow-[0_0_0_4px_oklch(0.42_0.10_303/0.1)]"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="vous@email.fr"
                        autoComplete="email"
                        className="h-11 rounded-xl bg-background/70 transition-shadow focus-visible:shadow-[0_0_0_4px_oklch(0.42_0.10_303/0.1)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Téléphone <span className="font-normal text-muted-foreground">(optionnel)</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="06 12 34 56 78"
                        autoComplete="tel"
                        className="h-11 rounded-xl bg-background/70 transition-shadow focus-visible:shadow-[0_0_0_4px_oklch(0.42_0.10_303/0.1)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Votre message</Label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Décrivez votre besoin en quelques mots (stress, sommeil, tabac, accompagnement...)"
                        className="w-full rounded-xl border border-input bg-background/70 px-3.5 py-3 text-sm leading-relaxed text-foreground transition-shadow placeholder:text-muted-foreground focus-visible:border-ring focus-visible:shadow-[0_0_0_4px_oklch(0.42_0.10_303/0.1)] focus-visible:outline-none"
                      />
                    </div>
                    {status === 'error' && (
                      <p className="rounded-xl border border-red-500/30 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                        {errorMsg}
                      </p>
                    )}
                    <Button type="submit" size="lg" disabled={status === 'loading'} className="w-full group">
                      {status === 'loading' ? 'Envoi en cours…' : 'Envoyer ma demande'}
                      {status !== 'loading' && (
                        <Send className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                      )}
                    </Button>
                  </form>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Sidebar : réservation + coordonnées + cabinets */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: 0.06 }}
              className="space-y-5"
            >
              {/* Réservation en ligne */}
              <div className="relative overflow-hidden rounded-3xl bg-card/90 p-7 shadow-[0_10px_30px_-12px_oklch(0.2_0.02_303/0.18)] backdrop-blur-sm">
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl p-px"
                  aria-hidden
                  style={{
                    background:
                      'linear-gradient(135deg, oklch(0.42 0.10 303 / 0.35) 0%, oklch(0.93 0.025 305 / 0.55) 50%, oklch(0.42 0.10 303 / 0.35) 100%)',
                    WebkitMask:
                      'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-display text-base font-semibold tracking-tight text-foreground">
                      Prendre rendez-vous en ligne
                    </h2>
                    <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-border/60">
                      <Image
                        src="/photos/badge-medoucine-v2.png"
                        alt="Praticien recommandé Médoucine"
                        width={48}
                        height={48}
                        className="size-full object-cover"
                      />
                    </span>
                  </div>
                  {booking.map((b: { label: string; url: string; note?: string }) => (
                    <a
                      key={b.label}
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 px-4 py-3 ring-1 ring-primary/15 transition-colors hover:from-primary/15 hover:to-primary/10"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                          <CalendarCheck className="size-4" aria-hidden />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-foreground">{b.label}</span>
                          <span className="block text-xs text-muted-foreground">{b.note}</span>
                        </span>
                      </span>
                      <ExternalLink className="size-4 shrink-0 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </a>
                  ))}
                </div>
              </div>

              {/* Coordonnées + cabinets */}
              <div className="relative overflow-hidden rounded-3xl bg-card/90 p-7 shadow-[0_10px_30px_-12px_oklch(0.2_0.02_303/0.18)] backdrop-blur-sm">
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl p-px"
                  aria-hidden
                  style={{
                    background:
                      'linear-gradient(135deg, oklch(0.42 0.10 303 / 0.35) 0%, oklch(0.93 0.025 305 / 0.55) 50%, oklch(0.42 0.10 303 / 0.35) 100%)',
                    WebkitMask:
                      'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />

                <div className="relative space-y-5">
                  <h2 className="font-display text-base font-semibold tracking-tight text-foreground">
                    Me joindre directement
                  </h2>

                  <a
                    href={telHref}
                    className="group flex items-start gap-4 -mx-3 rounded-xl px-3 py-2 transition-colors hover:bg-foreground/[0.04]"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-105">
                      <Phone className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Téléphone / SMS</p>
                      <p className="text-sm font-semibold text-foreground">{phone}</p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${email}`}
                    className="group flex items-start gap-4 -mx-3 rounded-xl px-3 py-2 transition-colors hover:bg-foreground/[0.04]"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-105">
                      <Mail className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Email</p>
                      <p className="text-sm font-semibold text-foreground break-all">{email}</p>
                    </div>
                  </a>

                  {/* Cabinets */}
                  <div className="space-y-4 border-t border-border/60 pt-5">
                    {cabinets.map((c: { name: string; address: string; note?: string }) => (
                      <div key={c.name} className="flex items-start gap-4 -mx-3 rounded-xl px-3 py-1">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/20">
                          <MapPin className="size-4" aria-hidden />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{c.name}</p>
                          <p className="text-sm text-muted-foreground">{c.address}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground/80">{c.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border/60 pt-5">
                    <div className="flex items-center gap-2">
                      <span
                        className="relative flex size-2 items-center justify-center"
                        aria-hidden
                      >
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        Consultations sur rendez-vous
                      </span>
                      <span className="text-xs text-muted-foreground">· visites à domicile (20 km)</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
