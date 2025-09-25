"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, Loader2, User, ArrowRight, Shield } from "lucide-react"

interface HeaderClientProps {
    session: {
        user?: {
            id: string;
            email: string;
            name?: string;
        };
    } | null; 
}

const DashbordU = ({ session }: HeaderClientProps) => {
    const router = useRouter()
    const [isRedirecting, setIsRedirecting] = useState(false)
    const [progress, setProgress] = useState(0)
    
    useEffect(() => {
        setIsRedirecting(true)
        
        // Animation de la barre de progression
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval)
                    return 100
                }
                return prev + 2
            })
        }, 20)
        
        const redirectTimer = setTimeout(() => {
            if (!session) {
                router.push("/login")
            } else {
                router.push("/dashboard")
            }
        }, 1000)
        
        return () => {
            clearTimeout(redirectTimer)
            clearInterval(progressInterval)
        }
    }, [session, router])

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
                <motion.div 
                    className="max-w-md w-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <motion.div 
                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <motion.div 
                            className="flex justify-center mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="p-4 bg-red-500/20 rounded-full">
                                <XCircle className="w-12 h-12 text-red-400" />
                            </div>
                        </motion.div>
                        
                        <motion.h1 
                            className="text-2xl font-bold text-white text-center mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            Accès Refusé
                        </motion.h1>
                        
                        <motion.p 
                            className="text-gray-300 text-center mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            Vous devez être connecté pour accéder à cette page
                        </motion.p>

                        <AnimatePresence>
                            {isRedirecting && (
                                <motion.div 
                                    className="space-y-4"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center justify-center space-x-2 text-orange-400">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span className="text-sm">Redirection en cours...</span>
                                    </div>
                                    
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <motion.div 
                                            className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.1 }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
            <motion.div 
                className="max-w-md w-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <motion.div 
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <motion.div 
                        className="flex justify-center mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="p-4 bg-gradient-to-r from-orange-500/20 to-orange-400/20 rounded-full">
                            <User className="w-12 h-12 text-orange-400" />
                        </div>
                    </motion.div>
                    
                    <motion.h1 
                        className="text-2xl font-bold text-white text-center mb-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        Bienvenue !
                    </motion.h1>
                    
                    <motion.p 
                        className="text-orange-400 text-center mb-6 font-medium"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        {session.user?.name || session.user?.email}
                    </motion.p>

                    <motion.div 
                        className="flex items-center justify-center space-x-2 text-gray-300 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">Session vérifiée</span>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                    </motion.div>

                    <AnimatePresence>
                        {isRedirecting && (
                            <motion.div 
                                className="space-y-4"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center justify-center space-x-2 text-orange-400">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-sm">Accès au dashboard...</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                                
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <motion.div 
                                        className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.1 }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default DashbordU;
