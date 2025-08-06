"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";

interface butProps{
    className?: string
    text?:string
}

export const Deconnexion = ({className,text}:butProps) => {
    const router = useRouter()
    const [isPending, setisPending]= useState(false)
    
    async function handleClick() {
        await signOut(
            {
                fetchOptions: {
                     onRequest: () => {setisPending(true)}, 
                    onResponse: () => {setisPending(false)},
                    onError:(ctx)=>{
                        toast.error(ctx.error.message)
                    },
                    onSuccess: () => {
                        router.push("/")
                    }
                }
            }
        )
    }
    return(
        <Button onClick={handleClick} className={className}  variant="destructive" disabled={isPending}>
            {text}
        </Button>
    )
}