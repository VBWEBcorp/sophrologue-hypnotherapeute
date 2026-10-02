import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      // Visuels des articles déposés par PHARE : hébergés par PHARE, adresses
      // absolues stockées telles quelles. Sans cette entrée, /_next/image les
      // refuse (400) et la couverture reste vide sur la liste et l'article.
      {
        protocol: 'https',
        hostname: 'app.vbweb.fr',
        pathname: '/api/media/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  /**
   * Les adresses de l'ancien site SOLOCAL.
   *
   * Elles sont toujours dans l'index de Google (relevé du 29/09/2026 : elles
   * ressortent encore sur des recherches nominatives) et elles répondaient
   * 404 depuis la mise en ligne du 1er septembre. Un 404 jette l'ancienneté et
   * les liens de pages qui ont vécu des années ; une 301 les reverse sur la
   * page équivalente. Permanentes : ces adresses ne reviendront pas.
   */
  async redirects() {
    return [
      { source: '/acigne', destination: '/cabinets/acigne', permanent: true },
      { source: '/rennes', destination: '/cabinets/rennes', permanent: true },
      { source: '/mes-cabinets', destination: '/cabinets', permanent: true },
      { source: '/nos-actualites', destination: '/blog', permanent: true },
      { source: '/sophrologie-rennes', destination: '/sophrologie', permanent: true },
      { source: '/hypnose-rennes', destination: '/hypnotherapie', permanent: true },
    ]
  },
}

export default nextConfig
