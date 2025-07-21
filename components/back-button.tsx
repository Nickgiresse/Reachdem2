import Link from "next/link"
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react"

interface BackButtonProps{
    href: string;
    label?:string;
}

export const BackButton =({href, label}: BackButtonProps)=>{
    return(
        <Button size="sm" asChild className="bg-white text-black hover:bg-gray-200">
            <Link href={href}>
                <ArrowLeftIcon /> {label}
            </Link>
        </Button>
    )
}