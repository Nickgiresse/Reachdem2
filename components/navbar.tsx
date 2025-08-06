import Link from "next/link";
import { Deconnexion } from "@/components/deconnexion";
import Image from "next/image"
const Lien =[
    {   
        id: 1,
        nom:"A propos",
        href: "/"
    },
    {   
        id: 2,
        nom:"Contact",
        href: "/"
    },
    {   
        id: 3,
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
    return(
<nav className="flex flex-row justify-between p-7 sm:pl-15 items-center ">
                <Link href="/" className="text-[1.5rem] font-bold ">Reachdem</Link>
                <div className="flex flex-row justify-around items-center gap-[10px] w-max">
                    {
                        Lien.map((lien)=>{
                            return(
                                 <Link key={lien.id} href={lien.href} className="hidden sm:inline font-medium hover:font-bold text-[0.9rem] w-max mx-[10px]">{lien.nom}</Link> 
                            )
                        })
                    }
                    
                </div>
                <div className="flex flex-row items-center gap-4">
                    {!session ? (
                            <Link href="/login" className="bg-[#FB953C] w-max sm:pl-4 sm:pr-4  p-1 sm:p-2 rounded-[5px] font-medium text-white hover:bg-[#d6690aff] text-[0.9rem]">Connexion</Link> 
                        ) : (
                            <Deconnexion text="Deconnexion"/> 
                        )}
                    <Image src="/menu.png" alt="menu" width={20} height={20} className="sm:hidden"/>   
                </div>
            </nav>
    )
}
export default Navbar