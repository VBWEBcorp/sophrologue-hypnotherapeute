'use client'

import { useContent } from '@/hooks/use-content'
import { getIcon } from '@/lib/icons'
import { marqueeContent } from '@/lib/site-content'

const defaults = { marquee: marqueeContent }

type MarqueeItem = { iconName?: string; label: string }

function ValuesTrack({
  items,
  direction,
  variant,
}: {
  items: MarqueeItem[]
  direction: 'left' | 'right'
  variant: 'light' | 'dark'
}) {
  const animClass =
    direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'

  const textClass =
    variant === 'dark'
      ? 'text-white/60'
      : 'text-foreground/70'
  const iconClass =
    variant === 'dark'
      ? 'text-white/30'
      : 'text-primary/50'
  const separatorClass =
    variant === 'dark'
      ? 'text-white/20'
      : 'text-border'

  const nodes = items.map((item, i) => {
    const Icon = getIcon(item.iconName ?? marqueeContent.items[i]?.iconName)
    return (
      <span
        key={`${item.label}-${i}`}
        className={`inline-flex shrink-0 items-center gap-2.5 text-nowrap font-display text-sm font-medium tracking-wide uppercase sm:text-base ${textClass}`}
      >
        <Icon className={`size-4 ${iconClass}`} aria-hidden />
        {item.label}
        <span className={separatorClass} aria-hidden>
          ·
        </span>
      </span>
    )
  })

  return (
    <div className="group flex overflow-hidden">
      <div
        className={`flex shrink-0 items-center gap-6 ${animClass}`}
        style={{ animationDuration: '35s' }}
      >
        {nodes}
      </div>
      <div
        aria-hidden
        className={`flex shrink-0 items-center gap-6 ${animClass}`}
        style={{ animationDuration: '35s' }}
      >
        {nodes}
      </div>
    </div>
  )
}

export function ValuesMarquee({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const { data } = useContent('home', defaults)
  const items = (data.marquee?.items ?? marqueeContent.items).filter(
    (item: MarqueeItem) => item?.label
  )

  const wrapperClass =
    variant === 'dark'
      ? 'border-t border-white/10 bg-black/20 backdrop-blur-sm py-4 sm:py-5'
      : 'border-y border-border/60 bg-[oklch(0.985_0.006_85)] dark:bg-[oklch(0.225_0.028_305)] py-6 sm:py-8'

  if (items.length === 0) return null

  return (
    <div className={wrapperClass}>
      <ValuesTrack items={items} direction="left" variant={variant} />
    </div>
  )
}
