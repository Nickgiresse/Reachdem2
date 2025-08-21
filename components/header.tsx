"use client"

import { motion } from "framer-motion";
import { useRouter } from "next/navigation"
import { TextLoop } from '@/components/motion-primitives/text-loop';
import Navbar from "./navbar"


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
        <div className="sm:h-screen bg-cover" style={{ backgroundImage: "url('/fontHeader.png')" }}>
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }} className="sm:h-full">
                <Navbar session={session} />
                <div className="h-full flex flex-row items-center justify-end md:w-full  pb-12">
                    <div className="h-max flex flex-col float-right justify-around w-[200px] sm:w-[500px] bg gap-[20px] pr-2 sm:pr-7">
                        <div>
                            <div className=' sm:text-[2rem] text-[1rem] font-bold'>
                                Atteignez-les peut importes{'   '}
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
                                    <span className="text-[#FB953C]">L'heure</span>
                                    <span className="text-[#FB953C]">Design Engineers</span>
                                </TextLoop>
                            </div>
 
                            <p className='text-[0.7rem]'>{`Maximisez l'impact de vos communications en touchant tous vos client grace a la grande puissances des SMS`}</p>
                        </div>
                            <button onClick={clicStart} className="bg-[#FB953C] w-max sm:pl-4 sm:pr-4  p-1 sm:p-2 rounded-[5px] font-medium text-white hover:bg-[#d6690aff] text-[0.7rem] sm:text-[0.9rem]">Commencer maintenant</button> 
                    
                    </div>
                </div>
            </motion.div>
        </div>
    )
} 
export default Header;