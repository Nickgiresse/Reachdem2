
import HeaderWrapper from "@/components/header-wrapper"
import Service from "../components/service";
import Apropos from "../components/apropos"

export default async function Home() {
  return (
    <div>
        <HeaderWrapper />
        <Service />
        <Apropos />
    </div>
  );
}
