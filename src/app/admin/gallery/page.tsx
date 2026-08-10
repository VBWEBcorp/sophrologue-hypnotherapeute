'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Images,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Save,
  X,
  Settings2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'

import { PageHeader, AdminLoading } from '@/components/admin/admin-ui'
import { FieldEditor, ImageField } from '@/components/admin/field-editor'
import { useToast } from '@/components/admin/toast'
import { useConfirm } from '@/components/admin/confirm-dialog'
import { Button } from '@/components/ui/button'
import { PHOTO_CATEGORIES } from '@/lib/photos'
import { cn } from '@/lib/utils'

/* ── Types ──────────────────────────────────────────────────────────────── */

interface GalleryImageDoc {
  _id: string
  title: string
  description?: string
  imageUrl: string
  category?: string
  order: number
  active: boolean
}

interface GallerySettingsDoc {
  enabled: boolean
  title: string
  description?: string
  eyebrow?: string
  heroImage?: string
}

/** Formulaire d'ajout/modification. `_id` absent = création. */
type Draft = {
  _id?: string
  title: string
  description: string
  imageUrl: string
  category: string
}

const EMPTY_DRAFT: Draft = { title: '', description: '', imageUrl: '', category: '' }

const DEFAULT_SETTINGS: GallerySettingsDoc = {
  enabled: true,
  title: 'Mes cabinets en images',
  description: "Les lieux où je vous reçois, à Rennes et à Acigné, et le déroulé d'une séance.",
  eyebrow: 'Galerie',
  heroImage: '',
}

const CATEGORY_OPTIONS = Object.values(PHOTO_CATEGORIES)

/* ── Helpers réseau ─────────────────────────────────────────────────────── */

function authHeaders(json = false): HeadersInit {
  const token = localStorage.getItem('authToken')
  return {
    Authorization: `Bearer ${token}`,
    ...(json ? { 'Content-Type': 'application/json' } : {}),
  }
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function AdminGalleryPage() {
  const { toast } = useToast()
  const confirm = useConfirm()

  const [images, setImages] = useState<GalleryImageDoc[]>([])
  const [settings, setSettings] = useState<GallerySettingsDoc>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<'session' | 'reseau' | null>(null)
  const [savingSettings, setSavingSettings] = useState(false)
  const [settingsDirty, setSettingsDirty] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [savingDraft, setSavingDraft] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const loadImages = useCallback(async () => {
    const response = await fetch('/api/gallery/images?all=1', { headers: authHeaders() })

    // Session expirée ou absente : on le dit, au lieu d'afficher une galerie
    // vide qui ferait croire que les photos ont disparu.
    if (response.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
      throw new Error('unauthorized')
    }
    if (!response.ok) throw new Error('images')

    const data = await response.json()
    setImages(Array.isArray(data) ? data : [])
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      await loadImages()
    } catch (error) {
      setLoadError(
        error instanceof Error && error.message === 'unauthorized'
          ? 'session'
          : 'reseau'
      )
      setLoading(false)
      return
    }

    // Les réglages sont secondaires : leur échec ne doit pas masquer les photos.
    try {
      const response = await fetch('/api/gallery/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({ ...DEFAULT_SETTINGS, ...data })
      }
    } catch {
      /* on garde les réglages par défaut */
    }
    setLoading(false)
  }, [loadImages])

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateSetting = (patch: Partial<GallerySettingsDoc>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
    setSettingsDirty(true)
  }

  const saveSettings = async () => {
    setSavingSettings(true)
    try {
      const response = await fetch('/api/gallery/settings', {
        method: 'PUT',
        headers: authHeaders(true),
        body: JSON.stringify(settings),
      })
      if (!response.ok) throw new Error()
      setSettingsDirty(false)
      toast.success('Réglages enregistrés')
    } catch {
      toast.error("Erreur lors de l'enregistrement des réglages")
    } finally {
      setSavingSettings(false)
    }
  }

  const saveDraft = async () => {
    if (!draft) return
    if (!draft.title.trim() || !draft.imageUrl.trim()) {
      toast.error('Un titre et une image sont nécessaires')
      return
    }

    setSavingDraft(true)
    try {
      const isEdit = Boolean(draft._id)
      const payload = {
        title: draft.title.trim(),
        description: draft.description.trim(),
        imageUrl: draft.imageUrl.trim(),
        category: draft.category.trim() || 'general',
        // Nouvelle photo : placée à la fin de la galerie.
        ...(isEdit ? {} : { order: (images.at(-1)?.order ?? 0) + 10 }),
      }

      const response = await fetch(
        isEdit ? `/api/gallery/images/${draft._id}` : '/api/gallery/images',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: authHeaders(true),
          body: JSON.stringify(payload),
        }
      )
      if (!response.ok) throw new Error()

      await loadImages()
      setDraft(null)
      toast.success(isEdit ? 'Photo modifiée' : 'Photo ajoutée')
    } catch {
      toast.error("Erreur lors de l'enregistrement de la photo")
    } finally {
      setSavingDraft(false)
    }
  }

  const patchImage = async (image: GalleryImageDoc, patch: Partial<GalleryImageDoc>) => {
    setBusyId(image._id)
    try {
      const response = await fetch(`/api/gallery/images/${image._id}`, {
        method: 'PUT',
        headers: authHeaders(true),
        body: JSON.stringify(patch),
      })
      if (!response.ok) throw new Error()
      await loadImages()
    } catch {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setBusyId(null)
    }
  }

  /** Échange la position de deux photos voisines. */
  const move = async (index: number, direction: -1 | 1) => {
    const current = images[index]
    const neighbour = images[index + direction]
    if (!current || !neighbour) return

    setBusyId(current._id)
    try {
      await Promise.all([
        fetch(`/api/gallery/images/${current._id}`, {
          method: 'PUT',
          headers: authHeaders(true),
          body: JSON.stringify({ order: neighbour.order }),
        }),
        fetch(`/api/gallery/images/${neighbour._id}`, {
          method: 'PUT',
          headers: authHeaders(true),
          body: JSON.stringify({ order: current.order }),
        }),
      ])
      await loadImages()
    } catch {
      toast.error('Erreur lors du déplacement')
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (image: GalleryImageDoc) => {
    const confirmed = await confirm({
      title: 'Supprimer cette photo ?',
      message: `« ${image.title} » sera retirée de la galerie. Le fichier reste stocké, mais la photo disparaîtra du site.`,
      confirmLabel: 'Supprimer',
      danger: true,
    })
    if (!confirmed) return

    setBusyId(image._id)
    try {
      const response = await fetch(`/api/gallery/images/${image._id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      if (!response.ok) throw new Error()
      await loadImages()
      toast.success('Photo supprimée')
    } catch {
      toast.error('Erreur lors de la suppression')
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <AdminLoading rows={4} />

  // Échec de chargement : surtout ne pas afficher « la galerie est vide ».
  if (loadError) {
    const sessionExpiree = loadError === 'session'
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-lg pt-16 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <AlertTriangle className="size-6" />
          </span>
          <h1 className="mt-4 text-lg font-semibold text-foreground">
            {sessionExpiree ? 'Votre session a expiré' : 'La galerie n’a pas pu être chargée'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {sessionExpiree
              ? 'Vos photos sont bien là. Reconnectez-vous pour les afficher.'
              : 'Vos photos sont bien enregistrées. Il s’agit d’un problème de connexion au serveur.'}
          </p>
          <div className="mt-6 flex justify-center gap-2">
            {sessionExpiree ? (
              <Button asChild>
                <Link href="/admin/login">Se reconnecter</Link>
              </Button>
            ) : (
              <Button onClick={load}>
                <RefreshCw className="size-4" />
                Réessayer
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  const visibleCount = images.filter((image) => image.active).length

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl pt-8 md:pt-0">
        <PageHeader
          title="Galerie photos"
          icon={Images}
          description={`${images.length} photo${images.length > 1 ? 's' : ''} — ${visibleCount} visible${visibleCount > 1 ? 's' : ''} sur le site`}
          actions={
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/gallery" target="_blank">
                  <ExternalLink className="size-3.5" />
                  <span className="hidden sm:inline">Voir la page</span>
                </Link>
              </Button>
              <Button size="sm" onClick={() => setDraft({ ...EMPTY_DRAFT })}>
                <Plus className="size-3.5" />
                Ajouter une photo
              </Button>
            </>
          }
        />

        {/* ── Réglages de la page Galerie ───────────────────────────────── */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-border bg-card">
          <button
            type="button"
            onClick={() => setSettingsOpen((open) => !open)}
            aria-expanded={settingsOpen}
            className="flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors hover:bg-muted/30"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Settings2 className="size-[18px]" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-foreground">Réglages de la page Galerie</h2>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                Titre, texte d&apos;introduction et image de bannière
              </p>
            </div>
            {settingsDirty && (
              <span className="mr-1 flex items-center gap-1.5 text-[11px] font-medium text-primary">
                <span className="size-1.5 rounded-full bg-primary" />
                <span className="hidden sm:inline">Non enregistré</span>
              </span>
            )}
            <ChevronDown
              className={cn(
                'size-4 shrink-0 text-muted-foreground/60 transition-transform duration-200',
                settingsOpen && 'rotate-180'
              )}
            />
          </button>

          <AnimatePresence initial={false}>
            {settingsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 gap-x-5 gap-y-4 border-t border-border/60 p-5 md:grid-cols-2">
                  <FieldEditor
                    label="Accroche"
                    value={settings.eyebrow ?? ''}
                    onChange={(value) => updateSetting({ eyebrow: value })}
                  />
                  <FieldEditor
                    label="Titre"
                    value={settings.title ?? ''}
                    onChange={(value) => updateSetting({ title: value })}
                  />
                  <FieldEditor
                    label="Texte d'introduction"
                    value={settings.description ?? ''}
                    type="textarea"
                    onChange={(value) => updateSetting({ description: value })}
                  />
                  <ImageField
                    label="Image de bannière"
                    value={settings.heroImage ?? ''}
                    onChange={(value) => updateSetting({ heroImage: value })}
                  />

                  <label className="flex items-center gap-3 md:col-span-2">
                    <input
                      type="checkbox"
                      checked={settings.enabled}
                      onChange={(event) => updateSetting({ enabled: event.target.checked })}
                      className="size-4 accent-[var(--primary)]"
                    />
                    <span className="text-sm text-foreground">
                      Afficher la page Galerie sur le site
                    </span>
                  </label>

                  <div className="flex justify-end md:col-span-2">
                    <Button onClick={saveSettings} disabled={savingSettings || !settingsDirty} size="sm">
                      <Save className="size-3.5" />
                      {savingSettings ? 'Enregistrement…' : 'Enregistrer les réglages'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Liste des photos ──────────────────────────────────────────── */}
        {images.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
            <Images className="mx-auto size-8 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium text-foreground">La galerie est vide</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ajoutez une première photo pour qu&apos;elle apparaisse sur le site.
            </p>
            <Button className="mt-5" onClick={() => setDraft({ ...EMPTY_DRAFT })}>
              <Plus className="size-4" />
              Ajouter une photo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <article
                key={image._id}
                className={cn(
                  'group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all',
                  busyId === image._id && 'pointer-events-none opacity-60',
                  !image.active && 'border-dashed'
                )}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className={cn('size-full object-cover', !image.active && 'opacity-40 grayscale')}
                  />
                  {!image.active && (
                    <span className="absolute left-2 top-2 rounded-md bg-zinc-900/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Masquée
                    </span>
                  )}
                  <div className="absolute right-2 top-2 flex gap-1">
                    <button
                      type="button"
                      title="Monter"
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                      className="rounded-md bg-black/55 p-1.5 text-white transition-colors hover:bg-black/80 disabled:opacity-30"
                    >
                      <ChevronUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Descendre"
                      disabled={index === images.length - 1}
                      onClick={() => move(index, 1)}
                      className="rounded-md bg-black/55 p-1.5 text-white transition-colors hover:bg-black/80 disabled:opacity-30"
                    >
                      <ChevronDown className="size-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="text-sm font-semibold leading-snug text-foreground">{image.title}</h3>
                  {image.description && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {image.description}
                    </p>
                  )}
                  {image.category && image.category !== 'general' && (
                    <span className="w-fit rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                      {image.category}
                    </span>
                  )}

                  <div className="mt-auto flex items-center gap-1 border-t border-border/50 pt-3">
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          _id: image._id,
                          title: image.title,
                          description: image.description ?? '',
                          imageUrl: image.imageUrl,
                          category: image.category ?? '',
                        })
                      }
                      className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => patchImage(image, { active: !image.active })}
                      title={image.active ? 'Masquer du site' : 'Afficher sur le site'}
                      className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {image.active ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      {image.active ? 'Masquer' : 'Afficher'}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(image)}
                      title="Supprimer"
                      className="ml-auto rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* ── Modale d'ajout / modification ───────────────────────────────── */}
      <AnimatePresence>
        {draft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-start justify-center overflow-y-auto p-4 sm:items-center"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => !savingDraft && setDraft(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative my-auto w-full max-w-xl rounded-2xl border border-border bg-card p-5 shadow-2xl sm:p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {draft._id ? 'Modifier la photo' : 'Ajouter une photo'}
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Le titre sert aussi de texte alternatif : décrivez ce que montre la photo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => !savingDraft && setDraft(null)}
                  aria-label="Fermer"
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                <ImageField
                  label="Photo"
                  value={draft.imageUrl}
                  onChange={(value) => setDraft({ ...draft, imageUrl: value })}
                />
                <FieldEditor
                  label="Titre"
                  value={draft.title}
                  wide
                  placeholder="Cabinet de Rennes — salle de séance"
                  onChange={(value) => setDraft({ ...draft, title: value })}
                />
                <FieldEditor
                  label="Description"
                  value={draft.description}
                  type="textarea"
                  placeholder="Une phrase pour situer la photo (facultatif)."
                  onChange={(value) => setDraft({ ...draft, description: value })}
                />

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[13px] font-medium text-foreground/80">Catégorie</label>
                  <input
                    list="gallery-categories"
                    value={draft.category}
                    onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                    placeholder="Cabinet de Rennes"
                    className="h-9 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-1 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                  <datalist id="gallery-categories">
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                  <p className="text-[11px] text-muted-foreground">
                    Affichée comme étiquette sous la photo. Choisissez dans la liste ou saisissez la vôtre.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDraft(null)} disabled={savingDraft}>
                  Annuler
                </Button>
                <Button onClick={saveDraft} disabled={savingDraft}>
                  <Save className="size-4" />
                  {savingDraft ? 'Enregistrement…' : 'Enregistrer'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
