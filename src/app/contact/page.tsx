import type { Metadata } from 'next'

import { ContactContent } from './contact-content'
import { breadcrumbJsonLd, webPageJsonLd } from '@/components/seo/json-ld'

const description =
  "Prendre rendez-vous avec Véronique Jan à Rennes ou à Acigné : réservation en ligne RESALIB et MEDOUCINE, par téléphone ou par SMS."

export const metadata: Metadata = {
  title: 'Prendre rendez-vous',
  description,
  alternates: { canonical: '/contact' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webPageJsonLd('Prendre rendez-vous', description, '/contact'),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Rendez-vous', path: '/contact' },
    ]),
  ],
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactContent />
    </>
  )
}
