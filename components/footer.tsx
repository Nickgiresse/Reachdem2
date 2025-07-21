import Image from "next/image"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Produits =[
    {   
        id: 1,
        nom:"SMS",
        href: "/"
    },
    {   
        id: 2,
        nom:"E-mail",
        href: "/"
    },
    {   
        id: 3,
        nom:"Campagnes",
        href: "/"
    },
    {   
        id: 4,
        nom:"Contacts",
        href: "/"
    },
    {   
        id: 5,
        nom:"API",
        href: "/"
    }

]

const Soutiens =[
    {   
        id: 1,
        nom:"Tarification",
        href: "/"
    },
    {   
        id: 2,
        nom:"FAQ",
        href: "/faq"
    },
    {   
        id: 3,
        nom:"Demo",
        href: "/"
    },
    {   
        id: 4,
        nom:"Contact",
        href: "/"
    }
  
]

const Entreprises =[
    {   
        id: 1,
        nom:"A propos",
        href: "/"
    },
    {   
        id: 2,
        nom:"Condition d'utilisateur",
        href: "/"
    },
    {   
        id: 3,
        nom:"Politique de confidentialité",
        href: "/"
    }
]

const Footer=()=>{
    return(
        <div>
            <div className="flex sm:flex-row flex-col justify-around gap-10 p-10">
                <div className="flex flex-col gap-7 sm:w-1/4">
                    <Image src="/reachdem.png" alt="logo reachdem" width={70} height={70} />
                    <p>Building communication solutions for businesses and individuals around the globe. Send SMS and emails efficiently with our platform.</p>
                    <div className="flex flex-row gap-5">
                        <Input type="email" id="email" name="email" placeholder="Your email"/>
                        <Button className="bg-[#FB953C]">Subscrire</Button>
                    </div>
                </div>
                <hr className="sm:hidden"/>
                <div className="flex flex-col gap-7 ">
                    <h1 className="text-xl font-bold">Products</h1>
                    {
                        Produits.map((produit)=>{
                            return(
                                <Link key={produit.id} href={produit.href} className="text-gray-500 hover:text-black">{produit.nom}</Link>
                            )
                        })
                    }
                </div>
                <hr className="sm:hidden"/>

                <div className="flex flex-col gap-10">
                    <h1 className="text-xl font-bold">Soutiens</h1>
                    {
                        Soutiens.map((soutien)=>{
                            return(
                                <Link key={soutien.id} href={soutien.href} className="text-gray-500 hover:text-black">{soutien.nom}</Link>
                            )
                        })
                    }
                </div>
                <hr className="sm:hidden"/>

                <div className="flex flex-col gap-10">
                    <h1 className="text-xl font-bold">Entreprises</h1>
                    {
                        Entreprises.map((entreprise)=>{
                            return(
                                <Link key={entreprise.id} href={entreprise.href} className="text-gray-500 hover:text-black">{entreprise.nom}</Link>
                            )
                        })
                    }
                </div>
              

            </div>
            <hr />
            <div className="py-15">
                <p className="text-center  p-5">&copy; {new Date().getFullYear()} Reachdem. All rights reserved. <Link href="#" className="underline hover:text-[#FB953C]">Learn more about us</Link></p>

            </div>
        </div>
    )
}

export default Footer;