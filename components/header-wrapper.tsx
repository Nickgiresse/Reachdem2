import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import Header from "./header"

const HeaderWrapper = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    
    return <Header session={session} />
}

export default HeaderWrapper; 