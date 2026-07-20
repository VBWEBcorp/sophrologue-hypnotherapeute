import type { Metadata } from 'next'

import { SubpageRenderer } from '@/components/sections/subpage-renderer'
import { breadcrumbJsonLd, cabinetJsonLd, webPageJsonLd } from '@/components/seo/json-ld'
import { subpages } from '@/lib/subpages'

const data = subpages['cabinet-rennes']

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  alternates: { canonical: `/${data.slug}` },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    cabinetJsonLd('rennes'),
    webPageJsonLd(data.metaTitle, data.metaDescription, `/${data.slug}`),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Mes cabinets', path: '/cabinets' },
      { name: 'Rennes', path: `/${data.slug}` },
    ]),
  ],
}

export default function CabinetRennesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SubpageRenderer pageId="sub-cabinet-rennes" fallback={data} />
    </>
  )
}
