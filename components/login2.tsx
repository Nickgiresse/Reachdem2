'use client'
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import React from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { useState } from "react";
import { BackButton } from "@/components/back-button"
import { signInEmailAction } from "@/action/sign-in-email.action";





interface Login2Props {
  heading?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title?: string;
  };
  buttonText?: string; 
  googleText?: string;
  signupText?: string;
  signupUrl?: string;
}

const Login2 = ({
  heading = "Login",
  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-wordmark.svg",
    alt: "logo",
    title: "Reachdem",
  },
  googleText = "Login with Google",
  buttonText = "Login",
  signupText = "Need an account?",
  signupUrl = "/singup",
}: Login2Props) => {
  const router = useRouter()
  const [isPending, setisPending]= useState(false)

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    
   evt.preventDefault();

    setisPending(true);

    const formData = new FormData(evt.target as HTMLFormElement);

 
    const result = await signInEmailAction(formData);
    if (typeof result === "object" && result !== null && "error" in result && result.error) {
      toast.error(result.error);
      setisPending(false);
    } else {
      toast.success("Connexion reussi");
      router.push("/");
    }
    
  }
  return (
    <section className="bg-gradient-to-b from-white to-[#fde1cb8b]  h-screen p-2">
      <BackButton href="/"  />
        
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-6 lg:justify-start">
          {/* Logo */}
          <a href={logo.url}>
            {/* <img
              src={logo.src}
              alt={logo.alt}
              title={logo.title}
              className="h-10 dark:invert"
            /> */}
            <p className="font-bold text-2xl">{logo.title}</p>
            
          </a>
          <form onSubmit={handleSubmit} className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md"> 
            
              {heading && <h1 className="text-xl font-semibold">{heading}</h1>}
              <div className="flex w-full flex-col gap-2">
                {/* <Label>Email</Label> */}
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="text-sm"
                 
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                {/* <Label>Password</Label> */}
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="text-sm"
                 
                />
              </div>
              <Button type="submit" className="w-full bg-[#FB953C] hover:bg-[#d6690aff]" disabled={isPending}>
                {buttonText}
              </Button>
              <Button variant="outline" className="w-full">
                    <FcGoogle className="mr-2 size-5" />
                    {googleText}
                  </Button>
                  <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                      fill="currentColor"
                    />
                  </svg>
                  Login with GitHub
                </Button>
            
          </form>
          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>{signupText}</p>
            <a
              href={signupUrl}
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Login2 };
