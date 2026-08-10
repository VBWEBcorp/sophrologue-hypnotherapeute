'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import Image from 'next/image'

interface GalleryImage {
  _id: string
  title: string
  description?: string
  imageUrl: string
  category?: string
}

interface GallerySettings {
  enabled: boolean
  title: string
  description?: string
  eyebrow?: string
  heroImage?: string
}

const ease = [0.22, 1, 0.36, 1] as const

/** Détache le(s) dernier(s) mot(s) du titre pour l'accent italique serif (signature de la marque). */
function splitTitle(title: string): { lead: string; accent: string } {
  const words = title.trim().split(/\s+/)
  if (words.length <= 1) return { lead: '', accent: title }
  const n = Math.min(2, Math.max(1, Math.floor(words.length / 3)))
  return {
    lead: words.slice(0, words.length - n).join(' '),
    accent: words.slice(words.length - n).join(' '),
  }
}

interface Props {
  initialSettings: GallerySettings
  initialImages: GalleryImage[]
}

export default function GalleryContent({ initialSettings, initialImages }: Props) {
  const [settings] = useState<GallerySettings>(initialSettings)
  const [images] = useState<GalleryImage[]>(initialImages)
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null)

  if (!settings?.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">La galerie n&apos;est pas disponible pour le moment.</p>
      </div>
    )
  }

  const { lead: titleLead, accent: titleAccent } = splitTitle(
    settings.title || 'Mes cabinets en images'
  )

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[340px] sm:min-h-[400px] lg:min-h-[440px] flex items-center">
        <div className="absolute inset-0">
          {settings.heroImage ? (
            <Image
              src={settings.heroImage}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
          )}
        </div>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28 w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-white/90 ring-1 ring-white/20 backdrop-blur-sm">
              {settings.eyebrow || 'Galerie'}
            </span>
            <h1 className="mt-6 font-display text-balance text-[2.75rem] leading-[1.05] tracking-[-0.02em] text-white sm:text-6xl lg:text-[4rem]">
              {titleLead ? (
                <>
                  {titleLead}{' '}
                  <span className="font-serif italic font-normal text-[oklch(0.82_0.07_305)]">
                    {titleAccent}
                  </span>
                </>
              ) : (
                titleAccent
              )}
            </h1>
            <p className="mt-5 text-lg text-white/70 leading-relaxed sm:text-xl max-w-2xl mx-auto">
              {settings.description || "Les lieux où je vous reçois, à Rennes et à Acigné, et le déroulé d'une séance d'hypnose ou de sophrologie."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, i) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, ease, delay: (i % 3) * 0.06 }}
                className="group cursor-pointer"
                onClick={() => setLightbox(image)}
              >
                <div className="overflow-hidden rounded-3xl bg-card ring-1 ring-border/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      src={image.imageUrl}
                      alt={image.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                      {image.title}
                    </h3>
                    {image.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {image.description}
                      </p>
                    )}
                    {image.category && (
                      <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        {image.category}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground text-lg font-medium">Aucune image dans la galerie.</p>
            <p className="text-sm text-muted-foreground/60 mt-2">Revenez bientôt !</p>
          </motion.div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease }}
              className="relative max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-card shadow-2xl ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full" style={{ maxHeight: '70vh' }}>
                <img
                  src={lightbox.imageUrl}
                  alt={lightbox.title}
                  decoding="async"
                  className="h-auto max-h-[70vh] w-full bg-black object-contain"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground">{lightbox.title}</h3>
                {lightbox.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{lightbox.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                aria-label="Fermer"
                className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/50 text-white ring-1 ring-white/15 backdrop-blur-sm transition-colors hover:bg-black/70"
              >
                <X className="size-4" aria-hidden />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
