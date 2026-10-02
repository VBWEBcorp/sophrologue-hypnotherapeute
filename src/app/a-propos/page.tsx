import type { Metadata } from 'next'

import { AboutContent } from './about-content'
import { breadcrumbJsonLd, practitionerJsonLd, webPageJsonLd } from '@/components/seo/json-ld'

const description =
  "Hypnothérapeute et sophrologue à Rennes et Acigné depuis 2006. Formée à l'hypnose Ericksonienne à l'Institut Émergences et à la sophrologie à l'ISR."

export const metadata: Metadata = {
  // « À propos » ne portait aucun mot-clé : c'est pourtant la page
  // d'autorité de la praticienne (ancienneté, formations, parcours).
  title: 'Hypnothérapeute à Rennes depuis 2006',
  description,
  alternates: { canonical: '/a-propos' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webPageJsonLd('Hypnothérapeute à Rennes depuis 2006', description, '/a-propos'),
    // L'entité « praticienne » appartient à cette page : c'est elle qui raconte
    // le parcours, les deux écoles de formation (alumniOf) et les lieux
    // d'exercice. Elle n'était déclarée que sur l'accueil.
    practitionerJsonLd(),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'À propos', path: '/a-propos' },
    ]),
  ],
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutContent />
    </>
  )
}
