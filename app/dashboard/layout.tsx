

import { AppSidebar } from "@/components/app-sidebar"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  // export default async function Dashboard() {
  //   const session = await auth.api.getSession({
  //     headers: await headers()
  //   })
  if (!session) {
    redirect("/dashborduser")
  }
  return (
    
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-y-auto max-h-screen w-full">
        <header className="flex w-full justify-between  h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb className="flex flex-row justify-between items-cente w-full ">
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Accueil
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Accueil</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>

            </Breadcrumb>
          </div>
          <h1 className="italic p-2 mr-15  ">Bienvenue chez vous  <span className="text-[#FB953C] ">{session?.user?.name || session?.user?.email}</span></h1>

        </header>
        <div className="h-[100vh] overflow-y-auto p-4">
          {children}
        </div>
        
      </SidebarInset>
    </SidebarProvider>
  );
}
