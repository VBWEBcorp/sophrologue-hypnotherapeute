import type { Metadata } from 'next'

import { ServicesContent } from './services-content'
import {
  breadcrumbJsonLd,
  serviceJsonLd,
  webPageJsonLd,
} from '@/components/seo/json-ld'

const description =
  "Hypnose ericksonienne et sophrologie caycédienne à Acigné et Rennes : stress, anxiété, sommeil, phobies, arrêt du tabac, gestion de la douleur, confiance en soi."

const services = [
  { title: 'Hypnothérapie ericksonienne', desc: "Une thérapie brève de quelques séances qui mobilise votre inconscient pour activer vos capacités de changement et de mieux-être." },
  { title: 'Sophrologie caycédienne', desc: "Une méthode pédagogique de relaxation du corps et de l'esprit pour gérer le stress et développer vos ressources." },
  { title: 'Gestion du stress & de l\'anxiété', desc: "Apaiser les tensions nerveuses et physiques, gagner en autonomie face au stress et retrouver le calme." },
  { title: 'Troubles du sommeil', desc: "Retrouver un sommeil réparateur en agissant sur les causes de l'insomnie." },
  { title: 'Accompagnement à l’arrêt du tabac', desc: "Se libérer du tabac et des compulsions, à votre rythme." },
  { title: 'Gestion de la douleur', desc: "Accompagner la douleur, les maladies psychosomatiques et soutenir un protocole médical." },
  { title: 'Confiance & développement personnel', desc: "Renforcer l'estime de soi, dépasser ses blocages, développer concentration et confiance." },
  { title: 'Préparation & accompagnement', desc: "Préparation à la naissance, accompagnement des sportifs, des examens, des enfants et adolescents." },
]

export const metadata: Metadata = {
  title: "Séances d'hypnose & de sophrologie",
  description,
  alternates: { canonical: '/services' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    webPageJsonLd('Séances', description, '/services'),
    breadcrumbJsonLd([
      { name: 'Accueil', path: '/' },
      { name: 'Séances', path: '/services' },
    ]),
    ...services.map((s) => serviceJsonLd(s.title, s.desc, '/services')),
  ],
}

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicesContent />
    </>
  )
}
