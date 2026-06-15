'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Skeleton de chargement cohérent pour toutes les pages admin.
 * Remplace les `<div>Chargement...</div>` bruts.
 */
export function AdminLoading({ rows = 3 }: { rows?: number }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8" aria-busy="true" aria-label="Chargement">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-7 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-72 animate-pulse rounded-md bg-muted/70" />
        </div>
        {/* Rows skeleton */}
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted/60" />
          ))}
        </div>
      </div>
    </div>
  )
}

interface PageHeaderProps {
  title: string
  description?: string
  backHref?: string
  icon?: React.ComponentType<{ className?: string }>
  actions?: React.ReactNode
  className?: string
}

/**
 * En-tête de page admin cohérent (titre, sous-titre, retour, actions).
 */
export function PageHeader({
  title,
  description,
  backHref = '/admin/dashboard',
  icon: Icon,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="flex items-start gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Retour"
          >
            <ArrowLeft className="size-4" />
          </Link>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="size-5 text-primary" />}
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h1>
          </div>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
