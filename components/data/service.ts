import { Bot, ChartColumnBig, Clock4, MessageSquareMore } from "lucide-react";

export const Services = [
    {
        id: 1,
        couleur: "#EDDB5A",
        titre: "Envoi de SMS groupés",
        description: "Envoyez des messages à des dizaines ou milliers de contacts en un seul clic. Idéal pour informer rapidement vos clients, patients ou élèves",
        image: MessageSquareMore ,
    },
     {
        id: 2,
        couleur: "#6BED5A",
        titre: "Planification de campagnes",
        description: "Programmez vos SMS à l’avance pour qu’ils partent au moment idéal, même en votre absence. Gagnez du temps et maximisez l’impact",
        image: Clock4,
    },
     {
        id: 3,
        couleur: "#ED5A5C",
        titre: "Statistiques détaillées",
        description: "Suivez l’efficacité de vos campagnes : taux de livraison, nombre de clics, réponses reçues… Prenez de meilleures décisions grâce à la data",
        image: ChartColumnBig,
    },
     {
        id: 4,
        couleur: "#5ADEED",
        titre: "API simple à intégrer",
        description: "Automatisez l’envoi de SMS depuis vos propres outils grâce à notre API REST facile à utiliser, documentée et prête à l’emploi",
        image: Bot,
    },

]