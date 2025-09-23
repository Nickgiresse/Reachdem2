"use client"

import { Login2 } from "@/components/login2"
import ScrollAnimation from "@/components/scoll-annimation";

export default function LoginPage() {
  return (
    <div>
      <ScrollAnimation
        variants={{
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
        }}
      >
        <Login2
          heading="Login"
          logo={{
            url: "/",
            src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-wordmark.svg",
            alt: "Reachdem logo",
            title: "Reachdem"
          }}
        />
      </ScrollAnimation>
    </div>
  );
}