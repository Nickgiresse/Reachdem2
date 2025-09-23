import Link from "next/link";
import { Deconnexion } from "@/components/deconnexion";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import { useScroll } from "@/hooks/use-scroll";

const Lien =[
    {   
        id: 1,
        nom:"Accueil",
        href: "/"
    },{   
        id: 2,
        nom:"A propos",
        href: "/apropos"
    },
    {   
        id: 3,
        nom:"Contact",
        href: "/contact"
    },
    {   
        id: 4,
        nom:"FAQ",
        href: "/faq"
    }
]

interface Navprops {
    session: {
        user?: {
            id: string;
            email: string;
            name?: string;
        };
    } | null;
}

const Navbar = ({ session }:Navprops)=>{
    const [toggleMenu, setToggleMenu] = useState(false);
    const isScrolled = useScroll();
    
    return(
        <nav className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
            isScrolled 
                ? ' w-[80%] backdrop-blur-md rounded-full border border-gray-200 shadow-lg py-4 top-10' 
                : 'w-full bg-transparent py-7 '
        }`}>
            <div className="flex flex-row justify-between px-7 sm:pl-15 items-center">
                <Link href="/" className={`text-[1.5rem] font-bold transition-colors duration-300 ${
                    isScrolled ? 'text-black' : 'text-white'
                }`}>
                    Reachdem
                </Link>
                <div className={`flex flex-row justify-around items-center gap-[10px] w-max z-1 ${
                    isScrolled ? 'text-black' : 'text-white'
                }`}>
                    {
                        Lien.map((lien)=>{
                            return(
                                 <Link key={lien.id} href={lien.href} className={`hidden sm:inline font-medium hover:text-[#FB953C] text-[0.9rem] w-max mx-[10px] transition-colors duration-300 ${
                                     isScrolled ? 'text-black hover:text-[#FB953C]' : 'text-white hover:text-[#FB953C]'
                                 }`}>{lien.nom}</Link> 
                            )
                        })
                    }
                    
                </div>
                <div className="flex flex-row items-center gap-4 hidden sm:inline ">
                    {!session ? (
                            <Link href="/login" className="bg-[#FB953C] w-max pl-4 pr-4 p-2 rounded-[5px] font-medium text-white hover:bg-[#d6690aff] text-[0.9rem]">Connexion</Link> 
                        ) : (
                            <Deconnexion text="Deconnexion"/> 
                        )}
                  
                </div>
                {/* slide bar*/}
                <div className='z-50 flex relative md:absolute'>
                {
                    toggleMenu 
                    ? <AiOutlineClose fontSize={28} className='text-black md:hidden cursor-pointer' onClick={() => setToggleMenu(false)} />
                    : <HiMenuAlt4 fontSize={28} className={`rounded-sm p-2 border-1 border-[#FB953C] bg-transparent hover:bg-[#FB953C] md:hidden cursor-pointer transition-colors duration-300 ${
                        isScrolled ? 'text-black' : 'text-white'
                    }`} onClick={() => setToggleMenu(true)} />}
                {
                   toggleMenu && (
                    <ul
                        className={`
                            ${
                            isScrolled 
                                ? ' z-40 fixed top-0 -right-2 p-3 w-[80vw] h-[30vh] shadow-2xl md:hidden list-none flex flex-col justify-start items-center rounded-md bg-gradient-to-b from-white to-[#ead3c0]  text-black animate-slide-in gap-3' 
                                : 'z-40 fixed top-0 -right-2 p-3 w-[80vw] h-screen shadow-2xl md:hidden list-none flex flex-col justify-start items-center rounded-md bg-gradient-to-b from-white to-[#ead3c0]  text-black animate-slide-in gap-3'
                        }
                        `}
                    >
                        <li className='text-xl w-full my-2'>
                            <AiOutlineClose className='cursor-pointer' onClick={() => setToggleMenu(false)} />
                        </li>
                        {Lien.map((item) => (
                          <Link
                            key={item.id}
                            href={item.href}
                            className={`font-medium text-base transition-colors whitespace-nowrap `}
                            >
                                {item.nom}
                                {/* <NavbarItem key={item.label + index} title={item.label} classProps="my-2 text-lg" /> */}
                          </Link>
                        ))}
                        <li>
                            <div className="flex flex-row items-center gap-4  ">
                                {!session ? (
                                        <Link href="/login" className="bg-[#FB953C] w-max sm:pl-4 sm:pr-4  p-1 sm:p-2 rounded-[5px] font-medium text-white hover:bg-[#d6690aff] text-[0.9rem]">Connexion</Link> 
                                    ) : (
                                        <Deconnexion text="Deconnexion"/> 
                                    )}
                            
                            </div>
                        </li>
                    </ul>
                   ) 
                }    
            </div>
            </div>
        </nav>
    )
}
export default Navbar