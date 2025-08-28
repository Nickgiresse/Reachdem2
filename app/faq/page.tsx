import FAQ from "@/components/sections/faq/default"
import Navbar from "@/components/navbar"




interface HeaderClientProps {
    session: {
        user?: {
            id: string;
            email: string;
            name?: string;
        };
    } | null; 
}

export default function Faq ({ session }:HeaderClientProps){
    return (
        <div >
            <Navbar session={session} />
          
            <FAQ />
        </div>
    )
}