"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  MessageSquare,
  Users,
  Headphones
} from "lucide-react";

export default function ContactPage() {
  const { data } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Adapter la session pour la Navbar
  const user = data?.user
    ? {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
      }
    : undefined;
  const session = user ? { user } : null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
            phone: ""
          });
        }, 3000);
      } else {
        alert(result.message || 'Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'envoi du message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "contact@reachdem.co",
      description: "Réponse sous 24h"
    },
    {
      icon: Phone,
      title: "Téléphone",
      details: "+237 6XX XXX XXX",
      description: "Lun-Ven 8h-18h"
    },
    {
      icon: MapPin,
      title: "Adresse",
      details: "Douala, Cameroun",
      description: "Siège social"
    },
    {
      icon: Clock,
      title: "Horaires",
      details: "24h/24, 7j/7",
      description: "Support technique"
    }
  ];

  const supportTypes = [
    {
      icon: MessageSquare,
      title: "Support Général",
      description: "Questions sur nos services et fonctionnalités"
    },
    {
      icon: Users,
      title: "Support Commercial",
      description: "Informations sur nos tarifs et plans"
    },
    {
      icon: Headphones,
      title: "Support Technique",
      description: "Aide avec l'intégration et l'API"
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
              Contactez-<span className="text-orange-400">nous</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Notre équipe est là pour vous accompagner dans votre projet de communication. 
              {"N'hésitez pas à nous contacter pour toute question."}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Contact Info Cards */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
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
                <info.icon className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
              <p className="text-orange-500 font-medium mb-1">{info.details}</p>
              <p className="text-gray-500 text-sm">{info.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
              
              {isSubmitted ? (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Message envoyé !</h3>
                  <p className="text-gray-600">Nous vous répondrons dans les plus brefs délais.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="+237 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sujet *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleSelectChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="support">Support technique</option>
                        <option value="commercial">Question commerciale</option>
                        <option value="partnership">Partenariat</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      placeholder="Décrivez votre demande en détail..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white py-4 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Envoyer le message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Support Types & Additional Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Support Types */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Types de support</h3>
              <div className="space-y-4">
                {supportTypes.map((support, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <support.icon className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{support.title}</h4>
                      <p className="text-gray-600 text-sm">{support.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Besoin d&apos;aide immédiate ?</h3>
              <p className="mb-6">Notre équipe support est disponible 24h/24 pour vous accompagner.</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span>+237 6XX XXX XXX</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span>support@reachdem.co</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
