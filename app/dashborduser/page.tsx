import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import DashbordU from "./dashborduser"

export default async function DashbordUser(){
 
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return <DashbordU session={session} />
     
}
