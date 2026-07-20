import { accessibility, cabinets, siteConfig } from '@/lib/seo'

/** Horaires siteConfig → format schema.org (OpeningHoursSpecification). */
const DAY_MAP: Record<string, string[]> = {
  'Lundi – Vendredi': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  Samedi: ['Saturday'],
}

function openingHoursSpec() {
  return siteConfig.hours
    .filter((h) => h.open && h.close)
    .map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: DAY_MAP[h.days] ?? [],
      opens: h.open,
      closes: h.close,
    }))
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/favicon.svg`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.phone,
      contactType: 'customer service',
      availableLanguage: 'French',
    },
    sameAs: [siteConfig.social.facebook, siteConfig.social.linkedin],
  }
}

/**
 * Un LocalBusiness par cabinet.
 *
 * Chaque fiche Google Business Profile doit trouver son équivalent exact côté
 * site : même nom, même adresse, mêmes horaires, mêmes communes desservies.
 * Le `sameAs` vers la fiche Google est ce qui rend le lien explicite ; tant que
 * les URLs des fiches ne sont pas renseignées dans `cabinets`, il est omis
 * (mieux vaut pas de `sameAs` qu'un `sameAs` approximatif).
 */
export function cabinetJsonLd(cabinetId: 'rennes' | 'acigne') {
  const cabinet = cabinets.find((c) => c.id === cabinetId)
  if (!cabinet) return null

  const sameAs = [
    cabinet.googleUrl,
    siteConfig.social.facebook,
    siteConfig.social.linkedin,
  ].filter((url): url is string => Boolean(url))

  return {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': `${siteConfig.url}${cabinet.href}#business`,
    name: `${siteConfig.name} — Hypnothérapeute à ${cabinet.city}`,
    url: `${siteConfig.url}${cabinet.href}`,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    image: siteConfig.ogImage,
    priceRange: '45–65 €',
    currenciesAccepted: 'EUR',
    paymentAccepted: siteConfig.payment.join(', '),
    address: {
      '@type': 'PostalAddress',
      streetAddress: cabinet.street,
      addressLocality: cabinet.city,
      postalCode: cabinet.postalCode,
      addressCountry: cabinet.country,
    },
    openingHoursSpecification: openingHoursSpec(),
    // Les communes citées dans la description de la fiche Google correspondante.
    areaServed: cabinet.areaServed.map((name) => ({ '@type': 'City', name })),
    // Accès PMR — équivalent de l'attribut « accès en fauteuil roulant » de la fiche.
    ...(accessibility.wheelchair
      ? {
          amenityFeature: {
            '@type': 'LocationFeatureSpecification',
            name: 'Accès en fauteuil roulant',
            value: true,
          },
          isAccessibleForFree: true,
        }
      : {}),
    knowsLanguage: 'fr-FR',
    sameAs,
  }
}

/**
 * Entité « praticienne » unique, rattachée à ses deux lieux d'exercice.
 * Évite que les deux cabinets soient lus comme deux entreprises sans lien.
 */
export function practitionerJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteConfig.url}#practitioner`,
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: 'Hypnothérapeute et sophrologue',
    telephone: siteConfig.phone,
    email: siteConfig.email,
    image: siteConfig.ogImage,
    knowsAbout: [
      'Hypnose ericksonienne',
      'Hypnothérapie',
      'Sophrologie caycédienne',
      'Gestion du stress',
      "Troubles de l'anxiété",
      'Troubles du sommeil',
      'Phobies',
      'Accompagnement à l’arrêt du tabac',
      'Gestion de la douleur',
      'Préparation mentale',
    ],
    alumniOf: [
      { '@type': 'Organization', name: 'Institut de Sophrologie de Rennes (ISR)' },
      { '@type': 'Organization', name: 'Institut Émergences, Rennes' },
    ],
    workLocation: cabinets.map((c) => ({
      '@type': 'Place',
      name: c.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: c.street,
        addressLocality: c.city,
        postalCode: c.postalCode,
        addressCountry: c.country,
      },
    })),
    areaServed: cabinets.flatMap((c) =>
      c.areaServed.map((name) => ({ '@type': 'City', name }))
    ),
    sameAs: [siteConfig.social.facebook, siteConfig.social.linkedin],
  }
}

/** Conservé pour les pages génériques : reprend le cabinet d'Acigné. */
export function localBusinessJsonLd() {
  return cabinetJsonLd('acigne')
}

export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  }
}

export function webPageJsonLd(
  name: string,
  description: string,
  path: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url: `${siteConfig.url}${path}`,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  }
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function serviceJsonLd(
  name: string,
  description: string,
  path: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    url: `${siteConfig.url}${path}`,
  }
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  }
}
