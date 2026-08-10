'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Save,
  Check,
  ArrowLeft,
  Eye,
  X,
  ExternalLink,
  Monitor,
  Smartphone,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/admin/toast'
import { AdminLoading } from '@/components/admin/admin-ui'
import { cn } from '@/lib/utils'

/* ── Types ──────────────────────────────────────────────────────────────── */

/** Un document de contenu (une entrée de /api/content/[pageId]). */
export interface EditorDoc {
  id: string
  defaults: Record<string, any>
}

/** Accès en lecture/écriture à un document, fourni aux éditeurs de page. */
export interface DocEditor {
  content: Record<string, any>
  /** Lit une valeur par chemin pointé : value('hero.title'). */
  value: (path: string) => any
  /** Écrit une valeur par chemin pointé. */
  set: (path: string, value: unknown) => void
  /** Version curryfiée, à brancher directement sur onChange. */
  setter: (path: string) => (value: any) => void
}

export type Edit = (docId: string) => DocEditor

interface PageEditorProps {
  title: string
  /** Documents pilotés par cette page. Le premier sert de référence. */
  docs: EditorDoc[]
  /** Chemin public prévisualisé. Déduit de l'id du premier document si absent. */
  previewPath?: string
  children: (edit: Edit) => React.ReactNode
}

/* ── Utilitaires de chemin pointé ───────────────────────────────────────── */

function readPath(source: Record<string, any> | undefined, path: string): any {
  return path.split('.').reduce<any>((acc, key) => (acc == null ? undefined : acc[key]), source)
}

function writePath(source: Record<string, any>, path: string, value: unknown) {
  const keys = path.split('.')
  const next = JSON.parse(JSON.stringify(source))
  let node = next
  for (let i = 0; i < keys.length - 1; i++) {
    if (typeof node[keys[i]] !== 'object' || node[keys[i]] === null) node[keys[i]] = {}
    node = node[keys[i]]
  }
  node[keys[keys.length - 1]] = value
  return next
}

/** Chemins publics par défaut, pour l'aperçu en direct. */
const previewPaths: Record<string, string> = {
  home: '/',
  about: '/a-propos',
  services: '/services',
  contact: '/contact',
  testimonials: '/#temoignages',
  'sub-hypnotherapie': '/hypnotherapie',
  'sub-seances-hypnose': '/seances-hypnose',
  'sub-sophrologie': '/sophrologie',
  'sub-cabinets': '/cabinets',
  'sub-cabinet-rennes': '/cabinets/rennes',
  'sub-cabinet-acigne': '/cabinets/acigne',
}

/* ── Composant ──────────────────────────────────────────────────────────── */

export function PageEditor({ title, docs, previewPath, children }: PageEditorProps) {
  const { toast } = useToast()

  const [contents, setContents] = useState<Record<string, any>>(() =>
    Object.fromEntries(docs.map((doc) => [doc.id, doc.defaults]))
  )
  const [dirtyDocs, setDirtyDocs] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const modalIframeRef = useRef<HTMLIFrameElement | null>(null)

  const dirty = dirtyDocs.size > 0
  // `docs` est recréé à chaque rendu par la page appelante : on stabilise la
  // liste d'identifiants pour ne pas réabonner les écouteurs à chaque frappe.
  const docIdsKey = docs.map((doc) => doc.id).join('|')
  const docIds = useMemo(() => docIdsKey.split('|'), [docIdsKey])
  const primaryId = docIds[0]

  const path = previewPath ?? previewPaths[primaryId]
  const previewSrc = path
    ? (() => {
        const [base, hash] = path.split('#')
        const sep = base.includes('?') ? '&' : '?'
        return `${base}${sep}preview=1${hash ? `#${hash}` : ''}`
      })()
    : ''

  // Garde la dernière valeur accessible au handler sans le ré-abonner à chaque frappe
  const contentsRef = useRef(contents)
  useEffect(() => {
    contentsRef.current = contents
  }, [contents])

  // Répond à n'importe quelle iframe d'aperçu qui s'annonce prête, pour
  // n'importe lequel des documents pilotés par cette page.
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const msg = event.data
      if (msg && msg.type === 'preview-ready' && docIds.includes(msg.pageId)) {
        const source = event.source as WindowProxy | null
        source?.postMessage(
          { type: 'preview-content', pageId: msg.pageId, content: contentsRef.current[msg.pageId] },
          '*'
        )
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [docIds])

  // Pousse les modifications vers l'aperçu quand il est ouvert
  useEffect(() => {
    if (!previewOpen) return
    for (const id of docIds) {
      modalIframeRef.current?.contentWindow?.postMessage(
        { type: 'preview-content', pageId: id, content: contents[id] },
        '*'
      )
    }
  }, [contents, docIds, previewOpen])

  useEffect(() => {
    const load = async () => {
      try {
        const results = await Promise.all(
          docs.map(async (doc) => {
            const response = await fetch(`/api/content/${doc.id}`)
            const result = await response.json().catch(() => ({}))
            const stored = result?.content
            return [
              doc.id,
              stored && Object.keys(stored).length > 0
                ? { ...doc.defaults, ...stored }
                : doc.defaults,
            ] as const
          })
        )
        setContents(Object.fromEntries(results))
      } catch (error) {
        console.error('Failed to load content:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Avertir avant de quitter si modifications non enregistrées
  useEffect(() => {
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const setValue = useCallback((docId: string, fieldPath: string, value: unknown) => {
    setSaved(false)
    setDirtyDocs((prev) => (prev.has(docId) ? prev : new Set(prev).add(docId)))
    setContents((prev) => ({
      ...prev,
      [docId]: writePath(prev[docId] ?? {}, fieldPath, value),
    }))
  }, [])

  const edit = useCallback<Edit>(
    (docId: string) => ({
      content: contents[docId] ?? {},
      value: (fieldPath: string) => readPath(contents[docId], fieldPath),
      set: (fieldPath: string, value: unknown) => setValue(docId, fieldPath, value),
      setter: (fieldPath: string) => (value: any) => setValue(docId, fieldPath, value),
    }),
    [contents, setValue]
  )

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('authToken')
      const targets = [...dirtyDocs]

      const responses = await Promise.all(
        targets.map((id) =>
          fetch(`/api/content/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content: contents[id] }),
          })
        )
      )

      if (responses.every((response) => response.ok)) {
        setSaved(true)
        setDirtyDocs(new Set())
        toast.success('Modifications enregistrées')
        setTimeout(() => setSaved(false), 3000)
      } else {
        toast.error('Erreur lors de la sauvegarde')
      }
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <AdminLoading />
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Barre d'actions, toujours visible pendant le défilement */}
      <div className="sticky top-0 z-20 -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-8 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-3.5 bg-background/80 backdrop-blur border-b border-border mb-6">
        <div className="flex items-center justify-between max-w-3xl mx-auto pt-8 md:pt-0">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-4" />
              </Link>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold text-foreground">{title}</h1>
                <p className="flex items-center gap-1.5 text-[11px] font-medium">
                  {dirty ? (
                    <>
                      <span className="size-1.5 rounded-full bg-primary" />
                      <span className="text-primary">Modifications non enregistrées</span>
                    </>
                  ) : (
                    <>
                      <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                      <span className="text-muted-foreground">À jour</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {path && (
                <Button onClick={() => setPreviewOpen(true)} variant="outline" size="sm">
                  <Eye className="size-3.5" />
                  <span className="hidden sm:inline">Aperçu</span>
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={saving || !dirty}
                size="sm"
              >
                {saved ? (
                  <>
                    <Check className="size-3.5" />
                    Sauvegardé
                  </>
                ) : (
                  <>
                    <Save className="size-3.5" />
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

      {/* Une seule carte : toutes les sections de la page, à la suite */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        {children(edit)}
      </motion.div>

        {previewOpen && path && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex flex-col p-3 sm:p-4"
          onClick={() => setPreviewOpen(false)}
        >
            <div
              className="relative w-full h-full bg-zinc-100 rounded-xl shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border/40 bg-white">
                <div className="flex items-center gap-2 text-xs text-muted-foreground truncate min-w-0">
                  <Eye className="size-3.5 shrink-0" />
                  <span className="font-medium">Aperçu</span>
                  <span className="truncate hidden sm:inline">{path}</span>
                </div>

                <div className="flex items-center gap-1 rounded-lg bg-muted/60 p-0.5">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    title="Ordinateur"
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                      previewDevice === 'desktop'
                        ? 'bg-white text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Monitor className="size-3.5" />
                    <span className="hidden sm:inline">Ordinateur</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    title="Mobile"
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                      previewDevice === 'mobile'
                        ? 'bg-white text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Smartphone className="size-3.5" />
                    <span className="hidden sm:inline">Mobile</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <a
                    href={path}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ouvrir dans un onglet"
                    className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                  <button
                    onClick={() => setPreviewOpen(false)}
                    title="Fermer"
                    className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto flex items-start justify-center p-4 sm:p-6">
                <div
                  className={cn(
                    'bg-white shadow-lg transition-all duration-300 overflow-hidden',
                    previewDevice === 'mobile'
                      ? 'w-[390px] h-[780px] max-w-full max-h-full rounded-[28px] border-[10px] border-zinc-900'
                      : 'w-full h-full rounded-md'
                  )}
                >
                  <iframe
                    ref={modalIframeRef}
                    src={previewSrc}
                    className="w-full h-full bg-white"
                    title="Aperçu de la page"
                  />
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  )
}
