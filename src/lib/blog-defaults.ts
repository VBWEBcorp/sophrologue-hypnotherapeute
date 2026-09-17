// Valeurs par défaut de la section blog. Le code porte les valeurs, la base ne stocke que les
// écarts saisis dans l'espace client : sans document BlogSettings en base, c'est ceci qui
// s'affiche, dans la page, ses métadonnées, l'API et le sitemap. Un seul endroit à modifier.
export const BLOG_DEFAULTS = {
  enabled: true,
  eyebrow: 'Actualités',
  title: 'Conseils et actualités',
  description:
    "Des articles clairs sur l'hypnose Ericksonienne et la sophrologie : pour quels motifs consulter, " +
    'comment se déroulent les séances à Rennes, à Acigné et à domicile, et ce qu\'il faut savoir avant un premier rendez-vous.',
}
