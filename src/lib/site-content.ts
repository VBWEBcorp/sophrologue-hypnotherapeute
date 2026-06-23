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

export const images = {
  // Hero homepage — 3 images qui défilent en carousel
  // [0] = vraie photo de séance ; suivantes = ambiances apaisantes
  heroCarousel: [
    '/photos/seance-hypnose.png',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1920&q=80',
  ],

  // Section "À propos" sur la home — portrait de Véronique Jan
  story: '/photos/veronique-jan.png',

  // Page À propos — image principale du hero (portrait praticienne)
  aboutHero: '/photos/veronique-jan.png',

  // Page Services — image de fond du hero (ambiance détente)
  servicesHero:
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1920&q=80',

  // Page Contact — image de fond du hero
  contactHero:
    'https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&w=1920&q=80',

  // Page À propos — galerie 4 images
  aboutGallery: [
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=80',
  ],

  // Page Services — 8 images illustrant chaque accompagnement
  services: [
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1455642305367-68834a1da7ab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=80',
  ],

  // Section CTA — 2 colonnes d'images animées en marquee vertical
  ctaScrollColumns: {
    col1: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=500&fit=crop&q=75',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=500&fit=crop&q=75',
      'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=500&fit=crop&q=75',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop&q=75',
    ],
    col2: [
      'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=500&fit=crop&q=75',
      'https://images.unsplash.com/photo-1528319725582-ddc096101511?w=400&h=500&fit=crop&q=75',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=500&fit=crop&q=75',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=500&fit=crop&q=75',
    ],
  },

  // GalleryCarousel sur la home
  homeGallery: [
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=720&q=80',
    'https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&w=720&q=80',
  ],
}

// ============================================================================
//                          HOME — Hero + sections
// ============================================================================

export const heroContent = {
  eyebrow: 'Hypnothérapeute & Sophrologue · Acigné · Rennes',
  title: 'Hypnose thérapeutique et Sophrologie',
  description:
    "Praticienne certifiée depuis 2006, je vous accompagne avec l'hypnose ericksonienne et la sophrologie caycédienne pour gérer le stress, l'anxiété, les phobies, le sommeil, la douleur et les addictions — et retrouver votre équilibre.",
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
      title: 'Arrêt du tabac & addictions',
      desc: "Un accompagnement ciblé pour vous libérer du tabac, de l'alcool ou des compulsions, à votre rythme.",
    },
  ],
}

export const testimonialsContent = {
  eyebrow: 'Témoignages',
  title: 'Ils ont retrouvé leur équilibre',
  description:
    "Des personnes accompagnées à Acigné et à Rennes qui ont franchi une étape importante.",
  items: [
    { name: 'Sandrine M.', company: 'Gestion du stress', text: "Après quelques séances, j'ai appris à gérer mon stress au quotidien. Véronique est à l'écoute, bienveillante et très professionnelle.", stars: 5 },
    { name: 'Julien P.', company: 'Arrêt du tabac', text: "J'ai arrêté de fumer après 20 ans de tabac. Je ne pensais pas que ce serait possible aussi sereinement.", stars: 5 },
    { name: 'Claire D.', company: 'Sommeil', text: "Mes troubles du sommeil se sont nettement améliorés. La sophrologie m'a donné des outils que j'utilise tous les jours.", stars: 5 },
    { name: 'Marc L.', company: 'Anxiété', text: "Un accompagnement vraiment personnalisé. J'ai retrouvé confiance et une vraie sérénité face à mes angoisses.", stars: 5 },
    { name: 'Émilie R.', company: 'Préparation à la naissance', text: "La sophrologie m'a beaucoup aidée pendant ma grossesse et le jour J. Merci pour votre douceur.", stars: 5 },
    { name: 'Thomas B.', company: 'Phobies', text: "Ma phobie me gâchait la vie. Grâce à l'hypnose, j'ai pu la dépasser en quelques séances seulement.", stars: 5 },
    { name: 'Nathalie G.', company: 'Confiance en soi', text: "J'ai gagné en confiance et en estime de moi. Les séances sont un vrai moment pour soi.", stars: 5 },
    { name: 'Pauline V.', company: 'Gestion du poids', text: "Un accompagnement bienveillant qui m'a aidée à reprendre une relation apaisée avec l'alimentation.", stars: 5 },
  ],
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
        "La première séance est à 57 € (entretien + séance technique). Les séances suivantes débutent à 50 €, selon le cabinet, la durée et l'éventuel déplacement. Un tarif spécifique est proposé pour les enfants, sur demande.",
    },
    {
      question: "Où se déroulent les séances ?",
      answer:
        "Je consulte dans deux cabinets : à Acigné (2 Rue du Calvaire) et à Rennes (centre SPORMED, 2A Rue du Bourg Nouveau). Je propose aussi des visites à domicile dans un rayon de 20 km, ainsi que des consultations en visio pour les patients déjà suivis.",
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
    { value: 'Depuis 2006', label: 'En exercice' },
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
    { value: '57 €', label: 'la première séance' },
    { value: '45-60 min', label: 'par séance' },
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
      title: 'Arrêt du tabac & addictions',
      description: "Se libérer du tabac, de l'alcool, du cannabis ou des compulsions grâce à un accompagnement ciblé et respectueux de votre rythme.",
      points: ['Tabac, alcool, cannabis', 'Compulsions alimentaires', 'Accompagnement sur mesure'],
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
      "Par téléphone, SMS, e-mail ou directement en ligne via MEDOUCINE et RESALIB. Je vous réponds dans les meilleurs délais.",
  },
  // Les coordonnées (phone, email, address) viennent de siteConfig dans seo.ts
  // Cabinets et plateformes de réservation :
  booking: [
    { label: 'Réserver sur MEDOUCINE', url: 'https://www.medoucine.com/consultation/acigne/veronique-jan/4253', note: 'Acigné & Rennes' },
    { label: 'Réserver sur RESALIB', url: 'https://www.resalib.fr/praticien/67027-veronique-jan-hypnotherapeute-rennes', note: 'Cabinet de Rennes' },
  ],
  cabinets: [
    {
      name: 'Cabinet d\'Acigné',
      address: '2 Rue du Calvaire, 35690 Acigné',
      note: 'Avec Xavier Jan (kinésiologue) et Quentin Sanson (ostéopathe)',
    },
    {
      name: 'Cabinet de Rennes',
      address: '2A Rue du Bourg Nouveau, 35000 Rennes',
      note: 'Centre médical SPORMED',
    },
  ],
}
