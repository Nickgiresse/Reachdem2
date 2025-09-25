const Prix=[
    {
        id:1,
        type: "SMS gratuits",
        tarif: "Gratuit",
        description:"15 SMS inclus puis 25 F par SMS supplémentaire.",
        bouton:"Commencer gratuitement",
        detail1: "Messages inclus :",
        suitDetail1:"15 SMS",
        detail2: "Pay as you go :",
        suitDetail2:"25 F par SMS après les 15 premiers"


    },
    {
        id:2,
        type: "SMS de démarrage",
        tarif: "18 F / SMS",
        description:"Pour les commandes de 1 000 SMS ou plus.",
        bouton:"Choisissez un plan",
        detail1: "Tarification au volume :",
        suitDetail1:"18 F par SMS (min. 1000)",
        detail2: "Accès API :",
        suitDetail2:"Envoyez via notre API SMS"


    },
    {
        id:3,
        type: "Par SMS",
        tarif: "15 F / SMS",
        description:"Tarif réduit à partir de 10 000 SMS.",
        bouton:"Commencez",
        detail1: "Tarification au volume :",
        suitDetail1:"15 F par SMS (min. 10 000)",
        detail2: "Support technique :",
        suitDetail2:"Accès à notre équipe de support"


    },
    {
        id:4,
        type: "SMS personnalisés",
        tarif: "Coutume",
        description:"Besoin de plus ? Contactez-nous pour discuter de vos tarifs.",
        bouton:"Contacter le service commercial",
        detail1: "Tarifs négociés :",
        suitDetail1:"Adaptés à votre volume",
        detail2: "Accompagnement dédié :",
        suitDetail2:"Assistance personnalisée"


    }

]


const GridPrix= () => {
    return(
        <div className=" flex flex-col justify-center items-center relative gap-[1%] mt-[50px] mb-[5%]">
            <h1 className="sm:text-[2rem] text-2xl font-bold text-center">Nous offrons des prix <span className="text-[#FB953C]">Abordable</span></h1>
            <p className="sm:text-[1.2rem] text-[0.8rem] text-center">Consultez nos plans tarifaires pour trouver le meilleur choix pour vous</p>
            <div className="flex md:flex-row flex-col justify-center gap-10 mx-9 my-10">
                {
                    Prix.map((prix)=>{
                        return(
                            <div key={prix.id} className="border border-gray-200 rounded-sm p-7 flex flex-col gap-7 my-5 sm:my-10 hover:shadow-xl">
                                <p className="font-meduim text-[13px]">{prix.type}</p>
                                <div>
                                    <p className="font-bold text-2xl">{prix.tarif}</p>
                                    <h1 className="text-gray-500 text-[10px]">{prix.description}</h1>
                                </div>
                                <button className="bg-[#FB953C] text-[12px] rounded-sm shadow-sm p-1 hover:bg-[#d6690aff]">{prix.bouton}</button>
                                <p className="text-[13px] text-[#FB953C] font-bold">{prix.detail1}<span className="font-medium text-gray-500"> {prix.suitDetail1}</span></p>
                                <hr/>
                                <p className="text-[13px] text-[#FB953C] font-bold">{prix.detail2}<span className="font-medium text-gray-500"> {prix.suitDetail2}</span></p>
                               
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}

export default GridPrix;
