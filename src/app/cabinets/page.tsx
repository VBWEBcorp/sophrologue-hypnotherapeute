import type { Metadata } from 'next'

import { SubpageContent } from '@/components/sections/subpage-content'
import { breadcrumbJsonLd, webPageJsonLd } from '@/components/seo/json-ld'
import { subpages } from '@/lib/subpages'

const data = subpages.cabinets

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
      { name: data.hero.breadcrumb, path: `/${data.slug}` },
    ]),
  ],
}

export default function CabinetsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SubpageContent data={data} />
    </>
  )
}
