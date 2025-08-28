"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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
    
    useEffect(() => {
        setIsRedirecting(true)
        
        const redirectTimer = setTimeout(() => {
            if (!session) {
                router.push("/login")
            } else {
                router.push("/dashboard")
            }
        }, 1000) // Délai d'1 seconde pour montrer le message
        
        return () => clearTimeout(redirectTimer)
    }, [session, router])

    if (!session) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-bold text-2xl text-red-500 mb-4">
                        {"Erreur!! Vous n'êtes pas autorisé"}
                    </h1>
                    {isRedirecting && (
                        <p className="text-gray-600">
                            Redirection vers la page de connexion...
                        </p>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="font-bold text-2xl text-blue-500 mb-4">
                    Bienvenue {session.user?.name || session.user?.email}
                </h1>
                {isRedirecting && (
                    <p className="text-gray-600">
                        Redirection vers le dashboard...
                    </p>
                )}
            </div>
        </div>
    )
}

export default DashbordU;