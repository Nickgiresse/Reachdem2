// import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, Settings } from "lucide-react";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function FAQ({
  title: _ = "Questions Fréquemment Posées",
  className,
}: FAQProps) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Section className={`${className} bg-gradient-to-br from-gray-50 to-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <motion.div 
          className="max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher dans les FAQ..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
            />
          </div>
        </motion.div>

        {/* Généralité Section */}
        <motion.div 
          className="mb-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="flex items-center gap-4 mb-8"
            variants={itemVariants}
          >
            <div className="p-3 bg-orange-100 rounded-xl">
              <BookOpen className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">
              Généralités
            </h3>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            variants={itemVariants}
          >
            <Accordion type="single" collapsible className="w-full">
              {generalItems.map((item, index) => (
                <motion.div
                  key={`general-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem
                    value={item.value || `general-${index + 1}`}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 hover:bg-orange-50 transition-colors">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </motion.div>
        
        {/* Builder Section */}
        <motion.div 
          className="mb-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="flex items-center gap-4 mb-8"
            variants={itemVariants}
          >
            <div className="p-3 bg-blue-100 rounded-xl">
              <Settings className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">
              Création & Gestion
            </h3>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            variants={itemVariants}
          >
            <Accordion type="single" collapsible className="w-full">
              {builderItems.map((item, index) => (
                <motion.div
                  key={`builder-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem
                    value={item.value || `builder-${index + 1}`}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 hover:bg-blue-50 transition-colors">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}
