'use client'

import Link from 'next/link'
import { Sparkles, BarChart3, Briefcase, Megaphone, ArrowUpRight } from 'lucide-react'

import { PageEditor } from '@/components/admin/page-editor'
import {
  FieldEditor,
  SectionEditor,
  ImageField,
  RepeatableList,
} from '@/components/admin/field-editor'
import { servicesContent } from '@/lib/site-content'

// Sections dans l'ordre d'affichage de la page /services.
// `hero.image` vide = l'image de fond par défaut du code est conservée.
const defaults = {
  hero: { ...servicesContent.hero, image: '' },
  kpis: servicesContent.kpis,
  services: servicesContent.list,
}

type Service = {
  title: string
  description: string
  points?: string[]
  image?: string
}

export default function AdminServicesPage() {
  return (
    <PageEditor
      title="Page Séances"
      previewPath="/services"
      docs={[{ id: 'services', defaults }]}
    >
      {(edit) => {
        const services = edit('services')
        const list = (services.value('services') as Service[]) ?? []

        return (
          <>
            {/* 1 ────────────────────────────────────────────────── Bannière */}
            <SectionEditor
              step={1}
              title="Bannière"
              icon={Sparkles}
              description="Titre et image de fond en haut de la page"
            >
              <FieldEditor label="Accroche" value={services.value('hero.eyebrow')} onChange={services.setter('hero.eyebrow')} />
              <FieldEditor label="Titre" value={services.value('hero.title')} onChange={services.setter('hero.title')} />
              <FieldEditor label="Description" type="textarea" value={services.value('hero.description')} onChange={services.setter('hero.description')} />
              <ImageField label="Image de fond" value={services.value('hero.image')} onChange={services.setter('hero.image')} />
              <p className="text-[11px] text-muted-foreground md:col-span-2">
                Cette image s&apos;affiche en plein écran : privilégiez une photo large et nette.
                Laissée vide, l&apos;image d&apos;origine est conservée.
              </p>
            </SectionEditor>

            {/* 2 ────────────────────────────────────────────── Chiffres clés */}
            <SectionEditor
              step={2}
              title="Chiffres clés"
              icon={BarChart3}
              description="La ligne tarif / durée / cabinets sous le titre"
              cols={1}
            >
              <RepeatableList
                itemLabel="Chiffre"
                addLabel="Ajouter un chiffre"
                items={services.value('kpis') as { value: string; label: string }[]}
                onChange={services.setter('kpis')}
                newItem={() => ({ value: '', label: '' })}
                renderItem={(item, _i, patch) => (
                  <>
                    <FieldEditor label="Valeur" value={item.value} onChange={(v) => patch({ value: v })} placeholder="dès 45 €" />
                    <FieldEditor label="Légende" value={item.label} onChange={(v) => patch({ label: v })} placeholder="la séance" />
                  </>
                )}
              />
            </SectionEditor>

            {/* 3 ──────────────────────────────────────── Les accompagnements */}
            <SectionEditor
              step={3}
              title="Les accompagnements"
              icon={Briefcase}
              description={`${list.length} blocs, chacun avec son texte et sa photo`}
              cols={1}
            >
              <RepeatableList
                itemLabel="Accompagnement"
                addLabel="Ajouter un accompagnement"
                items={list}
                onChange={services.setter('services')}
                newItem={() => ({ title: '', description: '', points: [], image: '' })}
                renderItem={(service, index, patch) => (
                  <>
                    <FieldEditor label="Titre" wide value={service.title} onChange={(v) => patch({ title: v })} />
                    <FieldEditor label="Description" type="textarea" value={service.description} onChange={(v) => patch({ description: v })} />
                    <ImageField
                      label="Photo"
                      value={service.image ?? ''}
                      onChange={(v) => patch({ image: v })}
                    />

                    <div className="md:col-span-2">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Points clés
                      </p>
                      <RepeatableList
                        itemLabel="Point"
                        addLabel="Ajouter un point"
                        items={service.points}
                        onChange={(next) => patch({ points: next })}
                        newItem={() => ''}
                        renderItem={(point: string, pointIndex) => (
                          <FieldEditor
                            label={`Point ${pointIndex + 1}`}
                            wide
                            value={point}
                            onChange={(v) => {
                              const next = [...(list[index]?.points ?? [])]
                              next[pointIndex] = v
                              patch({ points: next })
                            }}
                          />
                        )}
                      />
                    </div>
                  </>
                )}
              />
            </SectionEditor>

            {/* 4 ────────────────────────────────────── Appel à l'action (lien) */}
            <SectionEditor
              step={4}
              title="Appel à l'action"
              icon={Megaphone}
              description="Le bloc de prise de rendez-vous en bas de page"
            >
              <div className="md:col-span-2 rounded-xl border border-border/60 bg-muted/25 p-4">
                <p className="text-[13px] text-foreground">Ce bloc est commun à plusieurs pages.</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Il se modifie depuis la page d&apos;accueil, section « Appel à l&apos;action ».
                </p>
                <Link
                  href="/admin/pages/accueil"
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Ouvrir la page d&apos;accueil
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </SectionEditor>
          </>
        )
      }}
    </PageEditor>
  )
}
