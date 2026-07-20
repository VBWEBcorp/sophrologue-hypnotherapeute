'use client'

import { PageEditor } from '@/components/admin/page-editor'
import { FieldEditor, SectionEditor, ImageField } from '@/components/admin/field-editor'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Sparkles, Briefcase } from 'lucide-react'
import { servicesContent } from '@/lib/site-content'

// Défauts alignés sur le vrai contenu du front (site-content.ts) — voir accueil.
// `image: ''` laisse la page utiliser l'image d'illustration par défaut.
const defaults = {
  hero: { ...servicesContent.hero, image: '' },
  services: servicesContent.list,
}

export default function AdminServicesPage() {
  return (
    <PageEditor pageId="services" title="Page Services" defaultContent={defaults}>
      {(content, update) => (
        <>
          <SectionEditor title="Hero" icon={Sparkles} description="Bannière en haut de la page">
            <FieldEditor label="Accroche" value={content.hero?.eyebrow} onChange={(v) => update('hero.eyebrow', v)} />
            <FieldEditor label="Titre" value={content.hero?.title} onChange={(v) => update('hero.title', v)} />
            <FieldEditor label="Description" value={content.hero?.description} onChange={(v) => update('hero.description', v)} type="textarea" />
            <ImageField label="Image" value={content.hero?.image} onChange={(v) => update('hero.image', v)} />
          </SectionEditor>

          <SectionEditor title="Liste des services" cols={1} icon={Briefcase} description="Les prestations affichées sur le site">
            {content.services?.map((svc: any, i: number) => (
              <div key={i} className="p-4 border border-border/30 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Service {i + 1}</span>
                  <button
                    onClick={() => {
                      const newServices = content.services.filter((_: any, j: number) => j !== i)
                      update('services', newServices)
                    }}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <FieldEditor label="Titre" value={svc.title} onChange={(v) => {
                  const newServices = [...content.services]
                  newServices[i] = { ...newServices[i], title: v }
                  update('services', newServices)
                }} />
                <FieldEditor label="Description" value={svc.description} onChange={(v) => {
                  const newServices = [...content.services]
                  newServices[i] = { ...newServices[i], description: v }
                  update('services', newServices)
                }} type="textarea" />
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                update('services', [...(content.services || []), { title: '', description: '' }])
              }}
            >
              <Plus className="size-4" />
              Ajouter un service
            </Button>
          </SectionEditor>
        </>
      )}
    </PageEditor>
  )
}
