import type { Metadata } from 'next'

import { SubpageRenderer } from '@/components/sections/subpage-renderer'
import { breadcrumbJsonLd, faqJsonLd, practitionerJsonLd, serviceJsonLd, webPageJsonLd } from '@/components/seo/json-ld'
import { faqOfSubpage, subpages } from '@/lib/subpages'

const data = subpages['stress-anxiete']

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
    faqJsonLd(faqOfSubpage('stress-anxiete')),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Accompagnements', path: '/services' },
      { name: 'Stress et anxiété', path: `/${data.slug}` },
    ]),
  ],
}

export default function StressAnxietePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SubpageRenderer pageId="sub-stress-anxiete" fallback={data} />
    </>
  )
}
