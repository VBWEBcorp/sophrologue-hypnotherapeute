'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Cookie, X } from 'lucide-react'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const handleRefuse = () => {
    localStorage.setItem('cookie-consent', 'refused')
    setVisible(false)
  }

  const handleClose = () => {
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 16, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 right-4 z-[100] sm:right-auto sm:max-w-[300px]"
          role="dialog"
          aria-labelledby="cookie-title"
          aria-describedby="cookie-desc"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-4 shadow-[0_16px_40px_-12px_oklch(0.2_0.02_303/0.22)]">
            {/* Halo violet subtil top-right (cohérent DA) */}
            <div
              className="pointer-events-none absolute -top-12 -right-12 size-32 rounded-full bg-primary/10 blur-3xl"
              aria-hidden
            />
            {/* Bordure dégradée premium */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl p-px"
              aria-hidden
              style={{
                background:
                  'linear-gradient(135deg, oklch(0.42 0.10 303 / 0.35) 0%, oklch(0.93 0.025 305 / 0.5) 50%, oklch(0.42 0.10 303 / 0.35) 100%)',
                WebkitMask:
                  'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />

            {/* Grand cookie décoratif en filigrane (coin haut-droit) qui tourne lentement */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -right-5 -top-6 text-primary/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 36, ease: 'linear', repeat: Infinity }}
            >
              <Cookie className="size-28" strokeWidth={1.5} />
            </motion.div>

            <div className="relative">
              {/* Ligne haut : icône + fermer */}
              <div className="mb-2.5 flex items-start justify-between">
                {/* Icône cookie animée */}
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 14 }}
                  whileHover={{ scale: 1.08, rotate: -6 }}
                  className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/20"
                >
                  <span
                    className="absolute inset-0 animate-ping rounded-xl bg-primary/15 opacity-60"
                    style={{ animationDuration: '2.5s' }}
                    aria-hidden
                  />
                  <motion.span
                    animate={{ rotate: [0, -4, 4, -2, 2, 0] }}
                    transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.5 }}
                    className="relative inline-flex"
                  >
                    <Cookie className="size-[18px]" strokeWidth={2} aria-hidden />
                  </motion.span>
                </motion.span>

                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Fermer"
                  className="-mr-1 -mt-1 flex size-6 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
                >
                  <X className="size-3.5" strokeWidth={2} />
                </button>
              </div>

              {/* Texte */}
              <p id="cookie-title" className="font-display text-[13px] font-semibold text-foreground">
                Nous utilisons des cookies
              </p>
              <p id="cookie-desc" className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                Pour améliorer votre expérience.{' '}
                <Link href="/politique-cookies" className="text-primary underline-offset-2 hover:underline">
                  En savoir plus
                </Link>
              </p>

              {/* Boutons */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleAccept}
                  className="group/cta relative inline-flex h-8 flex-1 items-center justify-center overflow-hidden rounded-lg text-xs font-semibold text-primary-foreground shadow-[0_4px_14px_-4px_oklch(0.34_0.10_303/0.5)] transition-all hover:shadow-[0_6px_20px_-4px_oklch(0.34_0.10_303/0.6)] active:translate-y-px"
                >
                  <span
                    className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[oklch(0.30_0.07_303)] dark:from-primary dark:via-primary dark:to-[oklch(0.40_0.09_303)]"
                    aria-hidden
                  />
                  <span
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover/cta:translate-x-full"
                    aria-hidden
                  />
                  <span className="relative">Accepter</span>
                </button>
                <button
                  onClick={handleRefuse}
                  className="h-8 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Refuser
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
