'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Upload,
  Link as LinkIcon,
  X,
  Loader2,
  ImageIcon,
  Images,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/admin/toast'
import { cn } from '@/lib/utils'

interface FieldEditorProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'textarea' | 'url'
  placeholder?: string
  /** Force le champ sur toute la largeur de la grille. */
  wide?: boolean
}

export function FieldEditor({ label, value, onChange, type = 'text', placeholder, wide }: FieldEditorProps) {
  const fullWidth = wide || type === 'textarea'
  return (
    <div className={cn('space-y-1.5', fullWidth && 'md:col-span-2')}>
      <Label className="text-[13px] font-medium text-foreground/80">{label}</Label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-y"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type === 'url' ? 'url' : 'text'}
          className="bg-background"
        />
      )}
    </div>
  )
}

interface SectionEditorProps {
  title: string
  description?: string
  /** Icône affichée dans l'en-tête de la section. */
  icon?: React.ComponentType<{ className?: string }>
  /**
   * Rang de la section sur la page publique. Affiché en pastille pour que
   * l'ordre de l'éditeur corresponde visiblement à celui du site.
   */
  step?: number
  /** Disposition des enfants : 2 colonnes (défaut) ou 1 colonne. */
  cols?: 1 | 2
  children: React.ReactNode
}

/**
 * Une section de la page, à l'intérieur de la carte unique de l'éditeur.
 * Tout est déplié : l'éditrice fait défiler la page exactement comme le
 * visiteur fait défiler le site.
 */
export function SectionEditor({ title, description, icon: Icon, step, cols = 2, children }: SectionEditorProps) {
  return (
    <section className="scroll-mt-24 border-t border-border first:border-t-0">
      <header className="flex items-center gap-3.5 bg-muted/25 px-5 py-4">
        {step !== undefined && (
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-bold tabular-nums text-primary-foreground">
            {step}
          </span>
        )}
        {Icon && (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-[18px]" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
      </header>

      <div
        className={cn(
          'grid grid-cols-1 gap-x-5 gap-y-4 border-t border-border/50 p-5',
          cols === 2 && 'md:grid-cols-2'
        )}
      >
        {children}
      </div>
    </section>
  )
}

interface RepeatableListProps<T> {
  /** Éléments actuels ; undefined est traité comme une liste vide. */
  items: T[] | undefined
  onChange: (next: T[]) => void
  /** Intitulé d'un élément, ex. « Accompagnement » → « Accompagnement 2 ». */
  itemLabel: string
  /** Élément neuf, créé au clic sur « Ajouter ». Omis = pas de bouton d'ajout. */
  newItem?: () => T
  addLabel?: string
  /** Masque les flèches de réordonnancement quand l'ordre n'a pas de sens. */
  sortable?: boolean
  /** `patch` fusionne des champs dans l'élément ; `replace` le remplace entier. */
  renderItem: (item: T, index: number, patch: (changes: Partial<T>) => void) => React.ReactNode
}

/**
 * Liste d'éléments répétables : ajout, suppression, déplacement.
 * Utilisée partout où le site affiche une série de blocs identiques
 * (accompagnements, étapes, questions, avis, horaires…).
 */
export function RepeatableList<T>({
  items,
  onChange,
  itemLabel,
  newItem,
  addLabel,
  sortable = true,
  renderItem,
}: RepeatableListProps<T>) {
  const list = items ?? []

  const move = (index: number, direction: -1 | 1) => {
    const next = [...list]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div className="space-y-3 md:col-span-2">
      {list.map((item, index) => (
        <div key={index} className="rounded-xl border border-border/50 bg-muted/20 p-3.5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {itemLabel} {index + 1}
            </span>
            <div className="flex items-center gap-0.5">
              {sortable && (
                <>
                  <button
                    type="button"
                    title="Monter"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-card hover:text-foreground disabled:opacity-30"
                  >
                    <ChevronUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    title="Descendre"
                    disabled={index === list.length - 1}
                    onClick={() => move(index, 1)}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-card hover:text-foreground disabled:opacity-30"
                  >
                    <ChevronDown className="size-4" />
                  </button>
                </>
              )}
              <button
                type="button"
                title="Supprimer"
                onClick={() => onChange(list.filter((_, i) => i !== index))}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
            {renderItem(item, index, (changes) =>
              onChange(list.map((it, i) => (i === index ? { ...it, ...changes } : it)))
            )}
          </div>
        </div>
      ))}

      {newItem && (
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={() => onChange([...list, newItem()])}
        >
          <Plus className="size-4" />
          {addLabel ?? `Ajouter ${itemLabel.toLowerCase()}`}
        </Button>
      )}
    </div>
  )
}

interface GalleryPhoto {
  _id: string
  title: string
  imageUrl: string
  category?: string
  active?: boolean
}

/**
 * Sélecteur de photo puisant dans la galerie (rubrique « Galerie photos »).
 * Évite de re-téléverser une photo déjà présente sur le site.
 */
function GalleryPicker({
  onPick,
  onClose,
}: {
  onPick: (url: string) => void
  onClose: () => void
}) {
  const [photos, setPhotos] = useState<GalleryPhoto[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    // Vue admin (photos masquées comprises) ; repli sur le flux public.
    fetch('/api/gallery/images?all=1', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => (response.ok ? response : fetch('/api/gallery/images')))
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => setPhotos(Array.isArray(data) ? data : []))
      .catch(() => setFailed(true))
  }, [])

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-border/60 px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Choisir dans la galerie</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {photos ? `${photos.length} photo${photos.length > 1 ? 's' : ''} disponible${photos.length > 1 ? 's' : ''}` : 'Chargement…'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {failed && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Impossible de charger la galerie. Réessayez dans un instant.
            </p>
          )}
          {!failed && !photos && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          )}
          {photos && photos.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Aucune photo dans la galerie pour l&apos;instant.
            </p>
          )}
          {photos && photos.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {photos.map((photo) => (
                <button
                  key={photo._id}
                  type="button"
                  onClick={() => {
                    onPick(photo.imageUrl)
                    onClose()
                  }}
                  title={photo.title}
                  className="group overflow-hidden rounded-xl border border-border/60 text-left transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.imageUrl} alt={photo.title} className="size-full object-cover" />
                    {photo.active === false && (
                      <span className="absolute left-1.5 top-1.5 rounded bg-zinc-900/80 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-white">
                        Masquée
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-2 px-2.5 py-2 text-[11px] leading-snug text-foreground">
                    {photo.title}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface ImageFieldProps {
  label?: string
  value: string
  onChange: (value: string) => void
}

export function ImageField({ label, value, onChange }: ImageFieldProps) {
  const { toast } = useToast()
  const [mode, setMode] = useState<'link' | 'upload'>(
    value && !value.startsWith('/uploads') && !value.includes('r2') ? 'link' : 'upload'
  )
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadInfo, setUploadInfo] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const token = localStorage.getItem('authToken')
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error || "Erreur lors de l’upload")
        return
      }

      const data = await response.json()
      onChange(data.url)
      setUploadInfo(`${data.originalSize} → ${data.optimizedSize} (${data.storage})`)
      toast.success('Image importée')
    } catch {
      toast.error("Erreur lors de l’upload")
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleUpload(file)
    }
  }

  return (
    <div className="space-y-2 md:col-span-2">
      <div className={cn('flex flex-wrap items-center gap-2', label ? 'justify-between' : 'justify-end')}>
        {label && <Label className="text-[13px] font-medium text-foreground/80">{label}</Label>}
        <div className="flex items-center gap-2">
          {/* Piocher une photo déjà présente dans la galerie du site */}
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Images className="size-3.5 text-primary" />
            Choisir dans la galerie
          </button>
          <div className="flex gap-1 rounded-lg bg-muted/60 p-0.5">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={cn(
              'flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              mode === 'upload'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Upload className="size-3" />
            Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('link')}
            className={cn(
              'flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              mode === 'link'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <LinkIcon className="size-3" />
            Lien
          </button>
          </div>
        </div>
      </div>

      {pickerOpen && (
        <GalleryPicker
          onPick={(url) => {
            onChange(url)
            setUploadInfo(null)
            toast.success('Photo choisie dans la galerie')
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {/* Preview */}
        {value ? (
          <div className="group relative w-full shrink-0 sm:w-44">
            <div className="aspect-video overflow-hidden rounded-lg border border-border/50 bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="" className="h-full w-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => onChange('')}
              title="Retirer l'image"
              className="absolute right-2 top-2 rounded-md bg-black/60 p-1 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
            >
              <X className="size-3" />
            </button>
          </div>
        ) : (
          <div className="flex aspect-video w-full shrink-0 items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/40 text-muted-foreground/40 sm:w-44">
            <ImageIcon className="size-7" />
          </div>
        )}

        {/* Input zone */}
        <div className="min-w-0 flex-1">
          {mode === 'link' ? (
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://..."
              type="url"
              className="bg-background"
            />
          ) : (
            <>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={() => !uploading && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={cn(
                  'flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed p-5 text-center transition-colors cursor-pointer',
                  dragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-border/50 hover:border-primary/40 hover:bg-muted/40',
                  uploading && 'pointer-events-none opacity-60'
                )}
              >
                {uploading ? (
                  <>
                    <Loader2 className="size-5 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">Upload en cours…</span>
                  </>
                ) : (
                  <>
                    <Upload className="size-5 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">Cliquez ou glissez une photo</span>
                    <span className="text-[11px] text-muted-foreground/70">JPG, PNG, WebP, GIF · max 10 Mo</span>
                  </>
                )}
              </div>
            </>
          )}
          {value && mode === 'upload' && (
            <p className="mt-1.5 truncate text-[11px] text-muted-foreground">{value}</p>
          )}
          {uploadInfo && <p className="mt-0.5 text-[11px] text-primary">{uploadInfo}</p>}
        </div>
      </div>
    </div>
  )
}
