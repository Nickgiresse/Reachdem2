import { PointerHighlight } from "@/components/ui/pointer-highlight";
import Image from "next/image";
import CountUp from './CountUp'



export function NombreUser() {
 
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-9 w-full mb-9">
        <Image src="/end.jpg" alt="Description" width={500} height={500} className="rounded-md"/>
        <div className=" flex flex-col gap-9  text-2xl font-bold tracking-tight md:text-4xl w-full">
            <p>{"Nombre d'utilisateur satisfait sur Reachdem"}</p>
            <PointerHighlight>
                <p className="w-full text-right p-4 rounded-md"><span className="text-9xl text-[#FB953C]"><CountUp
  from={0}
  to={500}
  separator=","
  direction="up"
  duration={1}
  className="count-up-text"
/></span> Utilisateurs</p>
            </PointerHighlight>
        </div>
    </div>
  );
}
