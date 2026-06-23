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
        'group inline-flex items-center transition-opacity hover:opacity-90',
        className
      )}
    >
      <Image
        src="/logo.png"
        alt={siteConfig.name}
        width={815}
        height={128}
        priority
        className="h-8 w-auto sm:h-9"
      />
    </Link>
  )
}
