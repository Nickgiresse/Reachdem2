
import Link from "next/link";

const Lien =[
    {   
        id: 1,
        nom:"Accueil",
        href: "/"
    },
    {   
        id: 2,
        nom:"Contact",
        href: "/"
    },
    {   

        id: 3,
        nom:"Tarif",
        href: "/"
    }
]

const Header = () => {
    return(
        <div className="h-screen bg-cover" style={{ backgroundImage: "url('/fontHeader.png')" }}>
            <nav className="flex flex-row justify-between p-7 pl-15 items-center ">
                <Link href="/" className="text-[1.5rem] font-bold ">Reachdem</Link>
                <div className="flex flex-row justify-around items-center  w-[50%]">
                    {
                        Lien.map((lien)=>{
                            return(
                                 <Link key={lien.id} href={lien.href} className=" font-medium hover:font-bold text-[0.9rem]">{lien.nom}</Link> 

                            )
                        })
                    }
                    <Link href="/login" className="bg-[#FB953C] w-max pl-4 pr-4 p-2 rounded-[5px] font-medium text-white hover:bg-[#d6690aff] text-[0.9rem]">Connexion</Link> 
                </div>
            </nav>
            <div className="h-full flex flex-row items-center justify-end w-full pr-20">
                <div className="h-[30%] flex flex-col  justify-around w-[40%] gap-[7%]">
                    <h1 className="text-[2rem] font-bold"><span className="text-[#FB953C]">Atteignez-les</span> où qu &apos ils se trouvent</h1>
                    <p className='text-[0.7rem]'>Maximisez l &apos impact de vos communications en touchant tous vos client grace a la grande puissances des SMS</p>
                    <Link href="/login" className="bg-[#FB953C] w-max pl-4 pr-4 p-2 rounded-[5px] font-medium text-white hover:bg-[#d6690aff]">Commencer maintenant</Link> 

                </div>
            </div>
        </div>
    )
} 
export default Header;