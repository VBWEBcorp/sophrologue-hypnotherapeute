'use client'

import { useContent } from '@/hooks/use-content'
import { SubpageContent } from '@/components/sections/subpage-content'
import type { Subpage } from '@/lib/subpages'

/**
 * Rend une page thématique en fusionnant le contenu par défaut (subpages.ts)
 * avec l'éventuelle surcharge enregistrée en base via l'admin.
 *
 * La surcharge est stockée en entier sous la clé `subpage` du pageId dédié
 * (ex. « sub-hypnotherapie ») : si elle existe, elle remplace le contenu par
 * défaut ; sinon on affiche le contenu statique. Ce composant est aussi le point
 * d'entrée de l'aperçu en direct depuis l'éditeur (via useContent).
 */
export function SubpageRenderer({
  pageId,
  fallback,
}: {
  pageId: string
  fallback: Subpage
}) {
  const { data } = useContent(pageId, { subpage: fallback })
  const subpage = (data.subpage as Subpage) ?? fallback
  return <SubpageContent data={subpage} />
}
