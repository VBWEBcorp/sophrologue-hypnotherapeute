'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'
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
  ChevronsDownUp,
  ChevronsUpDown,
  Maximize2,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/admin/toast'
import { AdminLoading } from '@/components/admin/admin-ui'
import { cn } from '@/lib/utils'

interface PageEditorProps {
  pageId: string
  title: string
  defaultContent: Record<string, any>
  children: (
    content: Record<string, any>,
    updateField: (path: string, value: any) => void
  ) => React.ReactNode
}

const previewPaths: Record<string, string> = {
  home: '/',
  about: '/a-propos',
  services: '/services',
  contact: '/contact',
  testimonials: '/#temoignages',
}

/* ── Repli/dépli global des sections ────────────────────────── */
const ExpandContext = createContext<boolean>(true)

export function useSectionsExpanded() {
  return useContext(ExpandContext)
}

export function PageEditor({ pageId, title, defaultContent, children }: PageEditorProps) {
  const { toast } = useToast()
  const [content, setContent] = useState(defaultContent)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [loading, setLoading] = useState(true)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const modalIframeRef = useRef<HTMLIFrameElement | null>(null)
  const railIframeRef = useRef<HTMLIFrameElement | null>(null)

  // Repli/dépli global des sections (un seul toggle en haut)
  const [expanded, setExpanded] = useState(true)

  const previewPath = previewPaths[pageId]
  const previewSrc = previewPath
    ? (() => {
        const [path, hash] = previewPath.split('#')
        const sep = path.includes('?') ? '&' : '?'
        return `${path}${sep}preview=${encodeURIComponent(pageId)}${hash ? `#${hash}` : ''}`
      })()
    : ''

  // Garde la dernière valeur de `content` accessible au handler sans le ré-abonner à chaque frappe
  const contentRef = useRef(content)
  useEffect(() => {
    contentRef.current = content
  }, [content])

  // Répond à n'importe quelle iframe d'aperçu (rail ou modale) qui s'annonce prête
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const msg = event.data
      if (msg && msg.type === 'preview-ready' && msg.pageId === pageId) {
        const source = event.source as WindowProxy | null
        source?.postMessage(
          { type: 'preview-content', pageId, content: contentRef.current },
          '*'
        )
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [pageId])

  // Pousse les modifications en direct vers les aperçus montés (rail + modale)
  useEffect(() => {
    const payload = { type: 'preview-content', pageId, content }
    railIframeRef.current?.contentWindow?.postMessage(payload, '*')
    modalIframeRef.current?.contentWindow?.postMessage(payload, '*')
  }, [content, pageId])

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/content/${pageId}`)
        const result = await response.json()

        if (result.content && Object.keys(result.content).length > 0) {
          setContent({ ...defaultContent, ...result.content })
        }
      } catch (error) {
        console.error('Failed to load content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId])

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

  const updateField = useCallback((path: string, value: any) => {
    setSaved(false)
    setDirty(true)
    setContent((prev) => {
      const keys = path.split('.')
      const newContent = JSON.parse(JSON.stringify(prev))
      let obj = newContent
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in obj)) obj[keys[i]] = {}
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
      return newContent
    })
  }, [])

  const reloadRail = () => {
    const frame = railIframeRef.current
    if (frame) frame.src = previewSrc
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`/api/content/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        setSaved(true)
        setDirty(false)
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
    <ExpandContext.Provider value={expanded}>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header sticky */}
        <div className="sticky top-0 z-20 -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-8 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-3.5 bg-background/80 backdrop-blur border-b border-border mb-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto pt-8 md:pt-0">
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
                      <span className="size-1.5 rounded-full bg-amber-500" />
                      <span className="text-amber-600">Modifications non enregistrées</span>
                    </>
                  ) : (
                    <>
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground">À jour</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button onClick={() => setExpanded((v) => !v)} variant="outline" size="sm">
                {expanded ? <ChevronsDownUp className="size-3.5" /> : <ChevronsUpDown className="size-3.5" />}
                <span className="hidden sm:inline">{expanded ? 'Tout replier' : 'Tout déplier'}</span>
              </Button>
              {previewPath && (
                <Button onClick={() => setPreviewOpen(true)} variant="outline" size="sm">
                  <Eye className="size-3.5" />
                  <span className="hidden sm:inline">Aperçu</span>
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={saving || !dirty}
                size="sm"
                className={saved ? 'bg-emerald-600 hover:bg-emerald-600' : ''}
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

        {/* Layout 2 colonnes : éditeur + aperçu live sticky */}
        <div
          className={cn(
            'mx-auto grid max-w-6xl items-start gap-6',
            previewPath
              ? 'lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_440px]'
              : 'max-w-3xl'
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-w-0 space-y-3"
          >
            {children(content, updateField)}
          </motion.div>

          {previewPath && (
            <aside className="sticky top-[92px] hidden lg:block">
              <div className="flex h-[calc(100vh-7.5rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                {/* En-tête du rail */}
                <div className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="relative flex size-2 shrink-0">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/60" />
                      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                    </span>
                    <span className="truncate text-xs font-semibold text-foreground">Aperçu en direct</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={reloadRail}
                      title="Recharger l'aperçu"
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <RefreshCw className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      title="Plein écran"
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Maximize2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Iframe live */}
                <div className="relative flex-1 bg-white">
                  <iframe
                    ref={railIframeRef}
                    src={previewSrc}
                    className="absolute inset-0 size-full"
                    title="Aperçu en direct de la page"
                  />
                </div>
              </div>
            </aside>
          )}
        </div>

        {previewOpen && previewPath && (
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
                  <span className="truncate hidden sm:inline">{previewPath}</span>
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
                    href={previewPath}
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
    </ExpandContext.Provider>
  )
}
