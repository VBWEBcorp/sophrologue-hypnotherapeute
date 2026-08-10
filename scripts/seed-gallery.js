/**
 * seed-gallery.js — remplit la galerie photos de Véronique Jan.
 *
 * Les fichiers sont déjà en ligne sur Cloudflare R2 (bucket « veronique-jan »,
 * préfixe « photos/ »). Ce script crée la fiche de chaque photo en base :
 * titre, description, catégorie, ordre d'affichage.
 *
 * Idempotent : une photo déjà présente (même URL) est mise à jour, pas
 * dupliquée. Les modifications faites depuis l'admin sont donc écrasées si on
 * relance le script — à n'utiliser que pour l'initialisation ou une remise à
 * plat volontaire.
 *
 *   npm run seed-gallery
 */
const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI
const PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://pub-d327bf72362742fe8ea53cc5d670285f.r2.dev'

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI manquant dans .env.local')
  process.exit(1)
}

const url = (file) => `${PUBLIC_URL.replace(/\/$/, '')}/photos/${file}.webp`

const CATEGORIES = {
  acigne: "Cabinet d'Acigné",
  rennes: 'Cabinet de Rennes',
  seances: 'Séances',
  acces: 'Accès & accueil',
  reperes: 'Repères',
}

// Ordre du parcours : séances → Acigné → Rennes → accès → repères.
// Les `order` sont espacés de 10 pour pouvoir intercaler sans tout renuméroter.
const PHOTOS = [
  {
    file: 'seance-hypnose-table-relaxation',
    title: "Séance d'hypnose sur table de relaxation",
    description: "Installation confortable et casque audio pour une séance d'hypnose Ericksonienne.",
    category: CATEGORIES.seances,
  },
  {
    file: 'seance-sophrologie-relaxation',
    title: 'Séance de sophrologie',
    description: 'Un temps de relâchement du corps et du système nerveux, allongée et couverte.',
    category: CATEGORIES.seances,
  },
  {
    file: 'seance-hypnose-fauteuil-relaxation',
    title: "Séance d'hypnose en fauteuil relaxant",
    description: 'Le fauteuil inclinable, une alternative à la table pour les séances.',
    category: CATEGORIES.seances,
  },
  {
    file: 'equipement-audio-seance-hypnose',
    title: 'Équipement audio des séances',
    description: "Casques et matériel son utilisés pendant les séances d'hypnose et de sophrologie.",
    category: CATEGORIES.seances,
  },
  {
    file: 'cabinet-hypnose-acigne-facade',
    title: "Cabinet d'Acigné — façade",
    description: "L'immeuble du cabinet, 2 rue du Calvaire à Acigné.",
    category: CATEGORIES.acigne,
  },
  {
    file: 'cabinet-hypnose-acigne-acces-rue',
    title: "Cabinet d'Acigné — accès depuis la rue",
    description: "L'entrée du cabinet vue depuis la rue du Calvaire.",
    category: CATEGORIES.acigne,
  },
  {
    file: 'cabinet-acigne-espace-consultation',
    title: "Cabinet d'Acigné — espace de consultation",
    description: "Le bureau où débute chaque accompagnement, par l'entretien préalable.",
    category: CATEGORIES.acigne,
  },
  {
    file: 'cabinet-rennes-salle-de-seance',
    title: 'Cabinet de Rennes — salle de séance',
    description: 'La salle de séance du cabinet de Rennes, au centre médical SPORMED.',
    category: CATEGORIES.rennes,
  },
  {
    file: 'cabinet-rennes-bureau-consultation',
    title: 'Cabinet de Rennes — bureau de consultation',
    description: "L'espace d'entretien, avant et après la séance.",
    category: CATEGORIES.rennes,
  },
  {
    file: 'cabinet-rennes-salle-attente',
    title: "Cabinet de Rennes — salle d'attente",
    description: "La salle d'attente du centre médical qui accueille le cabinet.",
    category: CATEGORIES.rennes,
  },
  {
    file: 'salle-attente-fauteuils',
    title: "Salle d'attente — coin fauteuils",
    description: 'Un espace calme pour patienter avant la séance.',
    category: CATEGORIES.acces,
  },
  {
    file: 'salle-attente-affiches-bretagne',
    title: "Salle d'attente — affiches de Bretagne",
    description: "Un décor apaisant, aux couleurs de l'Ille-et-Vilaine et du Finistère.",
    category: CATEGORIES.acces,
  },
  {
    file: 'hall-accueil-centre-rennes',
    title: "Hall d'accueil du centre de Rennes",
    description: 'Le hall du centre médical, avec ascenseur et espace de repos.',
    category: CATEGORIES.acces,
  },
  {
    file: 'acces-cabinet-rennes-atalante-champeaux',
    title: 'Accès au cabinet de Rennes',
    description: "Le bâtiment du centre médical SPORMED, zone d'affaires Atalante Champeaux.",
    category: CATEGORIES.acces,
  },
  {
    file: 'parking-cabinet-rennes',
    title: 'Parking du cabinet de Rennes',
    description: 'Stationnement au pied du centre médical.',
    category: CATEGORIES.acces,
  },
  {
    file: 'centre-aqua-wellness-rennes-vue-aerienne',
    title: 'Centre Aqua Wellness — vue aérienne',
    description: 'Le bâtiment qui abrite le cabinet de Rennes, vu du ciel.',
    category: CATEGORIES.acces,
  },
  {
    file: 'accueil-aqua-wellness-rennes',
    title: 'Centre Aqua Wellness — accueil',
    description: "Le comptoir d'accueil à l'entrée du centre.",
    category: CATEGORIES.acces,
  },
  {
    file: 'adresse-spormed-rennes',
    title: 'Adresse du centre médical SPORMED',
    description: '2A rue du Bourg Nouveau, ZAC Atalante Champeaux, 35000 Rennes.',
    category: CATEGORIES.acces,
  },
  {
    file: 'fiche-resalib-veronique-jan',
    title: 'Fiche RESALIB',
    description: 'Profil et avis patients sur la plateforme RESALIB.',
    category: CATEGORIES.reperes,
  },
  {
    file: 'fiche-medoucine-veronique-jan',
    title: 'Fiche MEDOUCINE',
    description: 'Profil et avis patients sur la plateforme MEDOUCINE.',
    category: CATEGORIES.reperes,
  },
  {
    file: 'badge-praticien-recommande-medoucine',
    title: 'Praticien recommandé MEDOUCINE',
    description: 'Le badge des praticiens sélectionnés par MEDOUCINE.',
    category: CATEGORIES.reperes,
  },
  {
    // Visuel repris d'internet : masqué tant que l'origine et les droits ne
    // sont pas confirmés. Se réaffiche d'un clic depuis l'admin.
    file: 'infographie-sophrologie-hypnose',
    title: 'Sophrologie et hypnose : les différences',
    description: 'Infographie comparant les deux approches.',
    category: CATEGORIES.reperes,
    active: false,
  },
]

const GalleryImageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    imageUrl: { type: String, required: true },
    category: { type: String, default: 'general' },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const GallerySettingsSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    title: String,
    description: String,
    eyebrow: String,
    heroImage: String,
  },
  { timestamps: true }
)

const GalleryImage =
  mongoose.models.GalleryImage || mongoose.model('GalleryImage', GalleryImageSchema)
const GallerySettings =
  mongoose.models.GallerySettings || mongoose.model('GallerySettings', GallerySettingsSchema)

async function seedGallery() {
  try {
    console.log('🔗 Connexion à MongoDB…')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connecté\n')

    let created = 0
    let updated = 0

    for (const [index, photo] of PHOTOS.entries()) {
      const imageUrl = url(photo.file)
      const doc = {
        title: photo.title,
        description: photo.description,
        imageUrl,
        category: photo.category,
        order: (index + 1) * 10,
        active: photo.active !== false,
      }

      const existing = await GalleryImage.findOne({ imageUrl })
      if (existing) {
        await GalleryImage.updateOne({ _id: existing._id }, doc)
        updated++
        console.log(`♻️  ${photo.title}`)
      } else {
        await GalleryImage.create(doc)
        created++
        console.log(`➕ ${photo.title}`)
      }
    }

    // Réglages de la page /gallery — créés seulement s'ils n'existent pas,
    // pour ne pas écraser un texte retouché depuis l'admin.
    const settings = await GallerySettings.findOne()
    if (!settings) {
      await GallerySettings.create({
        enabled: true,
        eyebrow: 'Galerie',
        title: 'Mes cabinets en images',
        description:
          "Les lieux où je vous reçois, à Rennes et à Acigné, et le déroulé d'une séance d'hypnose ou de sophrologie.",
      })
      console.log('\n⚙️  Réglages de la galerie créés')
    } else {
      console.log('\n⚙️  Réglages déjà présents — inchangés')
    }

    console.log(`\n✅ Terminé : ${created} ajoutée(s), ${updated} mise(s) à jour.`)
    console.log('🖼️  Galerie publique : /gallery')
    console.log('🔧 Gestion : /admin/gallery\n')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur :', error.message)
    process.exit(1)
  }
}

seedGallery()
