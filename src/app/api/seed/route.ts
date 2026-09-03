import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { GalleryImage, GallerySettings } from '@/models/Gallery'
import { BlogPost, BlogSettings } from '@/models/Blog'
import { verifyAuth } from '@/lib/auth'
import { nature } from '@/lib/photos'

export async function POST(request: NextRequest) {
  try {
    const { authenticated, user } = await verifyAuth(request)
    if (!authenticated || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const results: string[] = []

    // ─── Galerie ───
    // Les photos réelles sont injectées par `npm run seed-gallery` (voir
    // scripts/seed-gallery.js) : ce sont les vraies photos des cabinets,
    // hébergées sur Cloudflare R2. On se contente ici d'activer la page.
    const existingImages = await GalleryImage.countDocuments()
    const gallerySettings = await GallerySettings.findOne()
    if (!gallerySettings) {
      await GallerySettings.create({
        enabled: true,
        eyebrow: 'Galerie',
        title: 'Mes cabinets en images',
        description:
          "Les lieux où je vous reçois, à Rennes et à Acigné, et le déroulé d'une séance d'hypnose ou de sophrologie.",
      })
      results.push('Réglages galerie créés')
    }
    results.push(
      existingImages === 0
        ? 'Galerie vide — lancer `npm run seed-gallery` pour importer les photos'
        : `Galerie déjà peuplée (${existingImages} photos), ignorée`
    )

    // ─── Blog: 2 example articles + categories ───
    const existingPosts = await BlogPost.countDocuments()
    if (existingPosts === 0) {
      const blogPosts = [
        {
          title: '5 tendances web design à suivre en 2026',
          slug: '5-tendances-web-design-2026',
          excerpt: 'Le web design évolue constamment. Découvrez les tendances incontournables de cette année pour créer des sites modernes, accessibles et performants.',
          content: `<h2>1. Le design immersif en 3D</h2><p>Les expériences web en trois dimensions ne sont plus réservées aux grandes marques. Grâce aux avancées de WebGL et des bibliothèques comme Three.js, de plus en plus de sites intègrent des éléments 3D interactifs pour captiver leurs visiteurs.</p><h2>2. Le minimalisme fonctionnel</h2><p>Moins, c'est plus. En 2026, la tendance est aux interfaces épurées qui vont droit au but. Les espaces blancs sont utilisés de manière stratégique pour guider l'œil et mettre en valeur le contenu essentiel.</p><h2>3. Les micro-interactions</h2><p>Les petites animations au survol, au clic ou au scroll enrichissent l'expérience utilisateur sans alourdir la page. Elles apportent du feedback visuel et rendent la navigation plus intuitive et agréable.</p><h2>4. L'accessibilité comme standard</h2><p>L'accessibilité n'est plus une option. Les normes WCAG 2.2 sont désormais un prérequis, et les designers intègrent dès la conception des contrastes suffisants, une navigation clavier optimisée et des alternatives textuelles.</p><h2>5. Le dark mode natif</h2><p>Le mode sombre n'est plus un gadget : c'est une attente des utilisateurs. Les sites modernes proposent un basculement fluide entre thème clair et sombre, respectant les préférences système de chaque visiteur.</p>`,
          coverImage: nature.foretVueDuCiel,
          category: 'Web Design',
          tags: ['design', 'tendances', 'UX', 'accessibilité'],
          author: 'L\'équipe',
          published: true,
          publishedAt: new Date('2026-03-15'),
          metaTitle: '5 tendances web design incontournables en 2026',
          metaDescription: 'Découvrez les 5 grandes tendances du web design en 2026 : 3D immersif, minimalisme, micro-interactions, accessibilité et dark mode.',
        },
        {
          title: 'Comment améliorer le référencement de votre site',
          slug: 'ameliorer-referencement-site',
          excerpt: 'Le SEO est un levier essentiel pour attirer du trafic qualifié. Voici nos conseils pratiques pour optimiser votre visibilité sur les moteurs de recherche.',
          content: `<h2>Optimisez vos balises meta</h2><p>Chaque page de votre site doit avoir un titre unique (balise title) et une description pertinente (meta description). Ces éléments sont les premiers éléments que vos visiteurs voient dans les résultats de recherche, soignez-les.</p><h2>Créez du contenu de qualité</h2><p>Google privilégie les contenus utiles, originaux et bien structurés. Publiez régulièrement des articles de blog qui répondent aux questions de votre audience. Utilisez des titres hiérarchisés (H2, H3) pour organiser votre texte.</p><h2>Améliorez la vitesse de chargement</h2><p>Un site lent fait fuir les visiteurs et pénalise votre classement. Optimisez vos images (format WebP, compression), activez la mise en cache et utilisez un hébergement performant. Visez un score supérieur à 90 sur Google PageSpeed.</p><h2>Pensez mobile-first</h2><p>Plus de 60% du trafic web provient des mobiles. Votre site doit être parfaitement responsive et offrir une navigation fluide sur smartphone. Google indexe désormais en priorité la version mobile de votre site.</p><h2>Travaillez vos liens</h2><p>Les liens internes aident Google à comprendre la structure de votre site. Les liens externes (backlinks) provenant de sites de confiance renforcent votre autorité. Développez une stratégie de netlinking cohérente et progressive.</p>`,
          coverImage: nature.pinsBrume,
          category: 'SEO',
          tags: ['seo', 'référencement', 'marketing', 'performance'],
          author: 'L\'équipe',
          published: true,
          publishedAt: new Date('2026-03-28'),
          metaTitle: 'Guide pratique : améliorer le référencement de votre site web',
          metaDescription: 'Conseils SEO concrets pour optimiser votre site : balises meta, contenu de qualité, vitesse, mobile-first et stratégie de liens.',
        },
      ]

      await BlogPost.insertMany(blogPosts)
      results.push('2 articles blog créés')

      // Update blog settings with categories
      let blogSettings = await BlogSettings.findOne()
      if (!blogSettings) {
        await BlogSettings.create({
          enabled: true,
          title: 'Nos dernières actualités',
          description: 'Retrouvez nos conseils, nos projets récents et les tendances du secteur.',
          eyebrow: 'Blog',
          categories: ['Web Design', 'SEO', 'Conseils'],
        })
      } else {
        blogSettings.enabled = true
        if (!blogSettings.categories || blogSettings.categories.length === 0) {
          blogSettings.categories = ['Web Design', 'SEO', 'Conseils']
        }
        await blogSettings.save()
      }
      results.push('Blog activé avec catégories')
    } else {
      results.push('Blog déjà peuplé, ignoré')
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
