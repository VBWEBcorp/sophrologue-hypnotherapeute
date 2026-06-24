import { cn } from '@/lib/utils'

type SectionTitleProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  /** 'dark' = posé sur un fond foncé (texte clair). */
  tone?: 'light' | 'dark'
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
  tone = 'light',
  className,
}: SectionTitleProps) {
  const { lead, accent } = splitTitle(title)
  const dark = tone === 'dark'

  return (
    <div
      className={cn(
        'mx-auto max-w-2xl',
        align === 'center' && 'flex flex-col items-center text-center',
        className
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            'inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide ring-1',
            dark
              ? 'bg-white/10 text-white/90 ring-white/20'
              : 'bg-card text-foreground/70 shadow-[var(--shadow-xs)] ring-border/70'
          )}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          'font-display text-balance text-[2rem] leading-[1.08] tracking-[-0.01em] sm:text-[2.5rem] md:text-[2.85rem]',
          dark ? 'text-white' : 'text-foreground',
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
            'mt-5 max-w-xl text-pretty text-base leading-relaxed sm:text-[1.05rem]',
            dark ? 'text-white/75' : 'text-muted-foreground',
            align === 'center' && 'mx-auto'
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
