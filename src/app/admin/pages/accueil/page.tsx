'use client'

import { PageEditor } from '@/components/admin/page-editor'
import { FieldEditor, SectionEditor, ImageField } from '@/components/admin/field-editor'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, ChevronUp, ChevronDown, Sparkles, BookOpen, Megaphone } from 'lucide-react'
import { heroContent, storyContent, ctaContent } from '@/lib/site-content'

// Les valeurs par défaut de l'admin viennent du MÊME contenu que le front
// (site-content.ts). Ainsi l'éditrice voit son vrai contenu, et enregistrer une
// page ne l'écrase pas avec du texte de template.
const defaults = {
  hero: {
    eyebrow: heroContent.eyebrow,
    title: heroContent.title,
    description: heroContent.description,
    button1: heroContent.button1,
    button2: heroContent.button2,
    images: heroContent.images,
  },
  story: {
    eyebrow: storyContent.eyebrow,
    title: storyContent.title,
    paragraph1: storyContent.paragraph1,
    paragraph2: storyContent.paragraph2,
    image: storyContent.image,
  },
  cta: {
    eyebrow: ctaContent.eyebrow,
    title: ctaContent.title,
    description: ctaContent.description,
    button: ctaContent.button,
  },
}

export default function AdminHomePage() {
  return (
    <PageEditor pageId="home" title="Page d'accueil" defaultContent={defaults}>
      {(content, update) => (
        <>
          <SectionEditor title="Hero" icon={Sparkles} description="Grande bannière en haut de la page">
            <FieldEditor label="Accroche" value={content.hero?.eyebrow} onChange={(v) => update('hero.eyebrow', v)} />
            <FieldEditor label="Titre principal" value={content.hero?.title} onChange={(v) => update('hero.title', v)} />
            <FieldEditor label="Description" value={content.hero?.description} onChange={(v) => update('hero.description', v)} type="textarea" />
            <FieldEditor label="Bouton 1" value={content.hero?.button1} onChange={(v) => update('hero.button1', v)} />
            <FieldEditor label="Bouton 2" value={content.hero?.button2} onChange={(v) => update('hero.button2', v)} />
            <div className="space-y-3 pt-2 md:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Images du slider</p>
              {content.hero?.images?.map((img: string, i: number) => {
                const images: string[] = content.hero?.images || []
                const setImages = (next: string[]) => update('hero.images', next)
                return (
                  <div key={i} className="rounded-xl border border-border/50 bg-muted/20 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground/70">Image {i + 1}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          title="Monter"
                          disabled={i === 0}
                          onClick={() => {
                            const next = [...images]
                            ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
                            setImages(next)
                          }}
                          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-card hover:text-foreground disabled:opacity-30"
                        >
                          <ChevronUp className="size-4" />
                        </button>
                        <button
                          type="button"
                          title="Descendre"
                          disabled={i === images.length - 1}
                          onClick={() => {
                            const next = [...images]
                            ;[next[i + 1], next[i]] = [next[i], next[i + 1]]
                            setImages(next)
                          }}
                          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-card hover:text-foreground disabled:opacity-30"
                        >
                          <ChevronDown className="size-4" />
                        </button>
                        <button
                          type="button"
                          title="Supprimer l'image"
                          onClick={() => setImages(images.filter((_, j) => j !== i))}
                          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                    <ImageField
                      value={img}
                      onChange={(v) => {
                        const next = [...images]
                        next[i] = v
                        setImages(next)
                      }}
                    />
                  </div>
                )
              })}
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => update('hero.images', [...(content.hero?.images || []), ''])}
              >
                <Plus className="size-4" />
                Ajouter une image
              </Button>
            </div>
          </SectionEditor>

          <SectionEditor title="Notre histoire" icon={BookOpen} description="Texte de présentation et image">
            <FieldEditor label="Accroche" value={content.story?.eyebrow} onChange={(v) => update('story.eyebrow', v)} />
            <FieldEditor label="Titre" value={content.story?.title} onChange={(v) => update('story.title', v)} />
            <FieldEditor label="Paragraphe 1" value={content.story?.paragraph1} onChange={(v) => update('story.paragraph1', v)} type="textarea" />
            <FieldEditor label="Paragraphe 2" value={content.story?.paragraph2} onChange={(v) => update('story.paragraph2', v)} type="textarea" />
            <ImageField label="Image" value={content.story?.image} onChange={(v) => update('story.image', v)} />
          </SectionEditor>

          <SectionEditor title="Appel à l'action (CTA)" icon={Megaphone} description="Bloc d'incitation à vous contacter">
            <FieldEditor label="Accroche" value={content.cta?.eyebrow} onChange={(v) => update('cta.eyebrow', v)} />
            <FieldEditor label="Titre" value={content.cta?.title} onChange={(v) => update('cta.title', v)} />
            <FieldEditor label="Description" value={content.cta?.description} onChange={(v) => update('cta.description', v)} type="textarea" />
            <FieldEditor label="Bouton" value={content.cta?.button} onChange={(v) => update('cta.button', v)} />
          </SectionEditor>
        </>
      )}
    </PageEditor>
  )
}
