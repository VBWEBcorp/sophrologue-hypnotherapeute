export const siteConfig = {
  name: 'Véronique Jan',
  url: 'https://www.sophrologue-hypnotherapeute-jan.fr',
  locale: 'fr_FR',
  description:
    "Véronique Jan, hypnothérapeute et sophrologue certifiée à Acigné et Rennes depuis 2006. Hypnose ericksonienne et sophrologie caycédienne pour gérer le stress, l'anxiété, le sommeil, les phobies, la douleur et les addictions.",
  ogImage: 'https://www.sophrologue-hypnotherapeute-jan.fr/og.png',
  twitterHandle: '@veroniquejan',
  themeColor: '#2c2438',
  phone: '06 15 62 17 23',
  email: 'vjso@hotmail.fr',
  address: {
    street: '2 Rue du Calvaire',
    city: 'Acigné',
    postalCode: '35690',
    country: 'FR',
  },
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=100089334794006',
    linkedin: 'https://www.linkedin.com/in/v%C3%A9ronique-jan-b27a32244',
    google:
      'https://www.google.com/search?q=V%C3%A9ronique+Jan+sophrologue+hypnoth%C3%A9rapeute+Rennes#lrd=0x480ee08d27b791a1:0x3c682f3eeb7335f',
  },
  booking: {
    medoucine: 'https://www.medoucine.com/consultation/acigne/veronique-jan/4253',
    resalib: 'https://www.resalib.fr/praticien/67027-veronique-jan-hypnotherapeute-rennes',
  },
} as const

export type SeoMeta = {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  noindex?: boolean
  jsonLd?: Record<string, unknown>
}

export function buildTitle(page?: string) {
  if (!page) return siteConfig.name
  return `${page} - ${siteConfig.name}`
}

export const routes = [
  '/',
  '/a-propos',
  '/hypnotherapie',
  '/seances-hypnose',
  '/sophrologie',
  '/cabinets',
  '/cabinets/rennes',
  '/cabinets/acigne',
  '/services',
  '/contact',
  '/mentions-legales',
  '/politique-de-confidentialite',
  '/conditions-generales',
  '/politique-cookies',
] as const
