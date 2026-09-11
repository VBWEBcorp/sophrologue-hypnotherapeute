/**
 * gallery-defaults.ts — la galerie photos telle qu'elle s'affiche tant que
 * personne n'a ajouté de photo depuis l'admin.
 *
 * La liste elle-même est dans `gallery-defaults.json`, pour que le script
 * `npm run seed-gallery` (CommonJS, sans TypeScript) lise exactement la même
 * chose que la page. Dès qu'une photo existe en base (ajout depuis
 * « Galerie photos », ou import de cette liste), c'est la base qui fait foi et
 * cette liste n'est plus lue.
 *
 * Ordre = ordre d'affichage. La page Galerie regroupe par catégorie, dans
 * l'ordre de première apparition : Rennes, puis Acigné, puis les séances…
 * Les deux cabinets ne se mélangent donc jamais (demande de la praticienne,
 * 11/09/2026).
 *
 * Absents volontairement :
 *  - les plaques du cabinet d'Acigné : la praticienne ne les veut que sur la
 *    page Sophrologie (sa plaque ne mentionne pas l'hypnose) ;
 *  - les captures Street View d'Acigné (flèche Google incrustée), remplacées
 *    par ses propres photos : listées mais `active: false`.
 */

import defaults from './gallery-defaults.json'
import { PHOTOS_BASE_URL } from './photos'

export type GalleryDefault = {
  /** Nom du fichier sur R2, sans extension (voir `photos.ts`). */
  file: string
  title: string
  description?: string
  /** Libellé de catégorie, tel qu'enregistré en base (voir `PHOTO_CATEGORIES`). */
  category: string
  active?: boolean
}

export const galleryDefaults = defaults as GalleryDefault[]

/** URL publique d'une photo de la liste. */
export function galleryDefaultUrl(file: string): string {
  return `${PHOTOS_BASE_URL}/${file}.webp`
}

/**
 * Les photos par défaut sous la forme attendue par la page Galerie et le
 * carrousel, masquées exclues. L'`_id` est un identifiant stable dérivé du
 * fichier : il ne sert qu'aux clés React, jamais à un appel d'API.
 */
export function defaultGalleryImages() {
  return galleryDefaults
    .filter((photo) => photo.active !== false)
    .map((photo, index) => ({
      _id: `default-${photo.file}`,
      title: photo.title,
      description: photo.description,
      imageUrl: galleryDefaultUrl(photo.file),
      category: photo.category,
      order: (index + 1) * 10,
    }))
}
