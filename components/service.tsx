
import { Services } from "./data/service"

const Service = () => { 
     return(
        <div className=" flex flex-col justify-center items-center relative gap-[1%] mt-[50px] mb-[5%]">
            <h1 className="sm:text-[2rem] text-2xl font-bold text-center">Nous vous procurons les meilleurs <span className="text-[#FB953C]">Services</span></h1>
            <p className="sm:text-[1.2rem] text-[0.8rem] text-center">{"Toujours a la une de l'innovation vivez une esperience incroyable"}</p>
            <div className="flex flex-col w-full md:flex-row md:justify-around justify-around items-center mt-[5%] w-[80%] m-auto">
                {
                    Services.map((service) => (
                        <div key={service.id} className="relative rounded-[7px] flex flex-col  gap-5 my-5 sm:my-10 hover:bg-gray-100 p-7 w-full md:w-[350px] ">
                    
                           <div className="p-2">
                                <service.image size={40} color={service.couleur} />
                           </div>
                            <h1 className=" font-bold text-[#263E4F] text-[1.1rem] ">{service.titre}</h1>
                            <p className="font-medium text-gray-500">{service.description}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
   


export default Service;