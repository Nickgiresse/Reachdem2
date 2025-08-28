"use client";
import FAQ from "@/components/sections/faq/default";
import Navbar from "@/components/navbar";
import { useSession } from "@/lib/auth-client";

export default function FAQPage() {
            const { data, isPending } = useSession();
            // Adapter la session pour la Navbar :
            const user = data?.user
                ? {
                        id: data.user.id,
                        email: data.user.email,
                        name: data.user.name,
                    }
                : undefined;
            const session = user ? { user } : null;
            return (
                <div>
                    <Navbar session={session} />
                    <FAQ />
                </div>
            );
}