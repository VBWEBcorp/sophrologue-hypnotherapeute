'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, User, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  coverImage: string
  category: string
  tags: string[]
  author: string
  publishedAt: string
}

interface BlogSettings {
  enabled: boolean
  title: string
  description?: string
  eyebrow?: string
  heroImage?: string
  categories?: string[]
}

const ease = [0.22, 1, 0.36, 1] as const

interface Props {
  initialSettings: BlogSettings
  initialPosts: BlogPost[]
}

export default function BlogPageContent({ initialSettings, initialPosts }: Props) {
  const [settings] = useState<BlogSettings>(initialSettings)
  const [posts] = useState<BlogPost[]>(initialPosts)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  // Tous les tags présents dans les articles (uniques, triés)
  const allTags = useMemo(
    () =>
      Array.from(new Set(posts.flatMap((p) => p.tags || []))).sort((a, b) =>
        a.localeCompare(b, 'fr')
      ),
    [posts]
  )

  const normalizedQuery = query.trim().toLowerCase()
  const hasActiveFilters = activeCategory !== 'all' || activeTag !== null || normalizedQuery !== ''

  const filteredPosts = useMemo(
    () =>
      posts.filter((p) => {
        if (activeCategory !== 'all' && p.category !== activeCategory) return false
        if (activeTag && !(p.tags || []).includes(activeTag)) return false
        if (normalizedQuery) {
          const haystack = [p.title, p.excerpt, p.category, ...(p.tags || [])]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
          if (!haystack.includes(normalizedQuery)) return false
        }
        return true
      }),
    [posts, activeCategory, activeTag, normalizedQuery]
  )

  const resetFilters = () => {
    setActiveCategory('all')
    setActiveTag(null)
    setQuery('')
  }

  // L'article en vedette n'apparaît qu'en vue par défaut (sans recherche/filtre)
  const showFeatured = !hasActiveFilters && filteredPosts.length > 0 && !!filteredPosts[0].coverImage
  const gridPosts = showFeatured ? filteredPosts.slice(1) : filteredPosts

  if (!settings?.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Le blog n&apos;est pas disponible pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[340px] sm:min-h-[400px] lg:min-h-[440px] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0">
          {settings.heroImage ? (
            <Image
              src={settings.heroImage}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
          )}
        </div>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28 w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="font-display text-xs font-semibold tracking-[0.22em] text-white/70 uppercase mb-4">
              {settings.eyebrow || 'Blog'}
            </p>
            <h1 className="font-display text-4xl tracking-tight text-white sm:text-5xl lg:text-6xl font-bold">
              {settings.title || 'Nos dernières actualités'}
            </h1>
            <p className="mt-5 text-lg text-white/70 leading-relaxed sm:text-xl max-w-2xl mx-auto">
              {settings.description || 'Retrouvez nos conseils, nos projets récents et les tendances du secteur.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters: categories + search + tags */}
      {posts.length > 0 && (
        <div className="border-b border-border/60 bg-background/50 backdrop-blur-sm sticky top-16 z-30">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {/* Row 1: categories + search */}
            <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              {(settings.categories?.length ?? 0) > 0 ? (
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={cn(
                      'shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors',
                      activeCategory === 'all'
                        ? 'bg-primary text-white'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    Tous
                  </button>
                  {settings.categories?.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        'shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors',
                        activeCategory === cat
                          ? 'bg-primary text-white'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              ) : (
                <span />
              )}

              {/* Search */}
              <div className="relative w-full shrink-0 sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un article…"
                  aria-label="Rechercher un article"
                  className="h-9 w-full rounded-full border border-border/60 bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            {/* Row 2: tags */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide border-t border-border/40 py-2.5">
                <span className="shrink-0 pr-1 text-xs font-medium text-muted-foreground/70">Tags :</span>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    className={cn(
                      'shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                      activeTag === tag
                        ? 'bg-foreground text-background'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Posts */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Result count + reset */}
        {posts.length > 0 && (
          <div className="mb-6 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''}
              {hasActiveFilters ? (filteredPosts.length > 1 ? ' trouvés' : ' trouvé') : ''}
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:underline"
              >
                <X className="size-3.5" />
                Réinitialiser
              </button>
            )}
          </div>
        )}

        {filteredPosts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Search className="size-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg font-medium">
              {hasActiveFilters
                ? 'Aucun article ne correspond à votre recherche.'
                : 'Aucun article pour le moment.'}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={resetFilters}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                <X className="size-4" />
                Réinitialiser les filtres
              </button>
            ) : (
              <p className="text-sm text-muted-foreground/60 mt-2">Revenez bientôt !</p>
            )}
          </motion.div>
        ) : (
          <>
            {/* Featured post */}
            {showFeatured && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease }}
                className="mb-12"
              >
                <Link href={`/blog/${filteredPosts[0].slug}`} className="group block">
                  <div className="grid md:grid-cols-2 gap-6 rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all">
                    <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden bg-muted">
                      <Image
                        src={filteredPosts[0].coverImage}
                        alt={filteredPosts[0].title}
                        fill
                        sizes="(min-width:768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-center space-y-4">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {filteredPosts[0].category && (
                          <span className="font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                            {filteredPosts[0].category}
                          </span>
                        )}
                        {filteredPosts[0].publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {formatDate(filteredPosts[0].publishedAt)}
                          </span>
                        )}
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                        {filteredPosts[0].title}
                      </h2>
                      {filteredPosts[0].excerpt && (
                        <p className="text-muted-foreground leading-relaxed line-clamp-3">
                          {filteredPosts[0].excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-2">
                        {filteredPosts[0].author && (
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <User className="size-3.5" />
                            {filteredPosts[0].author}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
                          Lire l&apos;article
                          <ArrowRight className="size-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Posts grid */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridPosts.map((post, i) => (
                  <motion.article
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease, delay: i * 0.06 }}
                  >
                    <Link href={`/blog/${post.slug}`} className="group block h-full">
                      <div className="h-full rounded-2xl border border-border/50 bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/20">
                        {post.coverImage && (
                          <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                              loading="lazy"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        )}

                        <div className="p-6 space-y-3">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {post.category && (
                              <span className="font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                {post.category}
                              </span>
                            )}
                            {post.publishedAt && (
                              <span className="flex items-center gap-1">
                                <Calendar className="size-3" />
                                {formatDate(post.publishedAt)}
                              </span>
                            )}
                          </div>

                          <h2 className="font-display text-lg font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h2>

                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                              {post.excerpt}
                            </p>
                          )}

                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {post.tags.slice(0, 3).map((t) => (
                                <span
                                  key={t}
                                  className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2">
                            {post.author && (
                              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <User className="size-3" />
                                {post.author}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                              Lire la suite
                              <ArrowRight className="size-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
