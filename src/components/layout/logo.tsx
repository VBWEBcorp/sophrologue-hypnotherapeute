import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/seo'

type LogoProps = {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={siteConfig.name}
      className={cn(
        'group inline-flex items-center gap-2.5 transition-opacity hover:opacity-90',
        className
      )}
    >
      {/* Avatar rond — photo de Véronique */}
      <span className="relative inline-flex size-9 shrink-0 overflow-hidden rounded-full ring-1 ring-primary/25 shadow-[var(--shadow-xs)] transition-transform duration-300 group-hover:scale-[1.04]">
        <Image
          src="/photos/veronique-jan.png"
          alt={siteConfig.name}
          fill
          sizes="36px"
          priority
          className="object-cover object-center"
        />
      </span>

      <span className="whitespace-nowrap font-display text-base font-semibold tracking-tight text-foreground sm:text-lg">
        {siteConfig.name}
      </span>
    </Link>
  )
}
