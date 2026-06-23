import { cn } from '@/lib/utils'

type SectionTitleProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

/** Sépare le dernier mot (ou groupe) du titre pour le mettre en italique serif. */
function splitTitle(title: string): { lead: string; accent: string } {
  const words = title.trim().split(/\s+/)
  if (words.length <= 1) return { lead: '', accent: title }
  const accentCount = Math.min(2, Math.max(1, Math.floor(words.length / 3)))
  return {
    lead: words.slice(0, words.length - accentCount).join(' '),
    accent: words.slice(words.length - accentCount).join(' '),
  }
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionTitleProps) {
  const { lead, accent } = splitTitle(title)

  return (
    <div
      className={cn(
        'mx-auto max-w-2xl',
        align === 'center' && 'flex flex-col items-center text-center',
        className
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center rounded-full bg-card px-3.5 py-1.5 text-xs font-medium tracking-wide text-foreground/70 shadow-[var(--shadow-xs)] ring-1 ring-border/70">
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          'font-display text-balance text-[2rem] leading-[1.08] tracking-[-0.01em] text-foreground sm:text-[2.5rem] md:text-[2.85rem]',
          eyebrow && 'mt-5'
        )}
      >
        {lead ? (
          <>
            {lead}{' '}
            <span className="font-serif italic font-normal tracking-[0.005em]">{accent}</span>
          </>
        ) : (
          accent
        )}
      </h2>
      {description ? (
        <p
          className={cn(
            'mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-[1.05rem]',
            align === 'center' && 'mx-auto'
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
