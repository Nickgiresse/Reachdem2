import React from "react"
export default function Dashboard() {
  return (
    <div>
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
            <div className="p-6 bg-muted/50 aspect-video rounded-xl" >
              <p className=" font-bold text-gray-400">Messages mensuels</p>
              <p className="text-3xl font-bold">0</p>
              <p className="text-3xl font-bold">ce mois-ci</p>

            </div>
            <div className="p-6 bg-muted/50 aspect-video rounded-xl"  >
              <p className=" font-bold text-gray-400">Crédit SMS:</p>
              <p className="text-2xl md:text-3xl font-bold">0 </p>
              <p className="text-[10px] text-gray-400">crédits restant</p>


            </div>
            
             <div className="p-6 bg-muted/50 aspect-video rounded-xl" >
              <p className=" font-bold text-gray-400">Taux de réussite</p>
              <p className="text-3xl font-bold">0.0%</p>
              <p className="text-3xl font-bold">des messages</p>
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold p-2 ">Statistiques détaillées</h1>
          <div className="flex flex-row gap-1/4">
            <div className="p-6 bg-muted/50 aspect-video rounded-xl" >
              <p className=" font-bold text-gray-400">Activité des messages</p>
              <p className="text-3xl font-bold">Aperçu de vos envoies récents</p>
              <p className="text-3xl font-bold">0.0%</p>
              <p className="text-3xl font-bold">des messages</p>
            </div>
            <div className="p-6 bg-muted/50 aspect-video rounded-xl" >
              <p className=" font-bold text-gray-400">Taux de réussite</p>
              <p className="text-3xl font-bold">0.0%</p>
              <p className="text-3xl font-bold">des messages</p>
            </div>
          </div>
         
          <h1 className="text-xl md:text-2xl font-bold p-2 ">Statistiques détaillées</h1>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" >
          </div>
        </div>
    </div>
  )
}
