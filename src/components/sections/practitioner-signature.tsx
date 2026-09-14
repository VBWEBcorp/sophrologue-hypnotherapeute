import Image from 'next/image'

import { photos } from '@/lib/photos'
import { siteConfig } from '@/lib/seo'

/**
 * Le médaillon de la praticienne : portrait rond, nom, métier.
 *
 * Placé dans le hero de chaque page pour que la première page vue, quelle
 * qu'elle soit (on arrive souvent sur une page secondaire depuis Google),
 * montre qui reçoit. C'est le même portrait que le favicon, la page À propos
 * et les fiches RESALIB / MEDOUCINE : une seule image de référence.
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
        {/* Le portrait est un peu plus large que haut : on cale le cadrage sur le visage. */}
        <Image
          src={photos.portraitProfessionnel}
          alt={siteConfig.name}
          fill
          sizes="72px"
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
