import Image from "next/image";
import Link from "next/link";
import Header from "../components/header";
import Service from "../components/service";
import Apropos from "../components/apropos"

export default function Home() {
  return (
    <div>
        <Header />
        <Service />
        <Apropos />
    </div>
  );
}
