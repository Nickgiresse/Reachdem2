"use client";
import FAQ from "@/components/sections/faq/default";
import Navbar from "@/components/navbar";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { HelpCircle, MessageSquare, Users, Zap } from "lucide-react";
import Footer from "@/components/footer";

export default function FAQPage() {
    const { data } = useSession();
    // Adapter la session pour la Navbar :
    const user = data?.user
        ? {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
            }
        : undefined;
    const session = user ? { user } : null;

    const features = [
        {
            icon: MessageSquare,
            title: "Messagerie SMS",
            description: "Envoyez des SMS en masse avec notre plateforme professionnelle"
        },
        {
            icon: Users,
            title: "Gestion Contacts",
            description: "Organisez et segmentez vos contacts efficacement"
        },
        {
            icon: Zap,
            title: "Automatisation",
            description: "Automatisez vos campagnes pour maximiser l'impact"
        },
        {
            icon: HelpCircle,
            title: "Support 24/7",
            description: "Notre équipe est là pour vous accompagner"
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
                            Centre d'<span className="text-orange-400">Aide</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            Trouvez rapidement les réponses à vos questions sur ReachDem. 
                            Notre plateforme de messagerie SMS professionnelle vous accompagne.
                        </p>
                        
                        {/* Features Grid */}
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <feature.icon className="w-8 h-8 text-orange-400 mx-auto mb-4" />
                                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-gray-300 text-sm">{feature.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <FAQ />
                <Footer />
            </motion.div>
        </div>
    );
}