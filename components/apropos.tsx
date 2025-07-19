import { AproposDetail } from "./data/apropos";
import Link from "next/link";

const Apropos = () => {
  return (
    <div className=" flex flex-row items-center justify-end mt-10 pr-15 bg-cover w-full h-screen bg-[url(/fontbody.png)]">
      <div className="w-[40%] flex flex-col gap-[20%]">
        {AproposDetail.map((apropos) => {
          return (
            <div key={apropos.id} className=" w-full flex flex-col gap-[20%] ">
              <h1 className="text-[1.5rem] font-bold text-[#FB953C]">
                {apropos.titre}
              </h1>
              <p className="text-justify">{apropos.description}</p>
            </div>
          );
        })}
        <Link
          href="/"
          className="bg-[#FB953C] w-full pl-4 pr-4 p-2 rounded-[5px] font-medium text-white text-center mt-[3%] hover:bg-[#d6690aff]"
        >
          En savoir plus
        </Link>
      </div>
    </div>
  );
};
export default Apropos;
