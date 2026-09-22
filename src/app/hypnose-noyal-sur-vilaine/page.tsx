import type { Metadata } from 'next'

import { SubpageRenderer } from '@/components/sections/subpage-renderer'
import { breadcrumbJsonLd, cabinetJsonLd, webPageJsonLd } from '@/components/seo/json-ld'
import { subpages } from '@/lib/subpages'

const data = subpages['noyal-sur-vilaine']

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  alternates: { canonical: `/${data.slug}` },
}

// Page de zone : l'établissement déclaré est celui d'Acigné, dont la zone
// desservie (areaServed) cite déjà Noyal-sur-Vilaine, comme la fiche Google.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    cabinetJsonLd('acigne'),
    webPageJsonLd(data.metaTitle, data.metaDescription, `/${data.slug}`),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Mes cabinets', path: '/cabinets' },
      { name: 'Noyal-sur-Vilaine', path: `/${data.slug}` },
    ]),
  ],
}

export default function NoyalSurVilainePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SubpageRenderer pageId="sub-noyal-sur-vilaine" fallback={data} />
    </>
  )
}
