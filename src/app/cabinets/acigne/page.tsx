import type { Metadata } from 'next'

import { SubpageContent } from '@/components/sections/subpage-content'
import { breadcrumbJsonLd, webPageJsonLd } from '@/components/seo/json-ld'
import { subpages } from '@/lib/subpages'

const data = subpages['cabinet-acigne']

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  alternates: { canonical: `/${data.slug}` },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webPageJsonLd(data.metaTitle, data.metaDescription, `/${data.slug}`),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Mes cabinets', path: '/cabinets' },
      { name: 'Acigné', path: `/${data.slug}` },
    ]),
  ],
}

export default function CabinetAcignePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SubpageContent data={data} />
    </>
  )
}
