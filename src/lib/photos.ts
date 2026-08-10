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
  // ── Cabinet d'Acigné ───────────────────────────────────────────────────────
  acigneFacade: p('cabinet-hypnose-acigne-facade'),
  acigneAccesRue: p('cabinet-hypnose-acigne-acces-rue'),
  acigneConsultation: p('cabinet-acigne-espace-consultation'),

  // ── Cabinet de Rennes ──────────────────────────────────────────────────────
  rennesSalleSeance: p('cabinet-rennes-salle-de-seance'),
  rennesBureau: p('cabinet-rennes-bureau-consultation'),
  rennesSalleAttente: p('cabinet-rennes-salle-attente'),

  // ── Accueil & attente ──────────────────────────────────────────────────────
  attenteFauteuils: p('salle-attente-fauteuils'),
  attenteAffiches: p('salle-attente-affiches-bretagne'),
  hallRennes: p('hall-accueil-centre-rennes'),

  // ── Séances ────────────────────────────────────────────────────────────────
  seanceTable: p('seance-hypnose-table-relaxation'),
  seanceSophrologie: p('seance-sophrologie-relaxation'),
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
  infographieSophroHypnose: p('infographie-sophrologie-hypnose'),
} as const

/** Libellés des catégories affichées sur la page Galerie. */
export const PHOTO_CATEGORIES = {
  acigne: "Cabinet d'Acigné",
  rennes: 'Cabinet de Rennes',
  seances: 'Séances',
  acces: 'Accès & accueil',
  reperes: 'Repères',
} as const

// Le contenu initial de la galerie (titres, descriptions, ordre) vit dans
// `scripts/seed-gallery.js` : il n'est lu qu'une fois, pour remplir la base.
// Ensuite, la galerie se gère entièrement depuis /admin/gallery.
