"use client";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  Shield, 
  Zap,
  Heart,
  Lightbulb,
  TrendingUp,
  CheckCircle
} from "lucide-react";

export default function AproposPage() {
  const { data } = useSession();
  
  // Adapter la session pour la Navbar
  const user = data?.user
    ? {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
      }
    : undefined;
  const session = user ? { user } : null;

  const values = [
    {
      icon: Target,
      title: "Innovation",
      description: "Nous repoussons les limites de la communication digitale pour offrir des solutions toujours plus performantes."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Nous croyons en la force du travail d'équipe et de la collaboration avec nos clients."
    },
    {
      icon: Shield,
      title: "Sécurité",
      description: "La protection de vos données et la confidentialité sont au cœur de nos préoccupations."
    },
    {
      icon: Heart,
      title: "Service Client",
      description: "Notre équipe dédiée vous accompagne à chaque étape de votre projet."
    }
  ];

  const team = [
    {
      name: "Équipe Technique",
      role: "Développement & Innovation",
      description: "Nos ingénieurs travaillent sans relâche pour créer des solutions robustes et évolutives."
    },
    {
      name: "Équipe Commerciale",
      role: "Relations Clients",
      description: "Notre équipe commerciale vous accompagne dans la réussite de vos projets de communication."
    },
    {
      name: "Support Client",
      role: "Assistance 24/7",
      description: "Une équipe dédiée disponible en permanence pour répondre à vos besoins."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Clients satisfaits" },
    { number: "50M+", label: "SMS envoyés" },
    { number: "99.9%", label: "Disponibilité" },
    { number: "24/7", label: "Support client" }
  ];

  const features = [
    {
      icon: Zap,
      title: "Performance",
      description: "Délivrance ultra-rapide de vos messages avec un taux de succès exceptionnel."
    },
    {
      icon: Globe,
      title: "Couverture Mondiale",
      description: "Envoi de SMS dans plus de 200 pays avec une couverture optimale."
    },
    {
      icon: Award,
      title: "Qualité Premium",
      description: "Service de qualité professionnelle avec des standards élevés."
    },
    {
      icon: Lightbulb,
      title: "Innovation Continue",
      description: "Évolution constante de nos fonctionnalités pour répondre à vos besoins."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar session={session} />
      
      {/* Hero Section */}
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[url('/header.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              À propos de <span className="text-orange-400">ReachDem</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Nous sommes passionnés par la communication digitale et nous nous engageons 
              à fournir des solutions de messagerie SMS professionnelles qui transforment 
              la façon dont les entreprises communiquent avec leurs clients.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mission Section */}
      <motion.div 
        className="bg-white py-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {"Chez ReachDem, nous croyons que chaque entreprise mérite d'avoir accès "}
                {"à des outils de communication professionnels et fiables. Notre mission "}
                {"est de démocratiser l'accès aux solutions de messagerie SMS de qualité "}
                {"pour permettre à toutes les entreprises, quelle que soit leur taille, "}
                {"d'atteindre efficacement leurs clients."}
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{"Simplicité d'utilisation"}</h3>
                    <p className="text-gray-600">Interface intuitive pour une prise en main rapide</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Fiabilité garantie</h3>
                    <p className="text-gray-600">Infrastructure robuste avec 99.9% de disponibilité</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{"Support dédié"}</h3>
                    <p className="text-gray-600">{"Équipe d'experts disponible 24h/24"}</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl p-8 text-white">
                <TrendingUp className="w-12 h-12 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Notre Vision</h3>
                <p className="text-lg">
                  {"Devenir la référence mondiale en matière de solutions de communication "}
                  {"digitale, en offrant des outils innovants qui transforment la relation "}
                  {"entre les entreprises et leurs clients."}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Values Section */}
      <motion.div 
        className="py-20 bg-gray-50"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {"Ces valeurs fondamentales guident chacune de nos décisions et actions "}
              {"au quotidien pour vous offrir le meilleur service possible."}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        className="py-20 bg-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Pourquoi Choisir ReachDem ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {"Découvrez les avantages qui font de ReachDem le choix privilégié "}
              {"de milliers d'entreprises à travers le monde."}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-6 p-6 bg-gray-50 rounded-xl"
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="p-3 bg-orange-100 rounded-lg flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div 
        className="py-20 bg-gray-50"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Notre Équipe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {"Une équipe passionnée et expérimentée qui travaille sans relâche "}
              {"pour vous offrir la meilleure expérience possible."}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="p-4 bg-orange-100 rounded-full w-fit mx-auto mb-6">
                  <Users className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-orange-500 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="py-20 bg-gradient-to-r from-orange-500 to-orange-400"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à Transformer Votre Communication ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {"Rejoignez des milliers d'entreprises qui font confiance à ReachDem pour leurs besoins de communication digitale."}
            </p>
            <motion.button
              className="bg-white text-orange-500 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Commencer Maintenant
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
