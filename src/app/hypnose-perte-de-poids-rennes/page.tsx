import type { Metadata } from 'next'

import { SubpageRenderer } from '@/components/sections/subpage-renderer'
import { breadcrumbJsonLd, faqJsonLd, practitionerJsonLd, serviceJsonLd, webPageJsonLd } from '@/components/seo/json-ld'
import { faqOfSubpage, subpages } from '@/lib/subpages'

const data = subpages['perte-de-poids']

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  alternates: { canonical: `/${data.slug}` },
}

// Page de motif : un Service rendu par la praticienne, ses questions en
// FAQPage, et le fil d'Ariane qui la rattache aux accompagnements.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    serviceJsonLd(data.metaTitle, data.metaDescription, `/${data.slug}`),
    practitionerJsonLd(),
    webPageJsonLd(data.metaTitle, data.metaDescription, `/${data.slug}`),
    faqJsonLd(faqOfSubpage('perte-de-poids')),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Accompagnements', path: '/services' },
      { name: 'Perte de poids', path: `/${data.slug}` },
    ]),
  ],
}

export default function PerteDePoidsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SubpageRenderer pageId="sub-perte-de-poids" fallback={data} />
    </>
  )
}
