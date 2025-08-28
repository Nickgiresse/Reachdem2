'use client'

import { Signup1 } from "@/components/signup1";
import ScrollAnimation from "@/components/scoll-annimation";   
export default function Singup(){
    return(
        <div>
            <ScrollAnimation
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
              }}
            >
              <Signup1
                logo={{
                  url: "/",
                  src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-wordmark.svg",
                  alt: "Reachdem logo",
                  title: "Reachdem"
                }}
              />
            </ScrollAnimation>
        </div>
    )
}

    

