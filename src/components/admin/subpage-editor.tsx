'use client'

import { LayoutTemplate, AlignLeft, Plus, Trash2 } from 'lucide-react'

import { PageEditor } from '@/components/admin/page-editor'
import { FieldEditor, SectionEditor, ImageField } from '@/components/admin/field-editor'
import { Button } from '@/components/ui/button'
import { subpages, type SubpageSection } from '@/lib/subpages'

type Update = (path: string, value: unknown) => void

const KIND_LABEL: Record<string, string> = {
  prose: 'Texte',
  split: 'Texte + image',
  features: 'Blocs',
  checklist: 'Liste à puces',
  timeline: 'Étapes',
  highlight: 'Encart',
  pricing: 'Tarifs',
  cabinets: 'Cabinets',
}

/** Liste de textes (paragraphes, puces…) : édition, ajout, suppression. */
function StringList({
  itemLabel,
  items,
  path,
  update,
  textarea,
}: {
  itemLabel: string
  items?: string[]
  path: string
  update: Update
  textarea?: boolean
}) {
  const arr = items ?? []
  return (
    <div className="space-y-3 md:col-span-2">
      {arr.map((val, j) => (
        <div key={j} className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <FieldEditor
              label={`${itemLabel} ${j + 1}`}
              value={val}
              type={textarea ? 'textarea' : 'text'}
              onChange={(v) => {
                const next = [...arr]
                next[j] = v
                update(path, next)
              }}
            />
          </div>
          <button
            type="button"
            title="Supprimer"
            onClick={() => update(path, arr.filter((_, k) => k !== j))}
            className="mb-1.5 shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" className="w-full gap-2" onClick={() => update(path, [...arr, ''])}>
        <Plus className="size-4" /> Ajouter
      </Button>
    </div>
  )
}

/** Carte d'édition d'un item objet (bloc, étape, tarif, cabinet). */
function ItemCard({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <div className="space-y-2 rounded-xl border border-border/40 bg-muted/20 p-3 md:col-span-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Bloc {index + 1}</p>
      {children}
    </div>
  )
}

/** Champs spécifiques à chaque type de section. */
function KindFields({ section, base, update }: { section: SubpageSection; base: string; update: Update }) {
  const setItem = (items: unknown[], j: number, patch: Record<string, unknown>) => {
    const next = items.map((it, k) => (k === j ? { ...(it as object), ...patch } : it))
    update(`${base}.items`, next)
  }

  switch (section.kind) {
    case 'prose':
    case 'highlight':
      return <StringList itemLabel="Paragraphe" items={section.paragraphs} path={`${base}.paragraphs`} update={update} textarea />

    case 'split':
      return (
        <>
          <StringList itemLabel="Paragraphe" items={section.paragraphs} path={`${base}.paragraphs`} update={update} textarea />
          <ImageField label="Image" value={section.image} onChange={(v) => update(`${base}.image`, v)} />
          <StringList itemLabel="Puce" items={section.bullets} path={`${base}.bullets`} update={update} />
        </>
      )

    case 'checklist':
      return (
        <>
          <FieldEditor label="Description" value={section.description ?? ''} type="textarea" onChange={(v) => update(`${base}.description`, v)} />
          <StringList itemLabel="Élément" items={section.items} path={`${base}.items`} update={update} />
        </>
      )

    case 'features':
      return (
        <>
          <FieldEditor label="Description" value={section.description ?? ''} type="textarea" onChange={(v) => update(`${base}.description`, v)} />
          {section.items.map((it, j) => (
            <ItemCard key={j} index={j}>
              <FieldEditor label="Titre" value={it.title} onChange={(v) => setItem(section.items, j, { title: v })} />
              <FieldEditor label="Texte" value={it.desc} type="textarea" onChange={(v) => setItem(section.items, j, { desc: v })} />
              {it.href !== undefined && (
                <FieldEditor label="Lien du bloc" type="url" value={it.href} onChange={(v) => setItem(section.items, j, { href: v })} />
              )}
            </ItemCard>
          ))}
        </>
      )

    case 'timeline':
      return (
        <>
          <FieldEditor label="Description" value={section.description ?? ''} type="textarea" onChange={(v) => update(`${base}.description`, v)} />
          {section.steps.map((s, j) => (
            <ItemCard key={j} index={j}>
              <FieldEditor label="Titre" value={s.title} onChange={(v) => {
                const next = section.steps.map((st, k) => (k === j ? { ...st, title: v } : st))
                update(`${base}.steps`, next)
              }} />
              <FieldEditor label="Texte" value={s.desc} type="textarea" onChange={(v) => {
                const next = section.steps.map((st, k) => (k === j ? { ...st, desc: v } : st))
                update(`${base}.steps`, next)
              }} />
            </ItemCard>
          ))}
        </>
      )

    case 'pricing':
      return (
        <>
          <FieldEditor label="Description" value={section.description ?? ''} type="textarea" onChange={(v) => update(`${base}.description`, v)} />
          {section.items.map((it, j) => (
            <ItemCard key={j} index={j}>
              <FieldEditor label="Prix" value={it.price} onChange={(v) => setItem(section.items, j, { price: v })} />
              <FieldEditor label="Intitulé" value={it.label} onChange={(v) => setItem(section.items, j, { label: v })} />
              <FieldEditor label="Précision" value={it.note ?? ''} onChange={(v) => setItem(section.items, j, { note: v })} />
            </ItemCard>
          ))}
        </>
      )

    case 'cabinets':
      return (
        <>
          <FieldEditor label="Description" value={section.description ?? ''} type="textarea" onChange={(v) => update(`${base}.description`, v)} />
          {section.items.map((it, j) => (
            <ItemCard key={j} index={j}>
              <FieldEditor label="Nom" value={it.name} onChange={(v) => setItem(section.items, j, { name: v })} />
              <FieldEditor label="Adresse" value={it.address} onChange={(v) => setItem(section.items, j, { address: v })} />
              <FieldEditor label="Note" value={it.note ?? ''} type="textarea" onChange={(v) => setItem(section.items, j, { note: v })} />
              <FieldEditor label="Libellé du bouton de réservation" value={it.bookingLabel ?? ''} onChange={(v) => setItem(section.items, j, { bookingLabel: v })} placeholder="Réserver sur RESALIB" />
              <FieldEditor label="Lien de réservation" type="url" value={it.bookingUrl ?? ''} onChange={(v) => setItem(section.items, j, { bookingUrl: v })} placeholder="https://..." />
            </ItemCard>
          ))}
        </>
      )
  }
}

export function SubpageEditor({ slug }: { slug: string }) {
  const data = subpages[slug]

  if (!data) {
    return <div className="p-8 text-sm text-muted-foreground">Page « {slug} » introuvable.</div>
  }

  const docId = `sub-${slug}`

  return (
    <PageEditor
      title={`Page : ${data.hero.breadcrumb}`}
      docs={[{ id: docId, defaults: { subpage: data } }]}
    >
      {(edit) => {
        const doc = edit(docId)
        const update: Update = (path, value) => doc.set(path, value)
        const sp = (doc.content.subpage ?? data) as typeof data
        const sections: SubpageSection[] = sp.sections ?? []

        // Les sections sont listées dans l'ordre exact d'affichage de la page.
        return (
          <>
            <SectionEditor
              step={1}
              title="Bannière"
              icon={LayoutTemplate}
              description="Titre et image de fond en haut de la page"
            >
              <FieldEditor label="Accroche" value={sp.hero?.eyebrow ?? ''} onChange={(v) => update('subpage.hero.eyebrow', v)} />
              <FieldEditor label="Titre" value={sp.hero?.title ?? ''} onChange={(v) => update('subpage.hero.title', v)} />
              <FieldEditor label="Description" value={sp.hero?.description ?? ''} type="textarea" onChange={(v) => update('subpage.hero.description', v)} />
              <ImageField label="Image de fond" value={sp.hero?.backgroundImage ?? ''} onChange={(v) => update('subpage.hero.backgroundImage', v)} />
              <p className="text-[11px] text-muted-foreground md:col-span-2">
                Cette image s&apos;affiche en plein écran : privilégiez une photo large et nette.
              </p>
            </SectionEditor>

            {sections.map((section, i) => (
              <SectionEditor
                key={i}
                step={i + 2}
                title={section.title || `Section ${i + 1}`}
                icon={AlignLeft}
                description={KIND_LABEL[section.kind] ?? 'Section'}
              >
                <FieldEditor label="Accroche" value={section.eyebrow ?? ''} onChange={(v) => update(`subpage.sections.${i}.eyebrow`, v)} />
                <FieldEditor label="Titre" value={section.title} onChange={(v) => update(`subpage.sections.${i}.title`, v)} />
                <KindFields section={section} base={`subpage.sections.${i}`} update={update} />
              </SectionEditor>
            ))}
          </>
        )
      }}
    </PageEditor>
  )
}
