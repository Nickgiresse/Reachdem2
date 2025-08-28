import HeaderWrapper from "@/components/header-wrapper";
import Service from "../components/service";
import Apropos from "../components/apropos";
import GridPrix from "../components/grid-prix";
import ScrollAnimation from "../components/scoll-annimation";
import Footer from "@/components/footer";
import { NombreUser } from "@/components/nombreuser";

export default async function Home() {
  return (
    <div>
        <HeaderWrapper />
        

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollAnimation
                        variants={{
                            hidden: { opacity: 0, y: 60 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
                        }}
                    >
                        <Service />
                    </ScrollAnimation>
                </div>
        <Apropos />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollAnimation
                        variants={{
                            hidden: { opacity: 0, scale: 0.95 },
                            visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
                        }}
                    >
                        <GridPrix />
                    </ScrollAnimation>
                    <ScrollAnimation
                        variants={{
                            hidden: { opacity: 0, x: 80 },
                            visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
                        }}
                    >
                        <NombreUser />
                    </ScrollAnimation>
                </div>  
        <hr />
      
        
        <Footer />
    </div>
    );
  
}
