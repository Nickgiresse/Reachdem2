"use client"


import { useRouter } from "next/navigation"

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
            router.push("/")
        }
    }
    
    return(
        <div className="sm:h-screen bg-cover" style={{ backgroundImage: "url('/fontHeader.png')" }}>
            <Navbar session={session} />
            <div className="h-full flex flex-row items-center justify-end w-full sm:pr-20 pb-12">
                <div className="h-max flex flex-col  justify-around w-[200px] sm:w-[500px] gap-[20px]">
                    <div>
                        <h1 className="sm:text-[2rem] text-[1rem] font-bold"><span className="text-[#FB953C]">Atteignez-les</span>{` où qu'ils se trouvent`}</h1>
                        <p className='text-[0.7rem]'>Maximisez l &apos impact de vos communications en touchant tous vos client grace a la grande puissances des SMS</p>
                    </div>
                        <button onClick={clicStart} className="bg-[#FB953C] w-max sm:pl-4 sm:pr-4  p-1 sm:p-2 rounded-[5px] font-medium text-white hover:bg-[#d6690aff] text-[0.7rem] sm:text-[0.9rem]">Commencer maintenant</button> 
                   
                </div>
            </div>
        </div>
    )
} 
export default Header;