export const siteConfig = {
  name: 'Véronique Jan',
  /**
   * ⚠️ Domaine SANS www : c'est l'hôte réellement servi, `www` ne fait que le
   * rediriger en 301. Toute URL construite ici (canonical, sitemap, OG,
   * JSON-LD) doit désigner l'hôte final, sinon chaque signal envoyé à Google
   * transite par une redirection et le site se cite lui-même sous deux noms.
   */
  url: 'https://sophrologue-hypnotherapeute-jan.fr',
  locale: 'fr_FR',
  description:
    "Véronique Jan, hypnothérapeute (hypnose Ericksonienne) et sophrologue à Rennes et Acigné depuis 20 ans. Accompagnement du stress, de l'anxiété, de la dépression, du sommeil, des phobies, de la douleur et arrêt du tabac.",
  ogImage: 'https://sophrologue-hypnotherapeute-jan.fr/og.png',
  twitterHandle: '@veroniquejan',
  themeColor: '#2c2438',
  /** Numéro affiché — format identique à celui des fiches Google et de RESALIB. */
  phone: '06 15 62 17 23',
  /**
   * Même numéro au format international. Réservé aux liens `tel:` et aux
   * champs `telephone` du JSON-LD : c'est la forme que Google rapproche du
   * numéro de la fiche.
   */
  phoneE164: '+33615621723',
  email: 'vjso@hotmail.fr',
  /** Installée en octobre 2006. `since` sert à calculer l'ancienneté affichée. */
  since: 2006,
  /** Adresse principale — conservée pour la compatibilité, voir `cabinets` ci-dessous. */
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
    // RESALIB en premier : c'est la plateforme que Google a retenue pour le
    // bouton « Prendre rendez-vous » des deux fiches.
    resalib: 'https://www.resalib.fr/praticien/67027-veronique-jan-hypnotherapeute-rennes',
    medoucine: 'https://www.medoucine.com/consultation/acigne/veronique-jan/4253',
  },
  /** Horaires identiques sur les deux cabinets — doivent rester alignés sur les fiches Google. */
  hours: [
    { days: 'Lundi – Vendredi', open: '08:00', close: '21:30' },
    { days: 'Samedi', open: '08:00', close: '20:00' },
    { days: 'Dimanche', open: null, close: null },
  ],
  payment: ['Chèque', 'Espèces', 'Virement'],
  paymentNote: 'Le règlement par carte bancaire n’est pas accepté.',
} as const

/**
 * Les deux cabinets, chacun adossé à sa fiche Google Business Profile.
 * `areaServed` reprend exactement les communes validées avec la praticienne :
 * ce sont celles qui figurent dans la description de chaque fiche.
 */
export const cabinets = [
  {
    id: 'rennes',
    name: 'Cabinet de Rennes',
    venue: 'Centre médical SPORMED / Sport Santé Institut',
    street: '2A Rue du Bourg Nouveau',
    city: 'Rennes',
    postalCode: '35000',
    country: 'FR',
    district: 'Atalante Champeaux',
    // Fiche Google « Hypnose Rennes - Véronique Jan », désignée par son
    // place_id. Elle alimente le `sameAs` du LocalBusiness, qui est le lien
    // explicite entre cette page et la fiche — le cœur de l'alignement
    // site ↔ fiche. Un place_id ne change pas, contrairement à une URL courte.
    googleUrl:
      'https://www.google.com/maps/place/?q=place_id:ChIJoZG3J43gDkgRXzO37vOCxgM' as string | null,
    href: '/cabinets/rennes',
    bookingUrl: siteConfig.booking.resalib,
    bookingLabel: 'Réserver sur RESALIB',
    areaServed: [
      'Rennes',
      'Pacé',
      'Saint-Jacques-de-la-Lande',
      'Saint-Grégoire',
      'Saint-Gilles',
      'Cleunay',
      'Villejean',
      'Vezin-le-Coquet',
    ],
  },
  {
    id: 'acigne',
    name: "Cabinet d'Acigné",
    venue: 'Cabinet pluridisciplinaire',
    street: '2 Rue du Calvaire',
    city: 'Acigné',
    postalCode: '35690',
    country: 'FR',
    district: null,
    // Fiche Google « Hypnose Acigné - Véronique Jan ».
    googleUrl:
      'https://www.google.com/maps/place/?q=place_id:ChIJZet4XujZDkgRMy0M9N0z7XM' as string | null,
    href: '/cabinets/acigne',
    bookingUrl: siteConfig.booking.medoucine,
    bookingLabel: 'Réserver sur MEDOUCINE',
    areaServed: [
      'Acigné',
      'Noyal-sur-Vilaine',
      'Thorigné-Fouillard',
      'Cesson-Sévigné',
      'Servon-sur-Vilaine',
      'Brécé',
      'Châteaubourg',
      'Châteaugiron',
      'Domloup',
      'Chantepie',
      'Liffré',
      'Vern-sur-Seiche',
    ],
  },
] as const

/** Rayon de déplacement à domicile, en kilomètres, autour de chaque cabinet. */
export const HOME_VISIT_RADIUS_KM = 20

/**
 * Accessibilité PMR. La fiche Google et l'ancien site affichent le pictogramme
 * « accès handicapé ». Repris ici pour le footer + le JSON-LD (amenityFeature).
 * ⚠️ À confirmer que c'est exact pour LES DEUX cabinets avant mise en ligne.
 */
export const accessibility = {
  wheelchair: true,
  label: 'Cabinets accessibles aux personnes à mobilité réduite (PMR)',
}

/**
 * Identité légale — alimente les Mentions légales et la Politique de
 * confidentialité. Un seul endroit à tenir à jour.
 *
 * ⚠️ Les champs marqués « À COMPLÉTER » ne peuvent pas être devinés (SIRET,
 * statut juridique exact, médiateur de la consommation). Tant qu'ils sont
 * vides, la page affiche « (information à communiquer) » plutôt qu'une valeur
 * inventée. À renseigner avant la mise en production.
 */
export const legalConfig = {
  // Éditrice — praticienne en exercice individuel (PAS une société).
  editorName: 'Véronique Jan',
  editorRole: 'Hypnothérapeute et sophrologue',
  legalForm: 'Entreprise individuelle (EI)',
  siret: '492 218 268 00018',
  apeCode: '86.90F — Activités de santé humaine non classées ailleurs',
  vatNumber: '', // Vide → « Non assujettie à la TVA (art. 293 B du CGI) » (à confirmer)
  // Adresse professionnelle enregistrée. Vérifiée au répertoire Sirene
  // (SIRET 492 218 268 00018) : « 2 RUE DU CALVAIRE 35690 ACIGNE », sans le
  // « A » qui figurait ici. Doit rester mot pour mot l'adresse du cabinet
  // affichée ailleurs sur le site et sur la fiche Google — deux libellés pour
  // une seule adresse, c'est exactement ce qui casse la cohérence NAP.
  editorAddress: '2 Rue du Calvaire, 35690 Acigné',
  publicationDirector: 'Véronique Jan',
  // Tribunal compétent + médiateur de la consommation (communiqué sur demande,
  // formulation reprise de ses mentions légales actuelles).
  jurisdictionCity: 'Rennes',
  mediator: 'Pour connaître le nom de notre médiateur de la consommation, veuillez nous contacter.',
  // Hébergeur : déploiement sur Netlify.
  host: {
    name: 'Netlify, Inc.',
    address: '512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis',
    url: 'https://www.netlify.com',
  },
  // Réalisation
  agency: 'VBWEB',
  agencyUrl: 'https://www.vbweb.fr',
  // Date de dernière mise à jour des documents légaux (format FR).
  lastUpdated: '03/09/2026',
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
