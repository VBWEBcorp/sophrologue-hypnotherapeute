'use client'

import Link from 'next/link'
import { Sparkles, BarChart3, Gem, Images, Megaphone, ArrowUpRight } from 'lucide-react'

import { PageEditor } from '@/components/admin/page-editor'
import {
  FieldEditor,
  SectionEditor,
  ImageField,
  RepeatableList,
} from '@/components/admin/field-editor'
import { aboutContent } from '@/lib/site-content'

// Sections dans l'ordre d'affichage de la page /a-propos.
const defaults = {
  hero: aboutContent.hero,
  stats: aboutContent.stats,
  values: aboutContent.values,
  gallery: aboutContent.gallery,
}

export default function AdminAboutPage() {
  return (
    <PageEditor
      title="Page À propos"
      previewPath="/a-propos"
      docs={[{ id: 'about', defaults }]}
    >
      {(edit) => {
        const about = edit('about')

        return (
          <>
            {/* 1 ────────────────────────────────────────────────── Bannière */}
            <SectionEditor
              step={1}
              title="Bannière"
              icon={Sparkles}
              description="Titre, texte de présentation et portrait"
            >
              <FieldEditor label="Accroche" value={about.value('hero.eyebrow')} onChange={about.setter('hero.eyebrow')} />
              <FieldEditor label="Titre" value={about.value('hero.title')} onChange={about.setter('hero.title')} />
              <FieldEditor label="Description" type="textarea" value={about.value('hero.description')} onChange={about.setter('hero.description')} />
              <ImageField label="Portrait" value={about.value('hero.image')} onChange={about.setter('hero.image')} />
            </SectionEditor>

            {/* 2 ─────────────────────────────────────────────── Chiffres clés */}
            <SectionEditor
              step={2}
              title="Chiffres clés"
              icon={BarChart3}
              description="Les 4 encarts sous le texte de la bannière"
              cols={1}
            >
              <RepeatableList
                itemLabel="Chiffre"
                addLabel="Ajouter un chiffre"
                items={about.value('stats') as { value: string; label: string }[]}
                onChange={about.setter('stats')}
                newItem={() => ({ value: '', label: '' })}
                renderItem={(item, _i, patch) => (
                  <>
                    <FieldEditor label="Valeur" value={item.value} onChange={(v) => patch({ value: v })} placeholder="20 ans" />
                    <FieldEditor label="Légende" value={item.label} onChange={(v) => patch({ label: v })} placeholder="D'expérience" />
                  </>
                )}
              />
            </SectionEditor>

            {/* 3 ─────────────────────────────────────────────── Ma pratique */}
            <SectionEditor
              step={3}
              title="Ce qui guide mon accompagnement"
              icon={Gem}
              description="Les blocs présentés en frise verticale"
              cols={1}
            >
              <RepeatableList
                itemLabel="Bloc"
                addLabel="Ajouter un bloc"
                items={about.value('values') as { title: string; description: string }[]}
                onChange={about.setter('values')}
                newItem={() => ({ title: '', description: '' })}
                renderItem={(item, _i, patch) => (
                  <>
                    <FieldEditor label="Titre" wide value={item.title} onChange={(v) => patch({ title: v })} />
                    <FieldEditor label="Texte" type="textarea" value={item.description} onChange={(v) => patch({ description: v })} />
                  </>
                )}
              />
            </SectionEditor>

            {/* 4 ────────────────────────────────────────────── Bandeau photos */}
            <SectionEditor
              step={4}
              title="Bandeau photos"
              icon={Images}
              description="La rangée de photos avant le bloc de rendez-vous"
              cols={1}
            >
              <RepeatableList
                itemLabel="Photo"
                addLabel="Ajouter une photo"
                items={about.value('gallery') as string[]}
                onChange={about.setter('gallery')}
                newItem={() => ''}
                renderItem={(src: string, i) => (
                  <ImageField
                    value={src}
                    onChange={(v) => {
                      const next = [...((about.value('gallery') as string[]) ?? [])]
                      next[i] = v
                      about.set('gallery', next)
                    }}
                  />
                )}
              />
              <p className="text-[11px] text-muted-foreground">
                Sans photo, le bandeau disparaît de la page.
              </p>
            </SectionEditor>

            {/* 5 ────────────────────────────────────── Appel à l'action (lien) */}
            <SectionEditor
              step={5}
              title="Appel à l'action"
              icon={Megaphone}
              description="Le bloc de prise de rendez-vous en bas de page"
            >
              <div className="md:col-span-2 rounded-xl border border-border/60 bg-muted/25 p-4">
                <p className="text-[13px] text-foreground">
                  Ce bloc est commun à plusieurs pages.
                </p>
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
