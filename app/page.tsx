import HeaderWrapper from "@/components/header-wrapper";
import Service from "../components/service";
import Apropos from "../components/apropos";
import GridPrix from "../components/grid-prix";
import Footer from "@/components/footer";

export default async function Home() {
  return (
    <div>
        <HeaderWrapper />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Service />
        </div>
        <Apropos />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <GridPrix />
        </div>  
        <hr />
      

        <Footer />
    </div>
    );
  
}
