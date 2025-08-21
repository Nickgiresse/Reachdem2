import { AppSidebar } from "@/components/app-sidebar"
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

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-y-auto max-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
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
        </header>
        <h1 className="text-xl md:text-3xl font-bold p-2 ">BIENVENUE CHEZ VOUS <span className="text-[#FB953C]">KAMDEM</span></h1>
        <hr/>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <h1 className="text-xl md:text-2xl font-bold p-2 ">Généralités</h1>
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            <div className="p-6 bg-muted/50 aspect-video rounded-xl" >
              <p className=" font-bold text-gray-400"> Projets Active</p>
              <p className="text-3xl font-bold">0</p>
              <p className="text-[10px] text-gray-400">Sur 0 projets total</p>
            </div>
            <div className="p-6 bg-muted/50 aspect-video rounded-xl"  >
              <p className=" font-bold text-gray-400">SMS restant:</p>
              <p className="text-2xl md:text-3xl font-bold">0 <span className="font-medium text-[15px] text-gray-400">pour <span className="font-bold">Nom_projet</span> </span></p>

            </div>
            <div className="p-6 bg-muted/50 aspect-video rounded-xl" >
              <p className=" font-bold text-gray-400">Campagne</p>
              <p className="text-3xl font-bold">0</p>

            </div>
             <div className="p-6 bg-muted/50 aspect-video rounded-xl" >
              <p className=" font-bold text-gray-400">Campagne</p>
              <p className="text-3xl font-bold">0</p>

            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold p-2 ">Statistiques détaillées</h1>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:h-[50vh]" >
          </div>
          <h1 className="text-xl md:text-2xl font-bold p-2 ">Statistiques détaillées</h1>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" >
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
