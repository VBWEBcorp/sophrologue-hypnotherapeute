/**
 * create-admin.js — crée (ou réinitialise) le compte admin en base.
 *
 * Les identifiants sont lus depuis .env.local (ADMIN_EMAIL / ADMIN_PASSWORD /
 * ADMIN_NAME) pour ne jamais figer un mot de passe dans un fichier suivi par git.
 * Idempotent : si le compte existe déjà, son mot de passe est réinitialisé et le
 * rôle « admin » est garanti.
 *
 *   npm run create-admin
 */
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI
const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim()
const adminPassword = process.env.ADMIN_PASSWORD || ''
const adminName = process.env.ADMIN_NAME || 'Admin'

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI manquant dans .env.local')
  process.exit(1)
}
if (!adminEmail || !adminPassword) {
  console.error('❌ ADMIN_EMAIL / ADMIN_PASSWORD manquants dans .env.local')
  process.exit(1)
}
if (adminPassword.length < 6) {
  console.error('❌ ADMIN_PASSWORD doit faire au moins 6 caractères')
  process.exit(1)
}

// Schéma minimal, sans hook pre-save : on insère le hash déjà calculé.
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
)

const User = mongoose.models.User || mongoose.model('User', UserSchema)

async function createAdmin() {
  try {
    console.log('🔗 Connexion à MongoDB…')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connecté')

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(adminPassword, salt)

    const existing = await User.findOne({ email: adminEmail })
    if (existing) {
      existing.password = hashedPassword
      existing.role = 'admin'
      if (adminName) existing.name = adminName
      await existing.save()
      console.log('\n♻️  Compte admin existant — mot de passe réinitialisé.')
    } else {
      await User.create({
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: 'admin',
      })
      console.log('\n✅ Compte admin créé.')
    }

    console.log('📧 Email :', adminEmail)
    console.log('👤 Nom   :', adminName)
    console.log('🔒 Rôle  : admin')
    console.log('\n🚀 Connexion : /admin/login\n')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur :', error.message)
    process.exit(1)
  }
}

createAdmin()
