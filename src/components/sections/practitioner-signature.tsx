import Image from 'next/image'

import { photos } from '@/lib/photos'
import { siteConfig } from '@/lib/seo'

/**
 * Le médaillon de la praticienne : portrait rond, nom, métier.
 *
 * Placé dans le hero de chaque page pour que la première page vue, quelle
 * qu'elle soit (on arrive souvent sur une page secondaire depuis Google),
 * montre qui reçoit. C'est le même portrait que le favicon, la page À propos
 * et les fiches RESALIB / MEDOUCINE : une seule image de référence, et c'est
 * elle que le JSON-LD et le sitemap désignent à Google pour la vignette des
 * résultats de recherche.
 */
export function PractitionerSignature({
  subtitle = 'Hypnothérapeute & sophrologue · Rennes · Acigné',
  size = 'md',
  className = '',
}: {
  subtitle?: string
  size?: 'sm' | 'md'
  className?: string
}) {
  const medallion = size === 'md' ? 'size-16 sm:size-[4.5rem]' : 'size-12 sm:size-14'
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      <span
        className={`relative ${medallion} shrink-0 overflow-hidden rounded-full ring-2 ring-white/80 shadow-[var(--shadow-md)]`}
      >
        {/* Le portrait est un peu plus large que haut : on cale le cadrage sur le visage.
            Servi tel quel (10 Ko) : l'URL de l'<img> est alors exactement celle du
            JSON-LD et du sitemap, et Google n'a qu'une seule image à relier au
            portrait qu'on lui demande en vignette. */}
        <Image
          src={photos.portraitProfessionnel}
          alt={siteConfig.ogImageAlt}
          fill
          sizes="72px"
          unoptimized
          className="object-cover object-[50%_30%]"
        />
      </span>
      <div className="text-left leading-tight">
        <p className="font-display text-base font-semibold text-white sm:text-lg">{siteConfig.name}</p>
        <p className="text-sm text-white/70">{subtitle}</p>
      </div>
    </div>
  )
}

/**
 * La même identité, en grand : la colonne de droite du hero de l'accueil.
 * Le hero de l'accueil est le seul à avoir la place pour une vraie carte ;
 * les pages secondaires gardent la signature compacte ci-dessus.
 */
export function PractitionerCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center rounded-[2rem] bg-white/10 px-8 py-9 text-center ring-1 ring-white/20 backdrop-blur-md ${className}`}
    >
      <span className="relative size-40 overflow-hidden rounded-full ring-4 ring-white/85 shadow-[var(--shadow-lg)] xl:size-44">
        <Image
          src={photos.portraitProfessionnel}
          alt={siteConfig.ogImageAlt}
          fill
          sizes="176px"
          priority
          unoptimized
          className="object-cover object-[50%_30%]"
        />
      </span>
      <p className="mt-6 font-display text-2xl font-semibold tracking-[-0.01em] text-white">{siteConfig.name}</p>
      <p className="mt-1.5 text-[15px] text-white/80">Hypnothérapeute &amp; Sophrologue</p>
      <p className="mt-4 inline-flex items-center rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-white/85 ring-1 ring-white/20">
        Praticienne certifiée depuis 2006
      </p>
    </div>
  )
}
