/**
 * site-content.ts — Contenu du site Véronique Jan (hypnothérapeute & sophrologue)
 *
 * Toute la copie + tous les visuels par défaut sont centralisés ici.
 * Le CMS (via /api/content/[pageId]) peut surcharger n'importe quelle valeur
 * en runtime ; ce qui est ici sert de fallback / d'état initial.
 *
 * Pour les icônes : passe une chaîne ("Brain", "Leaf", "Moon"...) — elle est
 * résolue par `getIcon()` côté composant. Liste : https://lucide.dev/icons/
 */

// ============================================================================
//                          IMAGES — pool de visuels
// ============================================================================
// Remplace ces URLs Unsplash par les vraies photos (cabinets, portrait,
// ambiances). Garde le format auto+fit pour la performance.

// Pool de visuels NATURE APAISANTE — références Unsplash vérifiées (forêt,
// brume, eau calme, rayons de soleil), sans personne ni posture de yoga, dans
// l'esprit de l'ancien site (héro forêt). À remplacer à terme par les vraies
// photos de la praticienne (séances, cabinets, salles d'attente) via l'admin.
const un = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`
const unc = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=400&h=500&fit=crop&q=75`

// Identifiants vérifiés (description Unsplash entre parenthèses)
const NATURE = {
  forestAerial: '1503435980610-a51f3ddfee50', // forêt vue du ciel
  forestSunRays: '1530563937443-1f02f662fa5c', // rayons de soleil en forêt
  riverTrees: '1421790500381-fc9b5996f343', // rivière bordée d'arbres
  pinesMist: '1502252430442-aac78f397426', // pins dans la brume
  greenTrees: '1542273917363-3b1817f69a2d', // arbres verts vus du ciel
  forestDay: '1603976328262-4c1b46d7e6e8', // forêt verte en journée
  treesSunRays: '1448375240586-882707db888b', // arbres et rayons de soleil
  cloudsLake: '1581713872605-b9dfbc84eaa4', // nuages au-dessus du lac
  waterTrees: '1465189684280-6a8fa9b19a7a', // plan d'eau entouré d'arbres
  fogLake: '1561765781-f7de2b8c56a5', // brume sur le lac
  sunWater: '1724265663533-23caa99840d1', // soleil à travers les arbres sur l'eau
}

export const images = {
  // Hero homepage — [0] = vraie photo de séance ; suivantes = nature apaisante
  heroCarousel: [
    '/photos/seance-hypnose.png',
    un(NATURE.forestSunRays, 1920),
    un(NATURE.waterTrees, 1920),
  ],

  // Section "À propos" sur la home — portrait de Véronique Jan
  story: '/photos/veronique-jan.png',

  // Page À propos — image principale du hero (portrait praticienne)
  aboutHero: '/photos/veronique-jan.png',

  // Page Services — image de fond du hero (nature apaisante)
  servicesHero: un(NATURE.pinesMist, 1920),

  // Page Contact — image de fond du hero
  contactHero: un(NATURE.fogLake, 1920),

  // Page À propos — galerie 4 images
  aboutGallery: [
    un(NATURE.greenTrees, 600),
    un(NATURE.forestDay, 600),
    un(NATURE.waterTrees, 600),
    un(NATURE.treesSunRays, 600),
  ],

  // Page Services — 8 images illustrant chaque accompagnement
  services: [
    un(NATURE.forestAerial),
    un(NATURE.forestSunRays),
    un(NATURE.riverTrees),
    un(NATURE.pinesMist),
    un(NATURE.forestDay),
    un(NATURE.treesSunRays),
    un(NATURE.cloudsLake),
    un(NATURE.waterTrees),
  ],

  // Section CTA — 2 colonnes d'images animées en marquee vertical
  ctaScrollColumns: {
    col1: [
      unc(NATURE.forestAerial),
      unc(NATURE.riverTrees),
      unc(NATURE.cloudsLake),
      unc(NATURE.waterTrees),
    ],
    col2: [
      unc(NATURE.forestSunRays),
      unc(NATURE.pinesMist),
      unc(NATURE.fogLake),
      unc(NATURE.treesSunRays),
    ],
  },

  // GalleryCarousel sur la home
  homeGallery: [
    un(NATURE.forestSunRays, 720),
    un(NATURE.riverTrees, 720),
    un(NATURE.forestDay, 720),
    un(NATURE.waterTrees, 720),
    un(NATURE.greenTrees, 720),
    un(NATURE.cloudsLake, 720),
  ],
}

// ============================================================================
//                          HOME — Hero + sections
// ============================================================================

export const heroContent = {
  eyebrow: 'Hypnothérapeute & Sophrologue · Rennes · Acigné',
  title: 'Hypnose thérapeutique et Sophrologie',
  description:
    "Praticienne certifiée depuis 20 ans, je vous accompagne avec l'hypnose ericksonienne et la sophrologie caycédienne pour agir sur le stress, l'anxiété, la dépression, les phobies, le sommeil et la douleur, et retrouver votre équilibre.",
  button1: 'Prendre rendez-vous',
  button2: 'Découvrir les séances',
  images: images.heroCarousel,
}

export const storyContent = {
  eyebrow: 'À propos',
  title: 'Une approche humaine et bienveillante',
  paragraph1:
    "Ancienne enseignante devenue thérapeute il y a vingt ans, je pratique l'hypnose et la sophrologie à Acigné et à Rennes. Formée à la sophrologie caycédienne à l'ISR et à l'hypnose ericksonienne à l'Institut Émergences du Dr Claude Virot, je mets ces approches au service de votre mieux-être.",
  paragraph2:
    "Chaque accompagnement débute par un entretien approfondi pour comprendre votre histoire, vos symptômes et vos objectifs, afin de construire un protocole personnalisé. Les séances s'adressent à tous : enfants, adolescents, adultes, femmes enceintes et jeunes mamans.",
  image: images.story,
}

// Aperçu des accompagnements sur la home (4 cards)
export const servicesPreviewContent = {
  eyebrow: 'Mes accompagnements',
  title: 'Deux approches complémentaires pour votre mieux-être',
  description:
    "L'hypnose ericksonienne et la sophrologie caycédienne mobilisent vos ressources intérieures pour dénouer ce qui vous bloque, en douceur et à votre rythme.",
  items: [
    {
      iconName: 'Brain',
      title: 'Hypnothérapie ericksonienne',
      desc: "Une thérapie brève qui mobilise votre inconscient pour activer vos capacités de changement et de mieux-être.",
    },
    {
      iconName: 'Leaf',
      title: 'Sophrologie caycédienne',
      desc: "Une méthode douce de relaxation du corps et de l'esprit pour gérer votre stress et développer confiance et sérénité.",
    },
    {
      iconName: 'Moon',
      title: 'Stress, sommeil & anxiété',
      desc: "Apaiser les tensions nerveuses et physiques, retrouver un sommeil réparateur et reprendre le dessus sur l'anxiété.",
    },
    {
      iconName: 'ShieldCheck',
      title: 'Accompagnement à l’arrêt du tabac',
      desc: "Un accompagnement ciblé pour vous libérer du tabac et des compulsions alimentaires, à votre rythme.",
    },
  ],
}

// « Comment se déroule un accompagnement » — 3 étapes (façon parcours)
export const howItWorksContent = {
  eyebrow: 'Le déroulé',
  title: 'Comment se déroule un accompagnement',
  description:
    "Un cheminement simple et rassurant, à votre rythme, du premier contact jusqu'à votre autonomie retrouvée.",
  steps: [
    {
      iconName: 'HeartHandshake',
      title: 'Premier échange',
      desc: "On fait connaissance lors d'un entretien approfondi : votre histoire, vos symptômes et vos objectifs, sans jugement.",
    },
    {
      iconName: 'Sparkles',
      title: 'Séances sur mesure',
      desc: "Un protocole personnalisé en hypnose ericksonienne et sophrologie caycédienne, construit pour vous et avec vous.",
    },
    {
      iconName: 'Smile',
      title: 'Autonomie & mieux-être',
      desc: "Vous repartez avec des outils concrets à pratiquer au quotidien pour entretenir votre équilibre durablement.",
    },
  ],
}

/**
 * ⚠️ AVIS — NE RIEN INVENTER ICI.
 *
 * Cette liste ne doit contenir que de véritables avis Google, recopiés mot pour
 * mot depuis les deux fiches (Rennes et Acigné), avec le prénom/nom réellement
 * affiché par leur auteur. Publier des avis fictifs constitue une pratique
 * commerciale trompeuse (art. L121-2 du code de la consommation) et se voit
 * immédiatement quand on compare le site à la fiche Google.
 *
 * Tant que les vrais avis n'ont pas été collés ici, la section ne s'affiche pas
 * et le site renvoie simplement vers les fiches Google.
 *
 * Format attendu :
 *   { name: 'Justine Callerais', company: 'Avis Google · Acigné', text: '…', stars: 5 }
 */
export const testimonialsContent = {
  eyebrow: 'Avis',
  title: 'Ils ont retrouvé leur équilibre',
  description:
    "Des avis déposés sur mes fiches Google (5,0/5 à Rennes comme à Acigné). Un aperçu ci-dessous ; l'intégralité est consultable sur Google.",
  /** Note globale réelle des deux fiches Google, réaffichée dans le badge. */
  googleRating: '5,0',
  /** Lien de repli / « voir plus », vers la page avis du site. */
  fallbackUrl: 'https://www.sophrologue-hypnotherapeute-jan.fr/page-avis',
  fallbackLabel: 'Voir tous les avis Google',
  /**
   * Avis Google authentiques (fiche de Rennes), recopiés mot pour mot.
   * Sélection volontairement variée : un motif de consultation par avis
   * (tabac, sommeil, angoisses, conduite, confiance, première séance) pour
   * couvrir les mots-clés des fiches sans répéter « à l'écoute » six fois.
   * Noms abrégés à l'initiale du nom de famille (données de santé).
   * ⚠️ Ne publier ici que de vrais avis, jamais de texte réécrit ou inventé.
   */
  items: [
    {
      name: 'Nadège G.',
      company: 'Arrêt du tabac',
      text: "Première approche favorable. Consultée pour un sevrage au tabac, Mme Jan a su me mettre à l'aise et prendre en compte mes besoins. Il ne s'agit pas de magie, je ne vais pas arrêter du jour au lendemain mais cette première consultation me donne de l'espoir.",
      stars: 5,
    },
    {
      name: 'Nolwenn B.',
      company: 'Sommeil',
      text: "Un grand merci à Véronique Jan pour son professionnalisme et sa bienveillance. Elle m'a vraiment aidé dans mes problèmes de sommeil et de somnambulisme. Je n'ai pas eu une seule crise depuis que j'ai réalisée mes séances avec elle. Je recommande vivement Madame Jan",
      stars: 5,
    },
    {
      name: 'Karine M.',
      company: 'Gestion des angoisses',
      text: "Madame JAN est très à l'écoute de ses patients, les outils qu'elle donne pour gérer ses angoisses fonctionnent très bien. Elle prend son temps, toujours bienveillante, c'est une personne formidable que je recommande à 100%.",
      stars: 5,
    },
    {
      name: 'Muriel L.',
      company: 'Hypnose & conduite',
      text: "Madame Jan est bienveillante, à l'écoute, perspicace dans son analyse et j'ai de plus beaucoup apprécié ses explications sur ce qu'était l'hypnose et son fonctionnement. J'espère sincèrement que la poursuite des séances me fera retrouver la sérénité sur la route !",
      stars: 5,
    },
    {
      name: 'Sylvie B.',
      company: 'Confiance en soi',
      text: "Une écoute, des échanges qui mettent en confiance et favorisent les bienfaits de l'hypnose. Mme Jan explique, conseille, nous fait nous interroger sur le pourquoi de ces séances et nous offre la possibilité de trouver les clés qui vont nous permettre d'avancer. Je recommande vivement Mme Jan.",
      stars: 5,
    },
    {
      name: 'Nathalie T.',
      company: 'Première séance',
      text: "1ere expérience avec un hypnothérapeute ce jour. Merci à Mme JAN pour son écoute, son professionnalisme et ses explications qui m'ont permis de bien vivre cette première consultation. Je me suis sentie moins tendue en sortant et j'espère qu'elle pourra m'aider.",
      stars: 5,
    },
  ] as { name: string; company: string; text: string; stars: number }[],
}

export const galleryContent = {
  eyebrow: 'Galerie',
  title: 'Un espace propice à la détente',
  images: images.homeGallery,
}

export const ctaContent = {
  eyebrow: 'Prendre soin de soi',
  title: 'Prêt·e à entamer votre changement ?',
  description:
    "Un premier échange pour faire connaissance, comprendre votre besoin et envisager ensemble l'accompagnement le plus adapté.",
  button: 'Prendre rendez-vous',
  scrollImages: images.ctaScrollColumns,
}

export const faqContent = {
  eyebrow: 'FAQ',
  title: 'Questions fréquentes',
  description:
    "Les réponses aux questions que l'on me pose le plus souvent avant une première séance.",
  items: [
    {
      question: "Quelle est la différence entre hypnose et sophrologie ?",
      answer:
        "L'hypnose ericksonienne est une thérapie brève qui s'appuie sur l'inconscient pour activer vos ressources et déclencher un changement. La sophrologie est une méthode pédagogique de relaxation que vous apprenez à pratiquer en autonomie pour gérer votre stress au quotidien. Les deux approches sont complémentaires.",
    },
    {
      question: "Vais-je perdre le contrôle pendant une séance d'hypnose ?",
      answer:
        "Non. L'hypnose thérapeutique n'a rien à voir avec l'hypnose de spectacle. Vous restez conscient·e et acteur·rice de la séance à tout moment. Je suis une praticienne certifiée dédiée à une action thérapeutique, jamais au divertissement.",
    },
    {
      question: "Combien de séances faut-il prévoir ?",
      answer:
        "L'hypnose est une thérapie brève : quelques séances suffisent généralement. Le nombre exact dépend de votre objectif et de votre situation. Nous faisons le point ensemble dès le premier entretien.",
    },
    {
      question: "Combien coûte une séance ?",
      answer:
        "Une séance d'hypnose est facturée entre 57 et 65 €, une séance de sophrologie entre 45 et 57 €, selon la localité, la durée et l'éventuel déplacement. Un tarif spécifique est proposé pour les enfants, selon l'âge. Le règlement se fait par chèque, espèces ou virement ; la carte bancaire n'est pas acceptée.",
    },
    {
      question: "Où se déroulent les séances ?",
      answer:
        "Je consulte dans deux cabinets : à Rennes, au sein du centre médical SPORMED (2A Rue du Bourg Nouveau), et à Acigné (2 Rue du Calvaire). Je me déplace aussi à domicile dans un rayon de 20 km autour de chaque cabinet, et la téléconsultation est possible à partir de la deuxième séance.",
    },
    {
      question: "Quels sont vos horaires ?",
      answer:
        "Les deux cabinets sont ouverts du lundi au vendredi de 8h00 à 21h30, et le samedi de 8h00 à 20h00. Fermé le dimanche. Par téléphone ou SMS, je vous rappelle dans la demi-journée.",
    },
    {
      question: "À qui s'adressent les séances ?",
      answer:
        "À tout type de public : enfants, adolescents, adultes, femmes enceintes et jeunes mamans. J'accompagne également des sportifs, des professionnels de santé et des entreprises.",
    },
  ],
}

// ============================================================================
//                          ABOUT — page À propos
// ============================================================================

export const aboutContent = {
  hero: {
    eyebrow: 'À propos',
    title: 'Débloquer et activer vos ressources endormies',
    description:
      "Sophrologue et hypnothérapeute depuis 2006, je vous accueille à Acigné et à Rennes. Mon rôle : vous aider à mobiliser vos propres ressources pour retrouver équilibre, sérénité et confiance.",
    image: images.aboutHero,
  },
  stats: [
    { value: '5,0', label: 'Avis Google' },
    { value: '20 ans', label: "D'expérience" },
    { value: '2', label: 'Cabinets' },
    { value: '100%', label: 'Personnalisé' },
  ],
  values: [
    {
      iconName: 'Heart',
      title: 'Écoute & bienveillance',
      description:
        'Un entretien approfondi à chaque démarrage pour comprendre votre histoire, vos symptômes et vos objectifs, sans jugement.',
    },
    {
      iconName: 'Sparkles',
      title: 'Approches certifiées',
      description:
        "Sophrologie caycédienne (ISR, Bernard Santerre) et hypnose ericksonienne (Institut Émergences, Dr Claude Virot) : des méthodes reconnues.",
    },
    {
      iconName: 'Users',
      title: 'Sur mesure & pour tous',
      description:
        "Un protocole adapté à chacun : enfants, adolescents, adultes, femmes enceintes, sportifs, professionnels et entreprises.",
    },
  ],
  gallery: images.aboutGallery,
}

// ============================================================================
//                          SERVICES — page Séances
// ============================================================================

export const servicesContent = {
  hero: {
    eyebrow: 'Mes séances',
    title: "Hypnose et sophrologie au service de votre mieux-être",
    description:
      "Des accompagnements en thérapie brève, individuels ou en groupe, adaptés à votre situation et à votre rythme.",
  },
  kpis: [
    { value: 'dès 45 €', label: 'la séance' },
    { value: '45 min – 1h', label: 'par séance' },
    { value: '2', label: 'cabinets + domicile' },
  ],
  // Chaque accompagnement : icône, titre, description, 3 points clés, image
  list: [
    {
      iconName: 'Brain',
      title: 'Hypnothérapie ericksonienne',
      description: "Une thérapie brève de quelques séances qui mobilise votre inconscient pour activer vos capacités d'auto-guérison et de changement.",
      points: ['Thérapie brève', 'Praticienne certifiée', 'Action thérapeutique'],
      image: images.services[0],
    },
    {
      iconName: 'Leaf',
      title: 'Sophrologie caycédienne',
      description: "Une méthode pédagogique de relaxation du corps et de l'esprit, à pratiquer en autonomie pour gérer le stress et développer vos ressources.",
      points: ['Relaxation profonde', 'Outils au quotidien', 'Individuel ou en groupe'],
      image: images.services[1],
    },
    {
      iconName: 'Wind',
      title: 'Stress & anxiété',
      description: "Apaiser les tensions nerveuses et physiques, gagner en autonomie face au stress et retrouver un état de calme durable.",
      points: ['Gestion des tensions', 'Lâcher-prise', 'Sérénité retrouvée'],
      image: images.services[2],
    },
    {
      iconName: 'Moon',
      title: 'Troubles du sommeil',
      description: "Retrouver un sommeil réparateur en agissant sur les causes de l'insomnie et en installant de nouveaux automatismes apaisants.",
      points: ['Endormissement facilité', 'Sommeil profond', 'Réveils apaisés'],
      image: images.services[3],
    },
    {
      iconName: 'ShieldCheck',
      title: 'Accompagnement à l’arrêt du tabac',
      description: "Se libérer du tabac et des compulsions grâce à un accompagnement ciblé et respectueux de votre rythme.",
      points: ['Arrêt du tabac', 'Compulsions alimentaires', 'Accompagnement sur mesure'],
      image: images.services[4],
    },
    {
      iconName: 'HeartPulse',
      title: 'Gestion de la douleur',
      description: "Accompagner la douleur, les maladies psychosomatiques et préparer ou soutenir un protocole médical, en complément du suivi.",
      points: ['Douleurs chroniques', 'Soutien médical', 'Préparation aux soins'],
      image: images.services[5],
    },
    {
      iconName: 'Sparkles',
      title: 'Confiance & développement personnel',
      description: "Renforcer l'estime de soi, dépasser ses blocages, développer concentration et confiance pour avancer plus sereinement.",
      points: ['Estime de soi', 'Concentration', 'Dépassement des blocages'],
      image: images.services[6],
    },
    {
      iconName: 'Baby',
      title: 'Préparation & accompagnement',
      description: "Préparation à la naissance, accompagnement des sportifs, des examens et des moments de vie qui demandent ressources et ancrage.",
      points: ['Femmes enceintes', 'Sportifs & examens', 'Enfants & adolescents'],
      image: images.services[7],
    },
  ],
}

// ============================================================================
//                          CONTACT — page Prendre rendez-vous
// ============================================================================

export const contactContent = {
  hero: {
    eyebrow: 'Prendre rendez-vous',
    title: 'Prenons rendez-vous',
    description:
      "Par téléphone, SMS, e-mail ou directement en ligne via RESALIB et MEDOUCINE. Je vous rappelle dans la demi-journée.",
  },
  // Les coordonnées (phone, email, address) viennent de siteConfig dans seo.ts
  // RESALIB est cité en premier : c'est la plateforme retenue par Google pour
  // le bouton « Prendre rendez-vous » des deux fiches.
  booking: [
    { label: 'Réserver sur RESALIB', url: 'https://www.resalib.fr/praticien/67027-veronique-jan-hypnotherapeute-rennes', note: 'Cabinet de Rennes' },
    { label: 'Réserver sur MEDOUCINE', url: 'https://www.medoucine.com/consultation/acigne/veronique-jan/4253', note: 'Acigné & Rennes' },
  ],
  cabinets: [
    {
      name: 'Cabinet de Rennes',
      address: '2A Rue du Bourg Nouveau, 35000 Rennes',
      note: 'Centre médical SPORMED / Sport Santé Institut — quartier Rennes Atalante',
    },
    {
      name: 'Cabinet d\'Acigné',
      address: '2 Rue du Calvaire, 35690 Acigné',
      note: 'Avec Xavier Jan (kinésiologue) et Quentin Sanson (ostéopathe)',
    },
  ],
  hours: [
    { days: 'Lundi – Vendredi', value: '08h00 – 21h30' },
    { days: 'Samedi', value: '08h00 – 20h00' },
    { days: 'Dimanche', value: 'Fermé' },
  ],
}
