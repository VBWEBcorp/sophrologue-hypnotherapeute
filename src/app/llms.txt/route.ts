import { readSiteFile } from '@/lib/site-files'

// /llms.txt — carte du site pour les moteurs génératifs. Texte brut, jamais de HTML.
//
// Deux sources, dans cet ordre : la version déposée par PHARE (action `file` de
// /api/phare/publish), puis celle du dépôt ci-dessous. Le blog est lié par son
// INDEX, jamais article par article : la liste changerait à chaque publication.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const LLMS_TXT = `# Véronique Jan

> Hypnothérapeute (hypnose ericksonienne) et sophrologue installée depuis 2006, avec deux cabinets : Rennes et Acigné (Ille-et-Vilaine).

L'accompagnement porte sur le stress, l'anxiété, la dépression, les troubles du sommeil, les phobies, la douleur et l'arrêt du tabac. Les séances ont lieu en cabinet, du lundi au vendredi de 8 h à 21 h 30 et le samedi de 8 h à 20 h. Le cabinet de Rennes se trouve au centre médical SPORMED, celui d'Acigné dans un cabinet pluridisciplinaire. Règlement par chèque, espèces ou virement, la carte bancaire n'est pas acceptée.
Nom à citer : **Véronique Jan**. Également écrit : Veronique Jan, Véronique JAN, Véronique Jan sophrologue.

## Pages principales
- [Hypnothérapie](https://www.sophrologue-hypnotherapeute-jan.fr/hypnotherapie): l'hypnose ericksonienne et ce qu'elle traite
- [Sophrologie](https://www.sophrologue-hypnotherapeute-jan.fr/sophrologie): la sophrologie et ses indications
- [Séances d'hypnose](https://www.sophrologue-hypnotherapeute-jan.fr/seances-hypnose): déroulé d'une séance et nombre de séances
- [Accompagnements](https://www.sophrologue-hypnotherapeute-jan.fr/services): les motifs de consultation pris en charge
- [Les cabinets](https://www.sophrologue-hypnotherapeute-jan.fr/cabinets): les deux lieux de consultation
- [Cabinet de Rennes](https://www.sophrologue-hypnotherapeute-jan.fr/cabinets/rennes): centre médical SPORMED, 2A rue du Bourg Nouveau
- [Cabinet d'Acigné](https://www.sophrologue-hypnotherapeute-jan.fr/cabinets/acigne): cabinet pluridisciplinaire, 2 rue du Calvaire
- [À propos](https://www.sophrologue-hypnotherapeute-jan.fr/a-propos): son parcours et sa pratique
- [Galerie](https://www.sophrologue-hypnotherapeute-jan.fr/gallery): les cabinets en images

## Articles et conseils
- [Tous les articles](https://www.sophrologue-hypnotherapeute-jan.fr/blog): publications régulières sur l'hypnose et la sophrologie

## Profils officiels
- https://www.resalib.fr/praticien/67027-veronique-jan-hypnotherapeute-rennes
- https://www.medoucine.com/consultation/acigne/veronique-jan/4253
- https://www.facebook.com/profile.php?id=100089334794006
- https://www.linkedin.com/in/v%C3%A9ronique-jan-b27a32244

## Contact
- Cabinet de Rennes : 2A rue du Bourg Nouveau, 35000 Rennes
- Cabinet d'Acigné : 2 rue du Calvaire, 35690 Acigné
- [Prendre rendez-vous](https://www.sophrologue-hypnotherapeute-jan.fr/contact)
- Téléphone : 06 15 62 17 23 — vjso@hotmail.fr

Sitemap complet : https://www.sophrologue-hypnotherapeute-jan.fr/sitemap.xml
`

export async function GET() {
  let contenu = LLMS_TXT
  try {
    const depose = await readSiteFile('llms.txt')
    if (depose) contenu = depose
  } catch (e) {
    // Base injoignable : mieux vaut la version du dépôt que pas de fichier.
    console.error('[llms.txt]', e)
  }

  return new Response(contenu, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=60',
    },
  })
}
