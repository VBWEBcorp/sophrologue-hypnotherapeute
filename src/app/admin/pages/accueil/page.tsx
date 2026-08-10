'use client'

import Link from 'next/link'
import {
  Sparkles,
  Type,
  BookOpen,
  LayoutGrid,
  Footprints,
  Images,
  MessageSquareQuote,
  Megaphone,
  HelpCircle,
  ArrowUpRight,
} from 'lucide-react'

import { PageEditor } from '@/components/admin/page-editor'
import {
  FieldEditor,
  SectionEditor,
  ImageField,
  RepeatableList,
} from '@/components/admin/field-editor'
import {
  aboutContent,
  heroContent,
  marqueeContent,
  storyContent,
  servicesPreviewContent,
  howItWorksContent,
  galleryContent,
  testimonialsContent,
  ctaContent,
  faqContent,
} from '@/lib/site-content'

// Les valeurs par défaut viennent du MÊME contenu que le front
// (site-content.ts) : l'éditrice voit son vrai contenu, et enregistrer une page
// ne l'écrase pas avec du texte de template.
//
// L'ordre des sections ci-dessous suit exactement l'ordre d'affichage de la
// page d'accueil (voir src/app/page.tsx).
const defaults = {
  hero: {
    eyebrow: heroContent.eyebrow,
    title: heroContent.title,
    description: heroContent.description,
    button1: heroContent.button1,
    button2: heroContent.button2,
    images: heroContent.images,
  },
  marquee: marqueeContent,
  // La section « Mon histoire » est un bloc de texte centré suivi de 4 chiffres.
  // Elle n'affiche pas de photo : aucun champ image ici, volontairement.
  story: {
    eyebrow: storyContent.eyebrow,
    title: storyContent.title,
    paragraph1: storyContent.paragraph1,
    paragraph2: storyContent.paragraph2,
    stats: aboutContent.stats,
  },
  servicesPreview: servicesPreviewContent,
  howItWorks: howItWorksContent,
  gallery: { eyebrow: galleryContent.eyebrow, title: galleryContent.title },
  testimonials: {
    eyebrow: testimonialsContent.eyebrow,
    title: testimonialsContent.title,
    description: testimonialsContent.description,
    googleRating: testimonialsContent.googleRating,
    testimonials: testimonialsContent.items,
  },
  cta: {
    eyebrow: ctaContent.eyebrow,
    title: ctaContent.title,
    description: ctaContent.description,
    button: ctaContent.button,
    scrollImages: ctaContent.scrollImages,
  },
  faq: faqContent,
}

export default function AdminHomePage() {
  return (
    <PageEditor
      title="Page d'accueil"
      previewPath="/"
      docs={[{ id: 'home', defaults }]}
    >
      {(edit) => {
        const home = edit('home')

        return (
          <>
            {/* 1 ────────────────────────────────────────────────── Bannière */}
            <SectionEditor
              step={1}
              title="Bannière"
              icon={Sparkles}
              description="Le grand bloc en haut de la page, avec le diaporama"
            >
              <FieldEditor label="Accroche" value={home.value('hero.eyebrow')} onChange={home.setter('hero.eyebrow')} />
              <FieldEditor label="Titre principal" value={home.value('hero.title')} onChange={home.setter('hero.title')} />
              <FieldEditor label="Description" type="textarea" value={home.value('hero.description')} onChange={home.setter('hero.description')} />
              <FieldEditor label="Bouton 1" value={home.value('hero.button1')} onChange={home.setter('hero.button1')} />
              <FieldEditor label="Bouton 2" value={home.value('hero.button2')} onChange={home.setter('hero.button2')} />

              <div className="md:col-span-2">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Photos du diaporama
                </p>
                <RepeatableList
                  itemLabel="Photo"
                  addLabel="Ajouter une photo"
                  items={home.value('hero.images') as string[]}
                  onChange={home.setter('hero.images')}
                  newItem={() => ''}
                  renderItem={(src: string, i) => (
                    <ImageField
                      value={src}
                      onChange={(v) => {
                        const next = [...((home.value('hero.images') as string[]) ?? [])]
                        next[i] = v
                        home.set('hero.images', next)
                      }}
                    />
                  )}
                />
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Ces photos s&apos;affichent en très grand : choisissez des images larges et nettes.
                </p>
              </div>
            </SectionEditor>

            {/* 2 ─────────────────────────────────────────── Bandeau défilant */}
            <SectionEditor
              step={2}
              title="Bandeau de mots-clés"
              icon={Type}
              description="La ligne de mots qui défile juste sous la bannière"
              cols={1}
            >
              <RepeatableList
                itemLabel="Mot"
                addLabel="Ajouter un mot"
                items={home.value('marquee.items') as { label: string }[]}
                onChange={home.setter('marquee.items')}
                newItem={() => ({ label: '' })}
                renderItem={(item, _i, patch) => (
                  <FieldEditor label="Mot affiché" wide value={item.label} onChange={(v) => patch({ label: v })} />
                )}
              />
            </SectionEditor>

            {/* 3 ─────────────────────────────────────────────── Mon histoire */}
            <SectionEditor
              step={3}
              title="Mon histoire"
              icon={BookOpen}
              description="Votre présentation, suivie de 4 chiffres clés"
            >
              <FieldEditor label="Accroche" value={home.value('story.eyebrow')} onChange={home.setter('story.eyebrow')} />
              <FieldEditor label="Titre" value={home.value('story.title')} onChange={home.setter('story.title')} />
              <FieldEditor label="Paragraphe 1" type="textarea" value={home.value('story.paragraph1')} onChange={home.setter('story.paragraph1')} />
              <FieldEditor label="Paragraphe 2" type="textarea" value={home.value('story.paragraph2')} onChange={home.setter('story.paragraph2')} />

              <div className="md:col-span-2">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Chiffres clés
                </p>
                <RepeatableList
                  itemLabel="Chiffre"
                  addLabel="Ajouter un chiffre"
                  items={home.value('story.stats') as { value: string; label: string }[]}
                  onChange={home.setter('story.stats')}
                  newItem={() => ({ value: '', label: '' })}
                  renderItem={(item, _i, patch) => (
                    <>
                      <FieldEditor label="Valeur" value={item.value} onChange={(v) => patch({ value: v })} placeholder="20 ans" />
                      <FieldEditor label="Légende" value={item.label} onChange={(v) => patch({ label: v })} placeholder="D'expérience" />
                    </>
                  )}
                />
              </div>
            </SectionEditor>

            {/* 4 ──────────────────────────────────── Aperçu des accompagnements */}
            <SectionEditor
              step={4}
              title="Aperçu des accompagnements"
              icon={LayoutGrid}
              description="Les 4 blocs qui résument vos approches"
            >
              <FieldEditor label="Accroche" value={home.value('servicesPreview.eyebrow')} onChange={home.setter('servicesPreview.eyebrow')} />
              <FieldEditor label="Titre" value={home.value('servicesPreview.title')} onChange={home.setter('servicesPreview.title')} />
              <FieldEditor label="Description" type="textarea" value={home.value('servicesPreview.description')} onChange={home.setter('servicesPreview.description')} />
              <RepeatableList
                itemLabel="Bloc"
                addLabel="Ajouter un bloc"
                items={home.value('servicesPreview.items') as { title: string; desc: string }[]}
                onChange={home.setter('servicesPreview.items')}
                newItem={() => ({ title: '', desc: '' })}
                renderItem={(item, _i, patch) => (
                  <>
                    <FieldEditor label="Titre" wide value={item.title} onChange={(v) => patch({ title: v })} />
                    <FieldEditor label="Texte" type="textarea" value={item.desc} onChange={(v) => patch({ desc: v })} />
                  </>
                )}
              />
              <p className="text-[11px] text-muted-foreground md:col-span-2">
                Seuls les 4 premiers blocs sont affichés sur l&apos;accueil.
              </p>
            </SectionEditor>

            {/* 5 ────────────────────────────────────────────────── Le déroulé */}
            <SectionEditor
              step={5}
              title="Le déroulé d'un accompagnement"
              icon={Footprints}
              description="Les étapes, sur fond sombre"
            >
              <FieldEditor label="Accroche" value={home.value('howItWorks.eyebrow')} onChange={home.setter('howItWorks.eyebrow')} />
              <FieldEditor label="Titre" value={home.value('howItWorks.title')} onChange={home.setter('howItWorks.title')} />
              <FieldEditor label="Description" type="textarea" value={home.value('howItWorks.description')} onChange={home.setter('howItWorks.description')} />
              <RepeatableList
                itemLabel="Étape"
                addLabel="Ajouter une étape"
                items={home.value('howItWorks.steps') as { title: string; desc: string }[]}
                onChange={home.setter('howItWorks.steps')}
                newItem={() => ({ title: '', desc: '' })}
                renderItem={(item, _i, patch) => (
                  <>
                    <FieldEditor label="Titre" wide value={item.title} onChange={(v) => patch({ title: v })} />
                    <FieldEditor label="Texte" type="textarea" value={item.desc} onChange={(v) => patch({ desc: v })} />
                  </>
                )}
              />
            </SectionEditor>

            {/* 6 ────────────────────────────────────────────── Galerie photos */}
            <SectionEditor
              step={6}
              title="Galerie photos"
              icon={Images}
              description="Le carrousel de photos du cabinet"
            >
              <FieldEditor label="Accroche" value={home.value('gallery.eyebrow')} onChange={home.setter('gallery.eyebrow')} />
              <FieldEditor label="Titre" value={home.value('gallery.title')} onChange={home.setter('gallery.title')} />
              <div className="md:col-span-2 rounded-xl border border-border/60 bg-muted/25 p-4">
                <p className="text-[13px] text-foreground">
                  Les photos de ce carrousel sont celles de votre galerie.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ajoutez, retirez ou réordonnez-les depuis la rubrique dédiée : les changements
                  apparaissent ici et sur la page Galerie.
                </p>
                <Link
                  href="/admin/gallery"
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Ouvrir la galerie photos
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </SectionEditor>

            {/* 7 ───────────────────────────────────────────────────── Les avis */}
            <SectionEditor
              step={7}
              title="Les avis"
              icon={MessageSquareQuote}
              description="Les avis Google affichés en bandeau"
            >
              <FieldEditor label="Accroche" value={home.value('testimonials.eyebrow')} onChange={home.setter('testimonials.eyebrow')} />
              <FieldEditor label="Titre" value={home.value('testimonials.title')} onChange={home.setter('testimonials.title')} />
              <FieldEditor label="Description" type="textarea" value={home.value('testimonials.description')} onChange={home.setter('testimonials.description')} />
              <FieldEditor label="Note Google affichée" value={home.value('testimonials.googleRating')} onChange={home.setter('testimonials.googleRating')} placeholder="5,0" />

              <div className="md:col-span-2 rounded-xl border border-amber-300/60 bg-amber-50 p-3.5 text-[12px] leading-relaxed text-amber-900">
                <strong>Ne recopiez ici que de vrais avis Google</strong>, mot pour mot, avec le
                nom affiché par leur auteur. Publier un avis inventé est une pratique commerciale
                trompeuse, et la comparaison avec la fiche Google est immédiate.
              </div>

              <RepeatableList
                itemLabel="Avis"
                addLabel="Ajouter un avis"
                items={home.value('testimonials.testimonials') as {
                  name: string
                  company: string
                  text: string
                  stars: number
                }[]}
                onChange={home.setter('testimonials.testimonials')}
                newItem={() => ({ name: '', company: '', text: '', stars: 5 })}
                renderItem={(item, _i, patch) => (
                  <>
                    <FieldEditor label="Nom de la personne" value={item.name} onChange={(v) => patch({ name: v })} />
                    <FieldEditor label="Date affichée" value={item.company} onChange={(v) => patch({ company: v })} placeholder="10 janv. 2024" />
                    <FieldEditor label="Avis" type="textarea" value={item.text} onChange={(v) => patch({ text: v })} />
                    <FieldEditor
                      label="Étoiles (1 à 5)"
                      value={String(item.stars ?? 5)}
                      onChange={(v) => patch({ stars: Math.min(5, Math.max(1, parseInt(v, 10) || 5)) })}
                    />
                  </>
                )}
              />
            </SectionEditor>

            {/* 8 ──────────────────────────────────────── Appel à l'action */}
            <SectionEditor
              step={8}
              title="Appel à l'action"
              icon={Megaphone}
              description="Le bloc d'incitation à prendre rendez-vous"
            >
              <div className="md:col-span-2 rounded-xl border border-border/60 bg-muted/25 p-3.5 text-xs text-muted-foreground">
                Ce bloc est aussi affiché en bas des pages <strong>À propos</strong> et{' '}
                <strong>Séances</strong> : le modifier ici le modifie partout.
              </div>
              <FieldEditor label="Accroche" value={home.value('cta.eyebrow')} onChange={home.setter('cta.eyebrow')} />
              <FieldEditor label="Titre" value={home.value('cta.title')} onChange={home.setter('cta.title')} />
              <FieldEditor label="Description" type="textarea" value={home.value('cta.description')} onChange={home.setter('cta.description')} />
              <FieldEditor label="Bouton" value={home.value('cta.button')} onChange={home.setter('cta.button')} />

              <div className="md:col-span-2 grid grid-cols-1 gap-5 lg:grid-cols-2">
                {(['col1', 'col2'] as const).map((col, colIndex) => (
                  <div key={col}>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Colonne {colIndex + 1}
                    </p>
                    <RepeatableList
                      itemLabel="Photo"
                      addLabel="Ajouter une photo"
                      items={home.value(`cta.scrollImages.${col}`) as string[]}
                      onChange={home.setter(`cta.scrollImages.${col}`)}
                      newItem={() => ''}
                      renderItem={(src: string, i) => (
                        <ImageField
                          value={src}
                          onChange={(v) => {
                            const next = [
                              ...((home.value(`cta.scrollImages.${col}`) as string[]) ?? []),
                            ]
                            next[i] = v
                            home.set(`cta.scrollImages.${col}`, next)
                          }}
                        />
                      )}
                    />
                  </div>
                ))}
                <p className="text-[11px] text-muted-foreground lg:col-span-2">
                  Ces deux colonnes défilent lentement en fond du bloc. Les images sont affichées
                  en format portrait.
                </p>
              </div>
            </SectionEditor>

            {/* 9 ──────────────────────────────────────────────────────── FAQ */}
            <SectionEditor
              step={9}
              title="Questions fréquentes"
              icon={HelpCircle}
              description="Le bloc de questions/réponses en bas de page"
            >
              <FieldEditor label="Accroche" value={home.value('faq.eyebrow')} onChange={home.setter('faq.eyebrow')} />
              <FieldEditor label="Titre" value={home.value('faq.title')} onChange={home.setter('faq.title')} />
              <FieldEditor label="Description" type="textarea" value={home.value('faq.description')} onChange={home.setter('faq.description')} />
              <RepeatableList
                itemLabel="Question"
                addLabel="Ajouter une question"
                items={home.value('faq.items') as { question: string; answer: string }[]}
                onChange={home.setter('faq.items')}
                newItem={() => ({ question: '', answer: '' })}
                renderItem={(item, _i, patch) => (
                  <>
                    <FieldEditor label="Question" wide value={item.question} onChange={(v) => patch({ question: v })} />
                    <FieldEditor label="Réponse" type="textarea" value={item.answer} onChange={(v) => patch({ answer: v })} />
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
