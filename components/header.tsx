"use client"

import { motion } from "framer-motion";
import { useRouter } from "next/navigation"
import { TextLoop } from '@/components/motion-primitives/text-loop';
import Navbar from "./navbar"
import { CircleCheckBig, House } from "lucide-react";

interface HeaderClientProps {
    session: {
        user?: {
            id: string;
            email: string;
            name?: string;
        };
    } | null; 
}
const Header = ({ session }:HeaderClientProps) => {
    const router = useRouter()
    
    async function clicStart() {
        if (!session) {
            router.push("/login")
        } else {
            router.push("/dashborduser")
        }
    }
    
    return(
        <div className="   h-screen bg-[url('/header.jpg')] bg-cover bg-right bg-no-repeat">
        <div className=" inset-0 md:bg-gradient-to-r bg-gradient-to-t from-black/90 to-black/40 h-full" >
        
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }} className="z-40 sm:h-full">
                <Navbar session={session}  />
                <div className=" h-full flex flex-row  md:w-full ">
                    <div className="z-20 h-full gap-10 flex flex-col items-center md:items-start pl-0 md:pl-10 w-full md:w-1/2">
                        <div>
                            <div className='z-10 text-white md:text-left text-center sm:text-[4rem] text-[3rem] font-bold'>
                                Atteignez-les, peu importe{'   '}
                                <TextLoop
                                    className='overflow-y-clip'
                                    transition={{
                                    type: 'spring',
                                    stiffness: 900,
                                    damping: 80,
                                    mass: 10,
                                    }}
                                    variants={{
                                    initial: {
                                        y: 20,
                                        rotateX: 90,
                                        opacity: 0,
                                        filter: 'blur(4px)',
                                    },
                                    animate: {
                                        y: 0,
                                        rotateX: 0,
                                        opacity: 1,
                                        filter: 'blur(0px)',
                                    },
                                    exit: {
                                        y: -20,
                                        rotateX: -90,
                                        opacity: 0,
                                        filter: 'blur(4px)',
                                    },
                                    }}
                                >
                                    <span className="text-[#FB953C]">Le lieu</span>
                                    <span className="text-[#FB953C]">Nombre</span>
                                    <span className="text-[#FB953C]">{"L'heure"}</span>
                                    
                                </TextLoop>
                            </div>

                            <p className='text-[0.7rem] sm:text-[1.1rem] text-gray-200 md:text-left text-center'>{`Maximisez l'impact de vos communications en touchant tous vos clients grâce à la grande puissance des SMS`}</p>
                        </div>
                            <button onClick={clicStart} className="z-40 bg-[#FB953C] w-max sm:pl-4 sm:pr-4  p-2 rounded-[5px] font-medium text-white hover:bg-[#d6690aff] text-[0.9rem]">Commencer maintenant</button> 
                            <div className="text-gray-300 flex gap-7">
                                <p className="flex"><CircleCheckBig color="#FB953C" /><span>30-day free trial.</span></p>
                                <p className="flex"><CircleCheckBig color="#FB953C" /><span>No credit card required</span></p>
                            </div>
                    </div>
                </div>
            </motion.div>
        </div>
        </div>

   
    )
} 
export default Header;