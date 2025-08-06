"use client"


import { useRouter } from "next/navigation"
import { Deconnexion } from "@/components/deconnexion"


interface HeaderClientProps {
    session: {
        user?: {
            id: string;
            email: string;
            name?: string;
        };
    } | null; 
}

const DashbordU= ({ session }:HeaderClientProps)=>{
    const router = useRouter()
    if (!session) {
        router.push("/login")
        return(
                <div className="w-full h-screen flex items-center justify-center">
                    <h1 className="font-bold text-2xl text-red-500">Error!! Vous n'etes pas autorisé </h1>
                   
                </div>
            )
   
    } else {
            return(
                <div>
                    <h1>Bienvenue chez toi boss</h1>
                     <Deconnexion className="text-black bg-white border-1 border-black px-5  rounded-sm hover:bg-gray-300" text="se deconnecter" />
                       

                </div>
            )

            
        }
    
      
   
} 
export default DashbordU;