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

// La liste des photos (titres, catégories, ordre) est partagée avec le site :
// src/lib/gallery-defaults.json est ce qu'affiche la page Galerie tant que la
// base est vide. Ce script la recopie en base pour qu'elle devienne éditable
// depuis l'admin. Les commentaires sur les choix (plaques, captures Street
// View) sont dans src/lib/gallery-defaults.ts.
const PHOTOS = require('../src/lib/gallery-defaults.json')

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
