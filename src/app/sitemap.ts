import type { MetadataRoute } from 'next'

import { siteConfig } from '@/lib/seo'
import { PORTRAIT_URL } from '@/components/seo/json-ld'
import { connectDB } from '@/lib/db'
import { BlogPost, BlogSettings } from '@/models/Blog'
import { visiblePostFilter } from '@/lib/blog-filters'
import { GallerySettings } from '@/models/Gallery'

// Rendu a la demande : revalidatePath("/sitemap.xml") ne purge pas le cache des
// routes de metadonnees, un article depose ou retire par PHARE n y apparaitrait
// qu au prochain build.
export const dynamic = 'force-dynamic'

const baseUrl = siteConfig.url

// Sitemap d'images : le portrait de la praticienne est dans le hero de toutes
// les pages du site, on le déclare sur chacune. C'est un des signaux qui
// désignent à Google l'image à mettre en vignette à côté du résultat.
const portrait = [PORTRAIT_URL]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      images: portrait,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      images: portrait,
    },
    {
      url: `${baseUrl}/hypnotherapie`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
      images: portrait,
    },
    {
      url: `${baseUrl}/seances-hypnose`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      images: portrait,
    },
    {
      url: `${baseUrl}/sophrologie`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
      images: portrait,
    },
    {
      url: `${baseUrl}/cabinets`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      images: portrait,
    },
    {
      url: `${baseUrl}/cabinets/rennes`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      images: portrait,
    },
    {
      url: `${baseUrl}/cabinets/acigne`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      images: portrait,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      images: portrait,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      images: portrait,
    },
  ]

  try {
    await connectDB()

    // Gallery page if enabled
    const gallerySettings = await GallerySettings.findOne()
    if (gallerySettings?.enabled) {
      pages.push({
        url: `${baseUrl}/gallery`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }

    // Blog : actif tant qu'il n'est pas désactivé dans l'espace client. Sans document
    // BlogSettings en base (cas de la prod), la navbar et l'API le tiennent pour actif ;
    // exiger ici un document laissait les articles hors du sitemap.
    const blogSettings = await BlogSettings.findOne()
    if (blogSettings?.enabled !== false) {
      pages.push({
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })

      // Individual blog posts
      const posts = await BlogPost.find(visiblePostFilter()).select('slug updatedAt publishedAt')
      for (const post of posts) {
        pages.push({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updatedAt || post.publishedAt),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    }
  } catch (error) {
    console.error('Sitemap generation error:', error)
  }

  return pages
}
