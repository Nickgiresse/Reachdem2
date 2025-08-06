import Link from "next/link";
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
  items?: FAQItemProps[] | false;
  className?: string;
}

export default function FAQ({
  title = "Question Frequemment Poser",
  items = [
    {
      question:
        "Qu'est-ce que ReachDem?",
      answer: (
        <>
          <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
            
              ReachDem est une plateforme de messagerie SMS professionnelle qui 
              vous permet d'envoyer des campagnes SMS à grande échelle,
              de gérer vos contacts et de suivre vos performances en temps réel.
          </p>
          
        </>
      ),
    },
    {
      question: "Comment puis-je demarrer avec ReachDem?",
      answer: (
        <>
          <p className="text-muted-foreground mb-4 max-w-[600px]">
            Pour commencer, créez simplement un compte sur notre plateforme.
             Une fois inscrit, vous pourrez créer votre premier projet,
             ajouter vos contacts et lancer votre première campagne SMS.
          </p>
         
        </>
      ),
    },
    {
      question:
        "Quels type de campagnes puis-je envoyer?",
      answer: (
        <>
          <p className="text-muted-foreground mb-4 max-w-[580px]">
            Vous pouvez envoyer différents types de campagnes SMS : messages promotionnels,
             notifications, alertes, messages transactionnels, et plus encore. 
            Notre plateforme prend en charge l'envoi de messages personnalisés à grande échelle.
          </p>
         
        </>
      ),
    },
    {
      question: 'Comment puis-je import mes contact?',
      answer: (
        <>
          <p className="text-muted-foreground mb-4 max-w-[580px]">
           Vous pouvez importer vos contacts facilement via notre outil d'importation CSV intelligent. Il vous suffit de télécharger 
           votre fichier CSV contenant les numéros de téléphone et les informations de vos contacts.
          </p>
         
        </>
      ),
    },
    {
      question: "Est-ce que je peux suivre les performances de mes campagnes ?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[580px]">
         Oui, notre plateforme offre des statistiques détaillées pour chaque campagne, incluant les taux de livraison, les taux d'ouverture, 
         et d'autres métriques importantes pour optimiser vos performances.
        </p>
      ),
    },
    {
      question: "Can I get a discount?",
      answer: (
        <>
          <p className="text-muted-foreground mb-4 max-w-[580px]">
            Actually, yes! I&apos;m always acively looking for beta testers of
            new features. If you are interested in exchanging feedback for a
            discount, please contact me via{" "}
            <a
              href="https://www.launchuicomponents.com/"
              className="underline underline-offset-2"
            >
              email
            </a>
            .
          </p>
        </>
      ),
    },
  ],
  className,
}: FAQProps) {
  return (
    <Section className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-8">
        <h2 className="text-center text-3xl font-semibold sm:text-5xl">
          {title}
        </h2>
        <hr className="w-[90%] my-2"/>

        <h3 className="w-[90%]  text-3xl font-semibold sm:text-2xl">
          Gerneralité
        </h3>
        {items !== false && items.length > 0 && (
          <Accordion type="single" collapsible className="w-full max-w-[800px]">
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                value={item.value || `item-${index + 1}`}
              >
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
      
      <div className="max-w-container mx-auto flex flex-col items-center gap-8">
        <hr className="w-[90%] my-2"/>

        <h3 className="w-[90%]  text-3xl font-semibold sm:text-2xl">
          Builder
        </h3>
        {items !== false && items.length > 0 && (
          <Accordion type="single" collapsible className="w-full max-w-[800px]">
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                value={item.value || `item-${index + 1}`}
              >
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </Section>
  );
}
