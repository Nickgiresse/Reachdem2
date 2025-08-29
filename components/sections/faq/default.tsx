// import Link from "next/link";
import { ReactNode } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { Section } from "../../ui/section";

interface FAQItemProps {
  question: string;
  answer: ReactNode;
  value?: string;
}

interface FAQProps {
  title?: string;
  className?: string;
}

// Données pour la section Généralité
const generalItems: FAQItemProps[] = [
  {
    question: "Qu'est-ce que ReachDem?",
    answer: (
      <>
        <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
          {" ReachDem est une plateforme de messagerie SMS professionnelle qui vous permet d'envoyer des campagnes SMS à grande échelle, de gérer vos contacts et de suivre vos performances en temps réel."}
        </p>
      </>
    ),
  },
  {
    question: "Comment puis-je demarrer avec ReachDem?",
    answer: (
      <>
        <p className="text-muted-foreground mb-4 max-w-[600px]">
          {" Pour commencer, créez simplement un compte sur notre plateforme. Une fois inscrit, vous pourrez créer votre premier projet, ajouter vos contacts et lancer votre première campagne SMS."}
        </p>
      </>
    ),
  },
  {
    question: "Quels type de campagnes puis-je envoyer?",
    answer: (
      <>
        <p className="text-muted-foreground mb-4 max-w-[580px]">
          {" Vous pouvez envoyer différents types de campagnes SMS : messages promotionnels, notifications, alertes, messages transactionnels, et plus encore. Notre plateforme prend en charge l'envoi de messages personnalisés à grande échelle."}
        </p>
      </>
    ),
  },
  {
    question: 'Comment puis-je import mes contact?',
    answer: (
      <>
        <p className="text-muted-foreground mb-4 max-w-[580px]">
          {" Vous pouvez importer vos contacts facilement via notre outil d'importation CSV intelligent. Il vous suffit de télécharger votre fichier CSV contenant les numéros de téléphone et les informations de vos contacts."}
        </p>
      </>
    ),
  },
  {
    question: "Est-ce que je peux suivre les performances de mes campagnes ?",
    answer: (
      <p className="text-muted-foreground mb-4 max-w-[580px]">
        {" Oui, notre plateforme offre des statistiques détaillées pour chaque campagne, incluant les taux de livraison, les taux d'ouverture, et d'autres métriques importantes pour optimiser vos performances."}
      </p>
    ),
  },
];

// Données pour la section Builder
const builderItems: FAQItemProps[] = [
  {
    question: "Comment créer une campagne SMS personnalisée?",
    answer: (
      <>
        <p className="text-muted-foreground mb-4 max-w-[600px]">
          {" Utilisez notre éditeur de campagne intuitif pour créer des messages personnalisés. Vous pouvez ajouter des variables dynamiques, des liens de suivi et personnaliser le contenu selon vos besoins."}
        </p>
      </>
    ),
  },
  {
    question: "Puis-je programmer l'envoi de mes campagnes?",
    answer: (
      <>
        <p className="text-muted-foreground mb-4 max-w-[580px]">
          {" Absolument ! Notre plateforme vous permet de programmer l'envoi de vos campagnes à des dates et heures spécifiques. Idéal pour les promotions saisonnières ou les rappels automatiques."}
        </p>
      </>
    ),
  },
  {
    question: "Comment segmenter mes contacts pour des campagnes ciblées?",
    answer: (
      <>
        <p className="text-muted-foreground mb-4 max-w-[580px]">
          {" Créez des segments intelligents basés sur l'activité, la localisation, les préférences ou l'historique d'achat. Cela vous permet d'envoyer des messages plus pertinents et d'améliorer vos taux de conversion."}
        </p>
      </>
    ),
  },
  {
    question: "Quels sont les outils d'automatisation disponibles?",
    answer: (
      <>
        <p className="text-muted-foreground mb-4 max-w-[580px]">
          {" Nous proposons des workflows automatisés pour les messages de bienvenue, les rappels de panier abandonné, les confirmations de commande et bien plus encore. Automatisez vos communications pour gagner du temps."}
        </p>
      </>
    ),
  },
  {
    question: "Comment optimiser mes campagnes pour de meilleurs résultats?",
    answer: (
      <p className="text-muted-foreground mb-4 max-w-[580px]">
        {" Analysez vos performances avec nos outils de reporting avancés. Testez différents messages, horaires d'envoi et segments pour identifier ce qui fonctionne le mieux pour votre audience."}
      </p>
    ),
  },
];

export default function FAQ({
  title = "Questions Fréquemment Posées",
  className,
}: FAQProps) {
  return (
    <Section className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-8">
        <h2 className="text-center text-3xl font-semibold sm:text-5xl">
          {title}
        </h2>
        <hr className="w-[90%] my-2"/>

        <h3 className="w-[90%] text-3xl font-semibold sm:text-2xl">
          Généralité
        </h3>
        <Accordion type="single" collapsible className="w-full max-w-[800px]">
          {generalItems.map((item, index) => (
            <AccordionItem
              key={`general-${index}`}
              value={item.value || `general-${index + 1}`}
            >
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      
      <div className="max-w-container mx-auto flex flex-col items-center gap-8">
        <hr className="w-[90%] my-2"/>

        <h3 className="w-[90%] text-3xl font-semibold sm:text-2xl">
          Builder
        </h3>
        <Accordion type="single" collapsible className="w-full max-w-[800px]">
          {builderItems.map((item, index) => (
            <AccordionItem
              key={`builder-${index}`}
              value={item.value || `builder-${index + 1}`}
            >
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
