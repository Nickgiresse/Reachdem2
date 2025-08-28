import React from 'react'
import { useSession } from '../lib/auth-client';
import { Button } from './ui/button';
import Link from 'next/link';
export default function StartButton() {
    const {data: session, isPending} = useSession();

    if (isPending) {
        return (
            <Button size="lg" className='opacity-50' asChild>
                Commencer Maintenant
            </Button>
        );
        
    }
    const href = session ? "/dashboard" : "/login";
    return (
        <Button size="lg" className='opacity-50' asChild>
            <Link href={href}>Commencer Maintenant</Link>
        </Button>
    )
}
