
import Image from "next/image"

import { Services } from "./data/service"

const Service = () => { 
     return(
        <div className=" flex flex-col justify-center items-center relative gap-[1%] mt-[50px] mb-[5%]">
            <h1 className="sm:text-[2rem] text-2xl font-bold text-center">Nous vous procurons les meilleurs <span className="text-[#FB953C]">Services</span></h1>
            <p className="sm:text-[1.2rem] text-[0.8rem] text-center">Toujours a la une de l&apos innovation vivez une esperience incroyable</p>
            <div className="flex flex-wrap justify-around items-center mt-[5%]">
                {
                    Services.map((service) => (
                        <div key={service.id} className="relative w-[350px] h-[300px] shadow-md rounded-[7px]relative flex flex-col items-center justify-center gap-7 my-5 sm:my-10 hover:shadow-xl">
                    
                           {/* <div className=" absolute top-0 left-0 "> */}
                             <Image src={service.image} alt="Logo" width={50} height={50} className= {` absolute top-0 left-0 rounded-tl-[7px] rounded-br-[10px]`}/>
                           {/* </div> */}
                            <h1 className="m-5 pl-4 font-bold text-[#263E4F] text-[1.1rem]">{service.titre}</h1>
                            <p className="m-5">{service.description}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
   


export default Service;