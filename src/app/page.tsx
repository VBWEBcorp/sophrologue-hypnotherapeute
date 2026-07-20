import type { Metadata } from 'next'

import { CtaSection } from '@/components/sections/cta-section'
import { FaqSection } from '@/components/sections/faq-section'
import { GalleryCarousel } from '@/components/sections/gallery-carousel'
import { HeroSection } from '@/components/sections/hero-section'
import { HowItWorks } from '@/components/sections/how-it-works'
import { ServicesPreview } from '@/components/sections/services-preview'
import { StorySection } from '@/components/sections/story-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { ValuesMarquee } from '@/components/sections/values-marquee'
import {
  cabinetJsonLd,
  organizationJsonLd,
  practitionerJsonLd,
  webPageJsonLd,
  webSiteJsonLd,
} from '@/components/seo/json-ld'
import { siteConfig } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Hypnothérapeute et sophrologue à Rennes et Acigné',
  description: siteConfig.description,
  alternates: { canonical: '/' },
}

// Les deux cabinets sont déclarés dès l'accueil : c'est la page qui reçoit le
// plus de liens, et Google doit y voir les deux établissements des fiches.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webSiteJsonLd(),
    organizationJsonLd(),
    practitionerJsonLd(),
    cabinetJsonLd('rennes'),
    cabinetJsonLd('acigne'),
    webPageJsonLd(siteConfig.name, siteConfig.description, '/'),
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <ValuesMarquee />
      <StorySection />
      <ServicesPreview />
      <HowItWorks />
      <GalleryCarousel />
      <TestimonialsSection />
      <CtaSection />
      <FaqSection />
    </>
  )
}
