"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";


export const Deconnexion = () => {
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
        <Button onClick={handleClick} size="sm" variant="destructive" disabled={isPending}>
            Deconnexion
        </Button>
    )
}