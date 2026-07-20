import type { Metadata } from 'next'

import { SubpageRenderer } from '@/components/sections/subpage-renderer'
import { breadcrumbJsonLd, serviceJsonLd, webPageJsonLd } from '@/components/seo/json-ld'
import { subpages } from '@/lib/subpages'

const data = subpages.sophrologie

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  alternates: { canonical: `/${data.slug}` },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webPageJsonLd(data.metaTitle, data.metaDescription, `/${data.slug}`),
    serviceJsonLd(data.metaTitle, data.metaDescription, `/${data.slug}`),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: data.hero.breadcrumb, path: `/${data.slug}` },
    ]),
  ],
}

export default function SophrologiePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SubpageRenderer pageId="sub-sophrologie" fallback={data} />
    </>
  )
}
