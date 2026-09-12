/**
 * photos.ts — Photothèque de Véronique Jan.
 *
 * Les fichiers sont hébergés sur Cloudflare R2 (bucket « veronique-jan »,
 * préfixe « photos/ »), servis par le domaine public r2.dev. Les noms de
 * fichiers sont volontairement descriptifs : ils participent au référencement
 * des images.
 *
 * Ce module ne sert QUE de valeurs par défaut. Chaque emplacement du site reste
 * modifiable depuis l'espace d'administration, et la galerie complète se gère
 * dans « Galerie photos ».
 */

/** Domaine public du bucket R2 (voir R2_PUBLIC_URL dans .env.local). */
export const PHOTOS_BASE_URL = 'https://pub-d327bf72362742fe8ea53cc5d670285f.r2.dev/photos'

const p = (name: string) => `${PHOTOS_BASE_URL}/${name}.webp`

export const photos = {
  // ── Praticienne ────────────────────────────────────────────────────────────
  portrait: p('veronique-jan-portrait'),
  /** Portrait professionnel (fond neutre), transmis le 10/09/2026 : sert au
   *  médaillon (favicon) et à l'image `Person` du JSON-LD. */
  portraitProfessionnel: p('veronique-jan-portrait-professionnel'),
  /** Autres portraits, réservés à la galerie : le portrait de référence
   *  (médaillon, JSON-LD, À propos, annuaires) reste `portraitProfessionnel`. */
  portraitHautRouge: p('veronique-jan-portrait-haut-rouge'),
  portraitSourire: p('veronique-jan-portrait-sourire'),
  portraitVesteGrise: p('veronique-jan-portrait-veste-grise'),

  // ── Cabinet d'Acigné ───────────────────────────────────────────────────────
  // Repère donné par la praticienne (12/09/2026) : Acigné, c'est le bureau en
  // bois, les tons pastel beige et brun et la table de soin bleue (la pièce
  // partagée avec Xavier Jan). Rennes, c'est le mur bordeaux et les fauteuils
  // et supports blancs. Les anciens noms de fichiers disaient l'inverse.
  /** Photos prises par la praticienne le 10/09/2026, travaux de l'immeuble
   *  terminés. Elles remplacent les captures Street View (`acigneFacade`,
   *  `acigneAccesRue`), conservées au cas où. */
  acigneBatiment: p('cabinet-acigne-immeuble'),
  /** L'angle de l'immeuble avec la porte, la rampe et le panneau des plaques. */
  acigneEntreeVueAngle: p('cabinet-acigne-entree-vue-d-angle'),
  /** Même vue, recadrée en portrait sur l'entrée (bloc 5/6 de la page Acigné). */
  acigneEntree: p('cabinet-acigne-entree-rue-du-calvaire'),
  acigneBureau: p('cabinet-acigne-bureau-consultation'),
  acigneSalleSoin: p('cabinet-acigne-salle-de-soin'),
  /** Plaques « JAN Xavier, ostéopathie » et « JAN Véronique, sophrologue »
   *  à l'entrée du cabinet. La plaque ne mentionne pas l'hypnose : à n'utiliser
   *  que sur la page Sophrologie (consigne de la praticienne).
   *  Retouchée : la ligne fixe 02 99 37 53 83 n'existe plus, seul le 06 reste
   *  (les fichiers d'origine ont été supprimés du bucket). */
  plaqueSophrologue: p('plaques-jan-veronique-xavier-acigne'),
  acigneFacade: p('cabinet-hypnose-acigne-facade'),
  acigneAccesRue: p('cabinet-hypnose-acigne-acces-rue'),

  // ── Cabinet de Rennes ──────────────────────────────────────────────────────
  /** Le bâtiment vu du ciel (même cliché que `aquaWellnessAerien`, sans les
   *  bandes noires de la capture d'écran). */
  rennesBatiment: p('batiment-cabinet-rennes-atalante-champeaux'),
  /** Le bureau noir en verre et les fauteuils blancs ajourés. */
  rennesConsultation: p('cabinet-rennes-espace-consultation'),
  /** La salle d'attente du centre SPORMED (dalles sombres, sièges métal). */
  rennesSalleAttente: p('cabinet-rennes-salle-attente'),
  /** Le coin fauteuils blancs devant le mur bordeaux. */
  rennesAttenteFauteuils: p('cabinet-rennes-salle-attente-fauteuils'),
  rennesAttenteAffiches: p('cabinet-rennes-salle-attente-affiches-bretagne'),

  // ── Accueil ────────────────────────────────────────────────────────────────
  hallRennes: p('hall-accueil-centre-rennes'),

  // ── Séances ────────────────────────────────────────────────────────────────
  seanceHypnose: p('seance-hypnose-veronique-jan'),
  seanceTable: p('seance-hypnose-table-relaxation'),
  /** ⚠️ Malgré son nom, c'est une patiente allongée au casque : une image
   *  d'hypnose. La sophrologie se pratique debout et assis, elle est illustrée
   *  par les deux visuels ci-dessous. */
  seanceSophrologie: p('seance-sophrologie-relaxation'),
  /** Les quatre principes de la sophrologie (page Sophrologie). */
  sophrologiePrincipes: p('sophrologie-quatre-principes'),
  /** Les domaines d'application de la sophrologie, en 4/3 (carte Services). */
  sophrologieDomaines: p('sophrologie-domaines-d-application'),
  seanceFauteuil: p('seance-hypnose-fauteuil-relaxation'),
  equipementAudio: p('equipement-audio-seance-hypnose'),

  // ── Accès au cabinet de Rennes ─────────────────────────────────────────────
  parkingRennes: p('parking-cabinet-rennes'),
  accesRennes: p('acces-cabinet-rennes-atalante-champeaux'),
  aquaWellnessAerien: p('centre-aqua-wellness-rennes-vue-aerienne'),
  aquaWellnessAccueil: p('accueil-aqua-wellness-rennes'),
  adresseSpormed: p('adresse-spormed-rennes'),

  // ── Repères & annuaires ────────────────────────────────────────────────────
  ficheResalib: p('fiche-resalib-veronique-jan'),
  ficheMedoucine: p('fiche-medoucine-veronique-jan'),
  badgeMedoucine: p('badge-praticien-recommande-medoucine'),
  /** Le macaron rond « Praticien recommandé Médoucine », détouré. */
  badgeMedoucineMacaron: p('badge-medoucine-praticien-recommande'),
  infographieSophroHypnose: p('infographie-sophrologie-hypnose'),
} as const

/**
 * Paysages apaisants — les fonds plein écran (héros, 404, page de connexion)
 * et les colonnes animées du bloc de rappel.
 *
 * Ces visuels viennent d'Unsplash (licence Unsplash, crédit porté aux mentions
 * légales) mais ils sont **servis depuis le bucket**, comme les photos des
 * cabinets : le site ne dépend plus d'un domaine tiers pour s'afficher.
 */
export const nature = {
  rayonsSoleilForet: p('nature-rayons-soleil-foret'),
  planEauArbres: p('nature-plan-eau-arbres'),
  pinsBrume: p('nature-pins-brume'),
  brumeSurLac: p('nature-brume-sur-lac'),
  arbresRayonsSoleil: p('nature-arbres-rayons-soleil'),
  foretVueDuCiel: p('nature-foret-vue-du-ciel'),
  riviereBordeeArbres: p('nature-riviere-bordee-arbres'),
  nuagesAuDessusLac: p('nature-nuages-au-dessus-lac'),
  arbresVertsVueDuCiel: p('nature-arbres-verts-vue-du-ciel'),
} as const

/** Libellés des catégories affichées sur la page Galerie. */
export const PHOTO_CATEGORIES = {
  rennes: 'Cabinet de Rennes',
  acigne: "Cabinet d'Acigné",
  seances: 'Séances',
  sophrologie: 'Sophrologie',
  /** Réservé à la page Galerie : le carrousel de l'accueil l'ignore. */
  portraits: 'Portraits',
  /** Idem : captures d'annuaires et badges. */
  reperes: 'Repères',
} as const

// Le contenu initial de la galerie (titres, descriptions, ordre) vit dans
// `scripts/seed-gallery.js` : il n'est lu qu'une fois, pour remplir la base.
// Ensuite, la galerie se gère entièrement depuis /admin/gallery.
