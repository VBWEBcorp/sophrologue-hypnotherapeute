/**
 * subpages.ts — Contenu des pages thématiques.
 * Chaque page compose une suite de sections typées, rendues par
 * <SubpageContent /> (src/components/sections/subpage-content.tsx).
 * Les mises en page diffèrent d'une page à l'autre (split, timeline, encart…).
 */

import { nature, photos } from '@/lib/photos'
import { siteConfig } from '@/lib/seo'

export const MEDOUCINE_URL = siteConfig.booking.medoucine
export const RESALIB_URL = siteConfig.booking.resalib
export const SPORMED_URL = 'https://www.spormed.fr/accueil/'

export type SubpageSection = (
  | { kind: 'prose'; eyebrow?: string; title: string; paragraphs: string[] }
  | {
      kind: 'split'
      eyebrow?: string
      title: string
      paragraphs: string[]
      image: string
      /** Cadre de l'image : portrait 5/6 par défaut, ou paysage 4/3 pour une vue large (rue, bâtiment). */
      imageAspect?: 'portrait' | 'landscape'
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
  | { kind: 'highlight'; eyebrow?: string; title: string; paragraphs: string[] }
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
        /** Photo du bâtiment, affichée en tête du carré. */
        image?: string
        href?: string
        /** Plateformes de réservation, dans l'ordre d'affichage (la première est celle privilégiée pour ce cabinet). */
        bookings?: { label: string; url: string }[]
      }[]
    }
) & {
  /** Force le fond de la section : true = lavande, false = beige. Par défaut, alternance auto. */
  tinted?: boolean
}

export type Subpage = {
  slug: string
  metaTitle: string
  metaDescription: string
  hero: { eyebrow: string; title: string; description: string; breadcrumb: string; backgroundImage: string }
  sections: SubpageSection[]
}

// Fonds de bannière : nature apaisante. Ils restent des paysages parce qu'ils
// s'affichent en plein écran (1920 px) — les photos des cabinets font 850 px de
// large et seraient floues à cette taille. Les illustrations des sections, elles,
// utilisent les vraies photos. Les deux jeux sont servis par le bucket R2
// (voir `photos.ts`).

export const subpages: Record<string, Subpage> = {
  // ════════════════════════════════ HYPNOTHÉRAPIE ════════════════════════════
  hypnotherapie: {
    slug: 'hypnotherapie',
    metaTitle: 'Hypnothérapie Ericksonienne à Rennes et Acigné',
    metaDescription:
      "Hypnothérapie Ericksonienne à Rennes et Acigné : une thérapie brève pour agir sur le stress, l'anxiété, la dépression, les phobies, le sommeil, la douleur et l'arrêt du tabac.",
    hero: {
      eyebrow: 'Hypnothérapie',
      title: 'Hypnothérapie Ericksonienne à Rennes & Acigné',
      description:
        "Une thérapie brève et certifiée qui mobilise vos ressources conscientes et inconscientes pour activer vos capacités de changement.",
      breadcrumb: 'Hypnothérapie',
      backgroundImage: nature.rayonsSoleilForet,
    },
    sections: [
      {
        kind: 'split',
        eyebrow: 'La méthode',
        title: "Qu'est-ce que l'hypnose thérapeutique ?",
        image: photos.seanceTable,
        paragraphs: [
          "L'hypnose Ericksonienne est une thérapie brève de quelques séances. Elle vous met en contact avec vos ressources conscientes et inconscientes pour activer vos propres capacités de mieux-être et de guérison.",
          "On me cherche souvent sous le nom d'hypnotiseur à Rennes ou à Acigné. Le terme exact est hypnothérapeute : contrairement à l'hypnotiseur de spectacle, l'hypnothérapie n'a aucun objectif de divertissement. Je suis une praticienne certifiée dédiée à une action thérapeutique, formée à l'Institut Émergences du Dr Claude Virot, à Rennes.",
        ],
        bullets: ['Thérapie brève', 'Praticienne certifiée', 'Action thérapeutique', 'À votre rythme'],
      },
      {
        kind: 'checklist',
        eyebrow: 'Indications',
        title: "Ce sur quoi les séances d'hypnose agissent",
        description: "Les séances d'hypnose travaillent sur :",
        // Formulations reprises de la praticienne elle-même : « agissent sur »
        // plutôt que « peuvent aider à », et « accompagnement à l'arrêt du
        // tabac » plutôt que « addiction ».
        items: [
          'Le stress, l’anxiété et la dépression',
          'Un blocage, une situation stressante ou une phobie',
          'La gestion de la douleur',
          'La préparation d’une échéance anxiogène (examens, entretiens, épreuve sportive…)',
          'L’accompagnement de protocoles médicaux (chimiothérapie, rééducation cardiaque, anneau gastrique…)',
          'Le sommeil, à retrouver ou à améliorer',
          'Le renforcement ou la consolidation d’une psychothérapie',
          'L’accompagnement à l’arrêt du tabac et les compulsions alimentaires',
          'La perte de poids',
          'Les troubles nerveux et les troubles obsessionnels compulsifs (TOC)',
          'Les acouphènes',
        ],
      },
      {
        kind: 'features',
        eyebrow: 'Pourquoi',
        title: "Pourquoi choisir l'hypnose ?",
        items: [
          { iconName: 'Sparkles', title: 'Thérapie brève', desc: 'Quelques séances suffisent généralement pour des résultats durables.' },
          { iconName: 'ShieldCheck', title: 'Praticienne certifiée', desc: "Formée à l'hypnose Ericksonienne médicale (Institut Émergences de Rennes, Dr Claude Virot)." },
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
      backgroundImage: nature.pinsBrume,
    },
    sections: [
      {
        kind: 'timeline',
        tinted: false,
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
    metaTitle: 'Sophrologie à Rennes et Acigné',
    metaDescription:
      "Sophrologie Caycédienne à Rennes et Acigné : techniques et exercices psycho-corporels pour apaiser le système nerveux, relâcher le corps et gérer le stress en autonomie. Tarifs et séances.",
    hero: {
      eyebrow: 'Sophrologie',
      title: 'La sophrologie pour apaiser stress et angoisses',
      description:
        "Une méthode douce de relaxation du corps et de l'esprit, que vous apprenez à pratiquer en autonomie au quotidien.",
      breadcrumb: 'Sophrologie',
      backgroundImage: nature.brumeSurLac,
    },
    sections: [
      {
        kind: 'split',
        eyebrow: 'La méthode',
        title: "Qu'est-ce que la sophrologie ?",
        // Pas de patiente allongée ici : la sophrologie est une relaxation
        // dynamique, debout et assis. Visuel choisi par la praticienne.
        image: photos.sophrologiePrincipes,
        reverse: true,
        // Définition dictée par la praticienne : commencer par « techniques et
        // exercices psycho-corporels », puis le détail, puis l'autonomisation.
        paragraphs: [
          "La sophrologie est un ensemble de techniques et d'exercices psycho-corporels destinés à apaiser le système nerveux et à relâcher le corps. Elle a été mise au point par le Dr Caycedo, neuropsychiatre.",
          "Concrètement, elle associe des exercices de respiration, de relaxation et de visualisation, qui permettent de relâcher les tensions physiques et psychologiques, d'activer vos ressources et de développer confiance et concentration.",
          "Après quelques séances, le patient s'autonomise : il repart avec un savoir-faire qu'il peut réutiliser seul, chaque fois qu'il en a besoin.",
        ],
      },
      {
        // Apports repris de la page d'accueil actuelle de la praticienne, pour
        // qu'elle retrouve exactement son contenu.
        kind: 'checklist',
        eyebrow: 'Bienfaits',
        title: 'Les apports et bienfaits de la sophrologie',
        items: [
          'Apprendre à gérer ses tensions nerveuses et physiques',
          "S'autonomiser dans la gestion du stress et de l'anxiété",
          'Fortifier ses ressources physiques et psychiques',
          'Optimiser son équilibre et gagner en calme',
          'Développer sa concentration et sa mémoire',
          'Renforcer la confiance en soi',
          'Gestion du poids et des compulsions alimentaires',
          'Accompagnement de la boulimie et de l’anorexie',
          'Dépasser ses blocages',
          'Préparer un objectif personnel, sportif ou professionnel',
          'Un outil de développement personnel',
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
        // Plaque de l'entrée du cabinet d'Acigné. Elle ne mentionne pas
        // l'hypnose : c'est pour cela qu'elle n'apparaît que sur cette page.
        kind: 'split',
        eyebrow: 'Formation',
        title: 'Diplômée de l’Institut de Sophrologie de Rennes',
        image: photos.plaqueSophrologue,
        paragraphs: [
          "Formée à la sophrologie Caycédienne à l'Institut de Sophrologie de Rennes (ISR), je pratique depuis 2006. C'est la plaque qui vous accueille à l'entrée du cabinet d'Acigné, 2 Rue du Calvaire, aux côtés de celle de Xavier Jan, ostéopathe.",
          'Les séances de sophrologie se déroulent à Acigné comme à Rennes, sur rendez-vous.',
        ],
        bullets: ['Sophrologie Caycédienne', 'Institut de Sophrologie de Rennes', 'Depuis 2006'],
      },
      {
        // Tarifs repris à l'identique du site actuel de la praticienne.
        kind: 'pricing',
        eyebrow: 'Tarifs',
        title: 'Mes tarifs',
        description:
          'Règlement par chèque, espèces ou virement. La carte bancaire n’est pas acceptée.',
        items: [
          { price: '57 à 65 €', label: 'Séance d’hypnose', note: 'Selon la localité, la durée et le déplacement' },
          { price: '45 à 57 €', label: 'Séance de sophrologie', note: 'Selon la localité, la durée et le déplacement' },
          { price: 'Sur consultation', label: 'Enfants', note: 'Tarif spécifique selon l’âge' },
        ],
      },
    ],
  },

  // ════════════════════════════════ MES CABINETS (overview) ══════════════════
  cabinets: {
    slug: 'cabinets',
    metaTitle: 'Mes cabinets à Rennes & Acigné',
    metaDescription:
      "Véronique Jan vous accueille dans deux cabinets, à Rennes (centre médical SPORMED) et à Acigné (2 Rue du Calvaire), ainsi qu'à domicile dans un rayon de 20 km et en téléconsultation.",
    hero: {
      eyebrow: 'Mes cabinets',
      title: 'Mes cabinets à Rennes & Acigné',
      description:
        "Deux lieux pour vous accueillir, ainsi que des visites à domicile dans un rayon de 20 km et des consultations en visio pour les patients suivis.",
      breadcrumb: 'Mes cabinets',
      backgroundImage: nature.nuagesAuDessusLac,
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
            // La zone d'affaires fait partie de l'adresse (demande de la
            // praticienne) : c'est ce qui permet de trouver le centre.
            address: '2A Rue du Bourg Nouveau, Zone d’affaires Atalante Champeaux, 35000 Rennes',
            note: 'Au sein du centre médical SPORMED.',
            image: photos.rennesBatiment,
            href: '/cabinets/rennes',
            // Les deux plateformes servent les deux cabinets ; RESALIB en tête à Rennes.
            bookings: [
              { label: 'Réserver sur RESALIB', url: RESALIB_URL },
              { label: 'Réserver sur MEDOUCINE', url: MEDOUCINE_URL },
            ],
          },
          {
            id: 'acigne',
            name: "Cabinet d'Acigné",
            address: '2 Rue du Calvaire, 35690 Acigné',
            note: 'En association avec Xavier Jan, ostéopathe.',
            image: photos.acigneBatiment,
            href: '/cabinets/acigne',
            bookings: [
              { label: 'Réserver sur MEDOUCINE', url: MEDOUCINE_URL },
              { label: 'Réserver sur RESALIB', url: RESALIB_URL },
            ],
          },
        ],
      },
      {
        kind: 'features',
        eyebrow: 'Autres modalités',
        title: 'Je me déplace aussi chez vous',
        items: [
          { iconName: 'Home', title: 'À domicile', desc: 'Visites à domicile dans un rayon de 20 km autour de chaque cabinet.' },
          { iconName: 'MapPin', title: 'Noyal-sur-Vilaine et alentours', desc: 'Les habitants de Noyal-sur-Vilaine sont reçus au cabinet d’Acigné, à moins de dix minutes, ou à domicile.', href: '/hypnose-noyal-sur-vilaine' },
          // Formulation de la praticienne : elle pratique peu la téléconsultation,
          // et uniquement avec des patients déjà suivis en cabinet.
          { iconName: 'Smartphone', title: 'En téléconsultation', desc: 'Uniquement en suivi, après un premier protocole en présentiel. Me consulter pour la programmer.' },
          { iconName: 'Heart', title: 'Structures & entreprises', desc: 'Interventions en milieu hospitalier, structures médicales et sportives, entreprises et EHPAD.' },
        ],
      },
    ],
  },

  // ════════════════════════════════ CABINET DE RENNES ════════════════════════
  'cabinet-rennes': {
    slug: 'cabinets/rennes',
    metaTitle: 'Hypnothérapeute à Rennes, cabinet SPORMED',
    metaDescription:
      "Hypnose et sophrologie à Rennes, au sein du centre médical SPORMED (2A Rue du Bourg Nouveau, 35000 Rennes), Zone d’affaires Atalante Champeaux. Réservation en ligne sur RESALIB.",
    hero: {
      eyebrow: 'Mes cabinets · Rennes',
      title: 'Cabinet de Rennes',
      description:
        "Je vous reçois au cœur de Rennes, au sein du centre médical SPORMED.",
      breadcrumb: 'Rennes',
      backgroundImage: nature.foretVueDuCiel,
    },
    sections: [
      {
        kind: 'split',
        eyebrow: 'Adresse',
        title: 'Au centre médical SPORMED',
        image: photos.accesRennes,
        paragraphs: [
          '2A Rue du Bourg Nouveau, Zone d’affaires Atalante Champeaux, 35000 Rennes.',
          "Le cabinet est installé au sein du centre médical SPORMED, également appelé Sport Santé Institut : un environnement professionnel dédié à la santé et au bien-être, facile d'accès.",
        ],
        bullets: ['Hypnose & sophrologie', 'Séances individuelles ou en groupe', 'Sur rendez-vous'],
      },
      {
        kind: 'features',
        eyebrow: 'Infos pratiques',
        title: 'Prendre rendez-vous à Rennes',
        items: [
          { iconName: 'CalendarCheck', title: 'Réserver sur RESALIB', desc: 'Prise de rendez-vous en ligne pour le cabinet de Rennes.', href: RESALIB_URL, external: true },
          { iconName: 'CalendarCheck', title: 'Réserver sur MEDOUCINE', desc: 'Également disponible pour le cabinet de Rennes.', href: MEDOUCINE_URL, external: true },
          { iconName: 'Phone', title: 'Par téléphone', desc: '06 15 62 17 23, appel ou SMS. Rappel ou réponse dans la demi-journée.', href: `tel:${siteConfig.phoneE164}` },
          { iconName: 'Globe', title: 'Centre médical SPORMED', desc: 'Découvrir le centre médical qui accueille le cabinet.', href: SPORMED_URL, external: true },
        ],
      },
      {
        kind: 'prose',
        eyebrow: 'Zone d’intervention',
        title: 'Autour du cabinet de Rennes',
        paragraphs: [
          "Je reçois à Rennes les personnes venant de Pacé, Saint-Jacques-de-la-Lande, Saint-Grégoire, Saint-Gilles, Vezin-le-Coquet, ainsi que des quartiers de Cleunay et Villejean.",
          "Je me déplace également à domicile dans un rayon de 20 km autour du cabinet, ce qui couvre aussi les communes non citées ici. La téléconsultation est réservée au suivi, après un premier protocole en présentiel : me consulter pour la programmer.",
        ],
      },
    ],
  },

  // ════════════════════════════════ CABINET D'ACIGNÉ ═════════════════════════
  'cabinet-acigne': {
    slug: 'cabinets/acigne',
    metaTitle: "Hypnothérapeute à Acigné et Noyal-sur-Vilaine",
    metaDescription:
      "Hypnose et sophrologie à Acigné (2 Rue du Calvaire, 35690), à deux pas de Noyal-sur-Vilaine et Thorigné-Fouillard. Cabinet partagé avec un ostéopathe.",
    hero: {
      eyebrow: 'Mes cabinets · Acigné',
      title: "Cabinet d'Acigné",
      description: "Mon cabinet principal à Acigné, partagé avec Xavier Jan, ostéopathe.",
      breadcrumb: 'Acigné',
      backgroundImage: nature.arbresVertsVueDuCiel,
    },
    sections: [
      {
        kind: 'split',
        eyebrow: 'Adresse',
        title: 'Un cabinet pluridisciplinaire',
        // La photo prise de loin, avec l'arbre : la praticienne la préfère et
        // elle montre la rue en large, d'où le cadre paysage.
        image: photos.acigneBatiment,
        imageAspect: 'landscape',
        reverse: true,
        paragraphs: [
          '2 Rue du Calvaire, 35690 Acigné.',
          'Le cabinet est partagé avec Xavier Jan, ostéopathe : une approche complémentaire du corps et du bien-être.',
        ],
        bullets: ['Hypnose & sophrologie', 'Ostéopathie', 'Sur rendez-vous'],
      },
      {
        kind: 'features',
        eyebrow: 'Infos pratiques',
        title: "Prendre rendez-vous à Acigné",
        items: [
          { iconName: 'CalendarCheck', title: 'Réserver sur MEDOUCINE', desc: 'Prise de rendez-vous en ligne pour le cabinet d’Acigné.', href: MEDOUCINE_URL, external: true },
          { iconName: 'CalendarCheck', title: 'Réserver sur RESALIB', desc: 'Également disponible pour le cabinet d’Acigné.', href: RESALIB_URL, external: true },
          { iconName: 'Phone', title: 'Par téléphone', desc: '06 15 62 17 23, appel ou SMS. Rappel ou réponse dans la demi-journée.', href: `tel:${siteConfig.phoneE164}` },
          { iconName: 'Home', title: 'À domicile', desc: 'Visites possibles dans un rayon de 20 km autour d’Acigné.' },
          { iconName: 'MapPin', title: 'Vous venez de Noyal-sur-Vilaine ?', desc: 'Le cabinet est à moins de dix minutes : tout ce qu’il faut savoir sur une page dédiée.', href: '/hypnose-noyal-sur-vilaine' },
        ],
      },
      {
        // Seconde photo du lieu (l'entrée, côté rue du Grand Four), demandée
        // par la praticienne en plus de la vue large.
        kind: 'split',
        eyebrow: 'Zone d’intervention',
        title: 'Autour du cabinet d’Acigné',
        image: photos.acigneEntree,
        paragraphs: [
          "Le cabinet d'Acigné accueille les personnes venant de Noyal-sur-Vilaine, Thorigné-Fouillard, Cesson-Sévigné, Servon-sur-Vilaine, Brécé, Châteaubourg, Châteaugiron, Domloup, Chantepie, Liffré et Vern-sur-Seiche.",
          "Je me déplace également à domicile dans un rayon de 20 km autour du cabinet, ce qui couvre aussi les communes non citées ici. La téléconsultation est réservée au suivi, après un premier protocole en présentiel : me consulter pour la programmer.",
        ],
      },
    ],
  },
  // ════════════════════════════════ NOYAL-SUR-VILAINE ════════════════════════
  // Page de zone, pas de cabinet : la praticienne n'est pas installée à Noyal,
  // elle y reçoit les habitants depuis Acigné, la commune voisine. Promise à la
  // cliente le 17/09/2026 (levier durable pour Noyal, à la place d'un mot dans
  // le nom de la fiche Google). Tout ce qui est dit ici l'est déjà ailleurs sur
  // le site : rien n'est inventé pour la commune.
  'noyal-sur-vilaine': {
    slug: 'hypnose-noyal-sur-vilaine',
    metaTitle: 'Hypnose et sophrologie près de Noyal-sur-Vilaine',
    metaDescription:
      "Véronique Jan, hypnothérapeute et sophrologue depuis 2006, reçoit les habitants de Noyal-sur-Vilaine à son cabinet d'Acigné, à moins de dix minutes, ou à domicile.",
    hero: {
      eyebrow: 'Hypnose & sophrologie · Noyal-sur-Vilaine',
      title: 'Hypnothérapeute près de Noyal-sur-Vilaine',
      description:
        "Depuis 2006, je reçois les habitants de Noyal-sur-Vilaine à mon cabinet d'Acigné, la commune voisine, ou à domicile. Hypnose Ericksonienne et sophrologie Caycédienne.",
      breadcrumb: 'Noyal-sur-Vilaine',
      backgroundImage: nature.riviereBordeeArbres,
    },
    sections: [
      {
        kind: 'split',
        eyebrow: 'Le cabinet le plus proche',
        title: 'À Acigné, la commune voisine de Noyal-sur-Vilaine',
        image: photos.acigneBatiment,
        imageAspect: 'landscape',
        reverse: true,
        paragraphs: [
          "Mon cabinet se trouve 2 Rue du Calvaire, à Acigné, à moins de dix minutes en voiture du centre de Noyal-sur-Vilaine. C'est un cabinet pluridisciplinaire, partagé avec Xavier Jan, ostéopathe.",
          "Depuis vingt ans, une bonne partie des personnes que j'accompagne viennent des communes voisines : Noyal-sur-Vilaine, Servon-sur-Vilaine, Brécé, Châteaubourg ou Thorigné-Fouillard.",
        ],
        bullets: ['Sur rendez-vous', 'Du lundi au samedi', 'Hypnose & sophrologie'],
      },
      {
        kind: 'features',
        eyebrow: 'Ce que je propose',
        title: 'Deux approches, un même objectif : votre mieux-être',
        items: [
          { iconName: 'Brain', title: 'Hypnose Ericksonienne', desc: 'Une thérapie brève de quelques séances, pour agir sur ce qui vous bloque. Praticienne certifiée (Institut Émergences, Rennes).', href: '/hypnotherapie' },
          { iconName: 'Leaf', title: 'Sophrologie Caycédienne', desc: 'Des exercices simples de relaxation du corps et de l’esprit, à pratiquer ensuite en autonomie.', href: '/sophrologie' },
          { iconName: 'Sparkles', title: 'Le déroulement d’une séance', desc: 'De l’entretien au retour : ce qui se passe concrètement, et pourquoi vous restez conscient·e.', href: '/seances-hypnose' },
          { iconName: 'Home', title: 'À domicile à Noyal-sur-Vilaine', desc: 'Je me déplace chez vous : la commune est dans le rayon de 20 km que je couvre autour d’Acigné.' },
        ],
      },
      {
        kind: 'checklist',
        eyebrow: 'Motifs de consultation',
        title: 'Ce sur quoi je peux vous accompagner',
        description: 'Enfants, adolescents, adultes, femmes enceintes et jeunes mamans.',
        items: [
          'Le stress, l’anxiété et la dépression',
          'Un blocage, une situation stressante ou une phobie',
          'Le sommeil, à retrouver ou à améliorer',
          'L’accompagnement à l’arrêt du tabac et les compulsions alimentaires',
          'La gestion de la douleur',
          'La préparation d’une échéance anxiogène (examens, entretiens, épreuve sportive…)',
          'L’accompagnement de protocoles médicaux',
          'Les acouphènes',
        ],
      },
      {
        kind: 'timeline',
        eyebrow: 'Votre premier rendez-vous',
        title: 'Comment débute un accompagnement',
        description: 'Chaque accompagnement commence par un temps d’échange, jamais par une technique.',
        steps: [
          { iconName: 'Users', title: 'L’entretien', desc: 'Un échange approfondi pour comprendre votre histoire, vos symptômes et vos objectifs.' },
          { iconName: 'Target', title: 'Le protocole', desc: 'Un protocole personnalisé, en hypnose, en sophrologie ou les deux, sur quelques séances.' },
          { iconName: 'Smartphone', title: 'Le suivi', desc: 'En cabinet ou à domicile. La téléconsultation est réservée au suivi, après un premier protocole en présentiel.' },
        ],
      },
      {
        // Tarifs identiques à la page Sophrologie : une seule grille sur le site.
        kind: 'pricing',
        eyebrow: 'Tarifs',
        title: 'Mes tarifs',
        description:
          'Règlement par chèque, espèces ou virement. La carte bancaire n’est pas acceptée.',
        items: [
          { price: '57 à 65 €', label: 'Séance d’hypnose', note: 'Selon la localité, la durée et le déplacement' },
          { price: '45 à 57 €', label: 'Séance de sophrologie', note: 'Selon la localité, la durée et le déplacement' },
          { price: 'Sur consultation', label: 'Enfants', note: 'Tarif spécifique selon l’âge' },
        ],
      },
      {
        kind: 'cabinets',
        eyebrow: 'Prendre rendez-vous',
        title: 'Réserver au cabinet d’Acigné',
        description: 'En ligne, sur la plateforme de votre choix, ou par téléphone.',
        items: [
          {
            id: 'acigne',
            name: "Cabinet d'Acigné",
            address: '2 Rue du Calvaire, 35690 Acigné',
            note: 'À moins de dix minutes de Noyal-sur-Vilaine. En association avec Xavier Jan, ostéopathe.',
            image: photos.acigneBatiment,
            href: '/cabinets/acigne',
            bookings: [
              { label: 'Réserver sur MEDOUCINE', url: MEDOUCINE_URL },
              { label: 'Réserver sur RESALIB', url: RESALIB_URL },
            ],
          },
        ],
      },
      {
        kind: 'features',
        eyebrow: 'Autres façons de me joindre',
        title: 'Par téléphone, chez vous, ou à Rennes',
        items: [
          { iconName: 'Phone', title: 'Par téléphone', desc: '06 15 62 17 23, appel ou SMS. Rappel ou réponse dans la demi-journée.', href: `tel:${siteConfig.phoneE164}` },
          { iconName: 'Home', title: 'À domicile', desc: 'Visites possibles à Noyal-sur-Vilaine et dans un rayon de 20 km autour d’Acigné.' },
          { iconName: 'MapPin', title: 'Cabinet de Rennes', desc: 'Si vous travaillez à Rennes : centre médical SPORMED, zone d’affaires Atalante Champeaux.', href: '/cabinets/rennes' },
        ],
      },
      {
        kind: 'highlight',
        eyebrow: 'Bon à savoir',
        title: 'Je ne suis pas installée à Noyal-sur-Vilaine même',
        paragraphs: [
          "Mon cabinet est à Acigné, la commune voisine, à quelques minutes. Si vous préférez ne pas vous déplacer, je viens chez vous : Noyal-sur-Vilaine est dans le rayon de 20 km que je couvre à domicile.",
          "Pour un premier rendez-vous, nous nous voyons toujours en présentiel, au cabinet ou à domicile. La téléconsultation n'intervient qu'ensuite, en suivi, si elle est utile.",
        ],
      },
    ],
  },
}

export function getSubpage(slug: string): Subpage | undefined {
  return subpages[slug]
}
