/**
 * subpages.ts — Contenu des pages thématiques.
 * Chaque page compose une suite de sections typées, rendues par
 * <SubpageContent /> (src/components/sections/subpage-content.tsx).
 * Les mises en page diffèrent d'une page à l'autre (split, timeline, encart…).
 */

import { siteConfig } from '@/lib/seo'

export const MEDOUCINE_URL = siteConfig.booking.medoucine
export const RESALIB_URL = siteConfig.booking.resalib
export const SPORMED_URL = 'https://www.spormed.fr/accueil/'

export type SubpageSection =
  | { kind: 'prose'; eyebrow?: string; title: string; paragraphs: string[] }
  | {
      kind: 'split'
      eyebrow?: string
      title: string
      paragraphs: string[]
      image: string
      reverse?: boolean
      bullets?: string[]
    }
  | {
      kind: 'features'
      eyebrow?: string
      title: string
      description?: string
      items: { iconName: string; title: string; desc: string; href?: string; external?: boolean }[]
    }
  | { kind: 'checklist'; eyebrow?: string; title: string; description?: string; items: string[] }
  | {
      kind: 'timeline'
      eyebrow?: string
      title: string
      description?: string
      steps: { iconName?: string; title: string; desc: string }[]
    }
  | { kind: 'highlight'; eyebrow?: string; title: string; paragraphs: string[]; image?: string }
  | {
      kind: 'pricing'
      eyebrow?: string
      title: string
      description?: string
      items: { price: string; label: string; note?: string }[]
    }
  | {
      kind: 'cabinets'
      eyebrow?: string
      title: string
      description?: string
      items: {
        id?: string
        name: string
        address: string
        note?: string
        href?: string
        bookingUrl?: string
        bookingLabel?: string
      }[]
    }

export type Subpage = {
  slug: string
  metaTitle: string
  metaDescription: string
  hero: { eyebrow: string; title: string; description: string; breadcrumb: string; backgroundImage: string }
  sections: SubpageSection[]
}

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`

export const subpages: Record<string, Subpage> = {
  // ════════════════════════════════ HYPNOTHÉRAPIE ════════════════════════════
  hypnotherapie: {
    slug: 'hypnotherapie',
    metaTitle: 'Hypnothérapie ericksonienne',
    metaDescription:
      "Hypnothérapie ericksonienne à Acigné et Rennes : une thérapie brève et certifiée pour gérer le stress, l'anxiété, les phobies, le sommeil, la douleur et les addictions.",
    hero: {
      eyebrow: 'Hypnothérapie',
      title: 'Hypnothérapie ericksonienne à Acigné & Rennes',
      description:
        "Une thérapie brève et certifiée qui mobilise vos ressources conscientes et inconscientes pour activer vos capacités de changement.",
      breadcrumb: 'Hypnothérapie',
      backgroundImage: '/photos/seance-hypnose.png',
    },
    sections: [
      {
        kind: 'split',
        eyebrow: 'La méthode',
        title: "Qu'est-ce que l'hypnose thérapeutique ?",
        image: '/photos/seance-hypnose.png',
        paragraphs: [
          "L'hypnose ericksonienne est une thérapie brève de quelques séances. Elle vous met en contact avec vos ressources conscientes et inconscientes pour activer vos propres capacités de mieux-être et de guérison.",
          "Contrairement à l'hypnose de spectacle, l'hypnothérapie n'a aucun objectif de divertissement : je suis une praticienne certifiée dédiée à une action thérapeutique, formée à l'Institut Émergences du Dr Claude Virot, à Rennes.",
        ],
        bullets: ['Thérapie brève', 'Praticienne certifiée', 'Action thérapeutique', 'À votre rythme'],
      },
      {
        kind: 'checklist',
        eyebrow: 'Indications',
        title: "Ce que l'hypnose peut accompagner",
        description: "L'hypnose thérapeutique aide à dépasser de nombreux troubles :",
        items: [
          'États dépressifs',
          'Douleurs physiques',
          'Maladies psychosomatiques',
          'Troubles anxieux et angoisses',
          'Troubles du sommeil',
          'Phobies',
          'Sevrage (tabac, alcool, cannabis, drogues dures)',
          'Troubles alimentaires et compulsions',
          'Acouphènes',
          'Préparation aux actes médicaux',
        ],
      },
      {
        kind: 'features',
        eyebrow: 'Pourquoi',
        title: "Pourquoi choisir l'hypnose ?",
        items: [
          { iconName: 'Sparkles', title: 'Thérapie brève', desc: 'Quelques séances suffisent généralement pour des résultats durables.' },
          { iconName: 'ShieldCheck', title: 'Praticienne certifiée', desc: "Formée à l'hypnose ericksonienne médicale (Institut Émergences, Dr Claude Virot)." },
          { iconName: 'Heart', title: 'Sur mesure', desc: 'Un protocole adapté à votre histoire, vos symptômes et vos objectifs.' },
        ],
      },
    ],
  },

  // ════════════════════════════════ SÉANCES D'HYPNOSE ════════════════════════
  'seances-hypnose': {
    slug: 'seances-hypnose',
    metaTitle: "Séances d'hypnose : le déroulement",
    metaDescription:
      "Comment se déroule une séance d'hypnose avec Véronique Jan : entretien, induction, état d'hypnose et activation des ressources. Vous restez conscient·e et acteur·rice.",
    hero: {
      eyebrow: "Séances d'hypnose",
      title: "Le déroulement d'une séance d'hypnose",
      description:
        "De l'entretien initial au travail en état d'hypnose : voici comment se passe concrètement une séance.",
      breadcrumb: "Séances d'hypnose",
      backgroundImage: '/photos/seance-hypnose.png',
    },
    sections: [
      {
        kind: 'timeline',
        eyebrow: 'Étape par étape',
        title: "Les 5 temps d'une séance",
        description: 'Chaque séance suit une progression douce et structurée.',
        steps: [
          { iconName: 'Users', title: "L'entretien", desc: 'Un échange approfondi pour comprendre votre histoire, vos symptômes et définir votre objectif.' },
          { iconName: 'Leaf', title: 'La détente', desc: "Une progression douce vers un état de relaxation profonde, parfois accompagnée d'un support audio." },
          { iconName: 'Brain', title: "L'état d'hypnose", desc: 'Un état modifié de conscience, guidé, où l’on travaille sur les émotions et les automatismes.' },
          { iconName: 'Sparkles', title: 'Les solutions', desc: 'Votre inconscient mobilise ses ressources pour construire le changement.' },
          { iconName: 'Sun', title: 'Le retour', desc: "Un retour progressif et un temps d'échange sur ce qui a été vécu." },
        ],
      },
      {
        kind: 'highlight',
        eyebrow: 'Bon à savoir',
        title: 'Resterez-vous conscient·e ?',
        image: '/photos/seance-hypnose.png',
        paragraphs: [
          "Oui. À aucun moment vous ne perdez le contrôle. L'état d'hypnose est un état naturel, proche de la rêverie, que nous traversons tous au quotidien. Vous restez acteur·rice de votre séance du début à la fin.",
          "Un équipement audio peut être utilisé pour favoriser votre réceptivité et approfondir la détente.",
        ],
      },
    ],
  },

  // ════════════════════════════════ SOPHROLOGIE ══════════════════════════════
  sophrologie: {
    slug: 'sophrologie',
    metaTitle: 'Sophrologie caycédienne',
    metaDescription:
      "Sophrologie caycédienne à Acigné et Rennes : une méthode douce de relaxation pour gérer le stress, l'anxiété, le sommeil et développer confiance et sérénité. Tarifs et séances.",
    hero: {
      eyebrow: 'Sophrologie',
      title: 'La sophrologie pour apaiser stress et angoisses',
      description:
        "Une méthode douce de relaxation du corps et de l'esprit, que vous apprenez à pratiquer en autonomie au quotidien.",
      breadcrumb: 'Sophrologie',
      backgroundImage: u('1518611012118-696072aa579a'),
    },
    sections: [
      {
        kind: 'split',
        eyebrow: 'La méthode',
        title: "Qu'est-ce que la sophrologie ?",
        image: u('1545389336-cf090694435e'),
        reverse: true,
        paragraphs: [
          "La sophrologie est une méthode pédagogique qui associe des techniques de relaxation du corps et de l'esprit, mise au point par le Dr Caycedo, neuropsychiatre.",
          "Après l'avoir apprise avec une professionnelle, vous pouvez gérer seul·e votre stress au quotidien : relâcher les tensions physiques et psychologiques, activer vos ressources et développer confiance et concentration.",
        ],
      },
      {
        kind: 'checklist',
        eyebrow: 'Bienfaits',
        title: 'Les bienfaits de la sophrologie',
        items: [
          "Gestion du stress et de l'anxiété",
          'Amélioration du bien-être',
          'Relaxation et détente',
          'Confiance en soi',
          'Gestion du poids et des compulsions alimentaires',
          'Accompagnement de la boulimie et de l’anorexie',
          'Dépassement des blocages',
          'Développement de la concentration',
        ],
      },
      {
        kind: 'features',
        eyebrow: 'En pratique',
        title: 'Comment se déroulent les séances',
        items: [
          { iconName: 'Leaf', title: 'Durée', desc: 'Des séances de 45 minutes à 1 heure.' },
          { iconName: 'Users', title: 'Format', desc: 'En individuel ou en groupe, selon vos besoins.' },
          { iconName: 'Baby', title: 'Pour tous', desc: 'Enfants, adolescents, adultes, femmes enceintes, jeunes mamans.' },
        ],
      },
      {
        kind: 'pricing',
        eyebrow: 'Tarifs',
        title: 'Mes tarifs',
        items: [
          { price: '57 €', label: 'Première séance', note: 'Entretien + séance technique' },
          { price: 'dès 50 €', label: 'Séances suivantes', note: 'Selon le cabinet, la durée et le déplacement' },
          { price: 'Sur demande', label: 'Enfants', note: 'Tarif spécifique selon la situation' },
        ],
      },
    ],
  },

  // ════════════════════════════════ MES CABINETS (overview) ══════════════════
  cabinets: {
    slug: 'cabinets',
    metaTitle: 'Mes cabinets à Acigné & Rennes',
    metaDescription:
      "Véronique Jan vous accueille dans deux cabinets, à Acigné (2 Rue du Calvaire) et à Rennes (centre SPORMED), ainsi qu'à domicile dans un rayon de 20 km et en visio.",
    hero: {
      eyebrow: 'Mes cabinets',
      title: 'Mes cabinets à Acigné & Rennes',
      description:
        "Deux lieux pour vous accueillir, ainsi que des visites à domicile dans un rayon de 20 km et des consultations en visio pour les patients suivis.",
      breadcrumb: 'Mes cabinets',
      backgroundImage: u('1528319725582-ddc096101511'),
    },
    sections: [
      {
        kind: 'cabinets',
        eyebrow: 'Adresses',
        title: 'Où me rencontrer',
        items: [
          {
            id: 'rennes',
            name: 'Cabinet de Rennes',
            address: '2A Rue du Bourg Nouveau, 35000 Rennes',
            note: 'Au sein du centre médical SPORMED.',
            href: '/cabinets/rennes',
            bookingUrl: RESALIB_URL,
            bookingLabel: 'Réserver sur RESALIB',
          },
          {
            id: 'acigne',
            name: "Cabinet d'Acigné",
            address: '2 Rue du Calvaire, 35690 Acigné',
            note: 'En association avec Xavier Jan (kinésiologue) et Quentin Sanson (ostéopathe).',
            href: '/cabinets/acigne',
            bookingUrl: MEDOUCINE_URL,
            bookingLabel: 'Réserver sur MEDOUCINE',
          },
        ],
      },
      {
        kind: 'features',
        eyebrow: 'Autres modalités',
        title: 'Je me déplace aussi vers vous',
        items: [
          { iconName: 'Home', title: 'À domicile', desc: 'Visites à domicile dans un rayon de 20 km autour des cabinets.' },
          { iconName: 'Smartphone', title: 'En visio', desc: 'Consultations à distance pour les patients déjà suivis.' },
          { iconName: 'Heart', title: 'Hôpital & entreprise', desc: 'Interventions auprès des professionnels de santé, sportifs et entreprises.' },
        ],
      },
    ],
  },

  // ════════════════════════════════ CABINET DE RENNES ════════════════════════
  'cabinet-rennes': {
    slug: 'cabinets/rennes',
    metaTitle: 'Cabinet de Rennes (SPORMED)',
    metaDescription:
      "Cabinet de sophrologie et d'hypnose à Rennes, au sein du centre médical SPORMED (2A Rue du Bourg Nouveau, 35000 Rennes). Réservation en ligne sur RESALIB.",
    hero: {
      eyebrow: 'Mes cabinets · Rennes',
      title: 'Cabinet de Rennes',
      description:
        "Je vous reçois au cœur de Rennes, au sein du centre médical SPORMED.",
      breadcrumb: 'Rennes',
      backgroundImage: u('1518611012118-696072aa579a'),
    },
    sections: [
      {
        kind: 'split',
        eyebrow: 'Adresse',
        title: 'Au centre médical SPORMED',
        image: u('1497366216548-37526070297c'),
        paragraphs: [
          '2A Rue du Bourg Nouveau, 35000 Rennes.',
          "Le cabinet est installé au sein du centre médical SPORMED, un environnement professionnel dédié à la santé et au bien-être, facile d'accès.",
        ],
        bullets: ['Hypnose & sophrologie', 'Séances individuelles ou en groupe', 'Sur rendez-vous'],
      },
      {
        kind: 'features',
        eyebrow: 'Infos pratiques',
        title: 'Prendre rendez-vous à Rennes',
        items: [
          { iconName: 'CalendarCheck', title: 'Réserver sur RESALIB', desc: 'Prise de rendez-vous en ligne pour le cabinet de Rennes.', href: RESALIB_URL, external: true },
          { iconName: 'Globe', title: 'Centre SPORMED', desc: 'Découvrir le centre médical qui accueille le cabinet.', href: SPORMED_URL, external: true },
          { iconName: 'Phone', title: 'Par téléphone', desc: '06 15 62 17 23 — appel ou SMS pour convenir d’un créneau.', href: 'tel:0615621723' },
        ],
      },
    ],
  },

  // ════════════════════════════════ CABINET D'ACIGNÉ ═════════════════════════
  'cabinet-acigne': {
    slug: 'cabinets/acigne',
    metaTitle: "Cabinet d'Acigné",
    metaDescription:
      "Cabinet de sophrologie et d'hypnose à Acigné (2 Rue du Calvaire, 35690), en association avec un kinésiologue et un ostéopathe. Réservation en ligne sur MEDOUCINE.",
    hero: {
      eyebrow: 'Mes cabinets · Acigné',
      title: "Cabinet d'Acigné",
      description: "Mon cabinet principal à Acigné, partagé avec des praticiens du bien-être.",
      breadcrumb: 'Acigné',
      backgroundImage: u('1544161515-4ab6ce6db874'),
    },
    sections: [
      {
        kind: 'split',
        eyebrow: 'Adresse',
        title: 'Un cabinet pluridisciplinaire',
        image: u('1600880292203-757bb62b4baf'),
        reverse: true,
        paragraphs: [
          '2 Rue du Calvaire, 35690 Acigné.',
          'Le cabinet est partagé avec Xavier Jan, kinésiologue, et Quentin Sanson, ostéopathe : une approche complémentaire du corps et du bien-être.',
        ],
        bullets: ['Hypnose & sophrologie', 'Kinésiologie · Ostéopathie', 'Sur rendez-vous'],
      },
      {
        kind: 'features',
        eyebrow: 'Infos pratiques',
        title: "Prendre rendez-vous à Acigné",
        items: [
          { iconName: 'CalendarCheck', title: 'Réserver sur MEDOUCINE', desc: 'Prise de rendez-vous en ligne pour le cabinet d’Acigné.', href: MEDOUCINE_URL, external: true },
          { iconName: 'Phone', title: 'Par téléphone', desc: '06 15 62 17 23 — appel ou SMS pour convenir d’un créneau.', href: 'tel:0615621723' },
          { iconName: 'Home', title: 'À domicile', desc: 'Visites possibles dans un rayon de 20 km autour d’Acigné.' },
        ],
      },
    ],
  },
}

export function getSubpage(slug: string): Subpage | undefined {
  return subpages[slug]
}
