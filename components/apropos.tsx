import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import Link from "next/link";
 
export default function Apropos() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 bg-gray-800">
      <h2 className="bg-clip-text text-white text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        {"Qu'esce que c'est,"} <br /> Reachdem?
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-200 dark:text-neutral-400 text-center">
        ReachDem simplifie la communication directe et instantanée...
        
      </p>
      <Link
          href="/"
          className="bg-[#FB953C]  pl-4 pr-4 p-2 rounded-[5px] font-medium text-white text-center mt-[3%] hover:bg-[#d6690aff]"
        >
          En savoir plus
        </Link>
    </BackgroundLines>
  );
}
 
