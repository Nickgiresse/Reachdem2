import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CircleX } from 'lucide-react'

export default function NotFound() {
    return (
        <div className='w-full h-screen '>
            <div className='flex flex-col justify-center items-center gap-3 h-full'>
                <CircleX color="#a80000" size={80}/>
                <h1 className='text-gray-400 text-7xl mb-[10%]'>Page indisponibles</h1>
                <Link href="/dashboard"><Button>{"Retour à l'accueil"}</Button></Link>
            </div>
        </div>
    )
}