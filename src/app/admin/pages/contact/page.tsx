'use client'

import { Sparkles, CalendarCheck, Phone, MapPin } from 'lucide-react'

import { PageEditor } from '@/components/admin/page-editor'
import {
  FieldEditor,
  SectionEditor,
  ImageField,
  RepeatableList,
} from '@/components/admin/field-editor'
import { contactContent } from '@/lib/site-content'
import { siteConfig } from '@/lib/seo'

// Sections dans l'ordre d'affichage de la page /contact.
// Le téléphone et l'e-mail ne figurent pas ici : ils sont utilisés partout sur
// le site et dans les données structurées, donc pilotés par siteConfig (seo.ts).
const defaults = {
  hero: { ...contactContent.hero, image: '' },
  booking: contactContent.booking,
  cabinets: contactContent.cabinets,
}

export default function AdminContactPage() {
  return (
    <PageEditor
      title="Page Contact"
      previewPath="/contact"
      docs={[{ id: 'contact', defaults }]}
    >
      {(edit) => {
        const contact = edit('contact')

        return (
          <>
            {/* 1 ────────────────────────────────────────────────── Bannière */}
            <SectionEditor
              step={1}
              title="Bannière"
              icon={Sparkles}
              description="Titre et image de fond en haut de la page"
            >
              <FieldEditor label="Accroche" value={contact.value('hero.eyebrow')} onChange={contact.setter('hero.eyebrow')} />
              <FieldEditor label="Titre" value={contact.value('hero.title')} onChange={contact.setter('hero.title')} />
              <FieldEditor label="Description" type="textarea" value={contact.value('hero.description')} onChange={contact.setter('hero.description')} />
              <ImageField label="Image de fond" value={contact.value('hero.image')} onChange={contact.setter('hero.image')} />
              <p className="text-[11px] text-muted-foreground md:col-span-2">
                Laissée vide, l&apos;image d&apos;origine est conservée.
              </p>
            </SectionEditor>

            {/* 2 ──────────────────────────────────────── Réservation en ligne */}
            <SectionEditor
              step={2}
              title="Réservation en ligne"
              icon={CalendarCheck}
              description="Les boutons RESALIB et MEDOUCINE, dans la colonne de droite"
              cols={1}
            >
              <RepeatableList
                itemLabel="Plateforme"
                addLabel="Ajouter une plateforme"
                items={contact.value('booking') as { label: string; url: string; note?: string }[]}
                onChange={contact.setter('booking')}
                newItem={() => ({ label: '', url: '', note: '' })}
                renderItem={(item, _i, patch) => (
                  <>
                    <FieldEditor label="Libellé du bouton" value={item.label} onChange={(v) => patch({ label: v })} placeholder="Réserver sur RESALIB" />
                    <FieldEditor label="Précision" value={item.note ?? ''} onChange={(v) => patch({ note: v })} placeholder="Rennes & Acigné" />
                    <FieldEditor label="Lien" type="url" wide value={item.url} onChange={(v) => patch({ url: v })} placeholder="https://..." />
                  </>
                )}
              />
              <p className="text-[11px] text-muted-foreground">
                L&apos;ordre compte : le premier bouton est le plus visible. RESALIB est la
                plateforme retenue par Google pour vos deux fiches.
              </p>
            </SectionEditor>

            {/* 3 ──────────────────────────────────────────────── Coordonnées */}
            <SectionEditor
              step={3}
              title="Téléphone et e-mail"
              icon={Phone}
              description="Affichés ici, dans le pied de page et sur vos fiches Google"
            >
              <div className="md:col-span-2 rounded-xl border border-border/60 bg-muted/25 p-4 text-[13px] leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {siteConfig.phone} · {siteConfig.email}
                </span>
                <p className="mt-1.5">
                  Ces coordonnées apparaissent à une quinzaine d&apos;endroits du site (bandeau
                  d&apos;accueil, pied de page, pages cabinets) et dans les données envoyées à
                  Google. Elles sont donc gérées en un seul point, hors de cet écran : demandez-nous
                  le changement et il s&apos;applique partout d&apos;un coup.
                </p>
              </div>
            </SectionEditor>

            {/* 4 ────────────────────────────────────────────────── Cabinets */}
            <SectionEditor
              step={4}
              title="Vos cabinets"
              icon={MapPin}
              description="Les adresses listées sous les coordonnées"
              cols={1}
            >
              <RepeatableList
                itemLabel="Cabinet"
                addLabel="Ajouter un cabinet"
                items={contact.value('cabinets') as { name: string; address: string; note?: string }[]}
                onChange={contact.setter('cabinets')}
                newItem={() => ({ name: '', address: '', note: '' })}
                renderItem={(item, _i, patch) => (
                  <>
                    <FieldEditor label="Nom" value={item.name} onChange={(v) => patch({ name: v })} />
                    <FieldEditor label="Adresse" value={item.address} onChange={(v) => patch({ address: v })} />
                    <FieldEditor label="Précision" type="textarea" value={item.note ?? ''} onChange={(v) => patch({ note: v })} />
                  </>
                )}
              />
            </SectionEditor>
          </>
        )
      }}
    </PageEditor>
  )
}
