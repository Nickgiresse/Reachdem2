import FAQ from "@/components/sections/faq/default"
import { BackButton } from "@/components/back-button"

export default function Faq (){
    return (
        <div className="m-4">
            <BackButton href="/" label="Home" />
            <FAQ />
        </div>
    )
}