
import HeaderWrapper from "@/components/header-wrapper"
import Service from "../components/service";
import Apropos from "../components/apropos";
import GridPrix from "../components/grid-prix";
import Footer from "@/components/footer"


export default async function Home() {
  return (
    <div>
        <HeaderWrapper />
        <Service />
        <Apropos />
        <GridPrix />
        <hr/>

        <Footer />

    </div>
  );
}
