import Link from "next/link";
import Image from "next/image";
import backgroundImage from "../assets/background.jpg";

export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="w-full  flex flex-col items-center justify-center bg-gray-800 text-white p-10">
        <h1 className="text-4xl font-bold mb-6">¡Bienvenido a OTECHPRO!</h1>
        <p className="text-lg mb-6">
          Gestiona tus proyectos de manera eficiente y eficaz con nuestra herramienta innovadora.
        </p>
        <Link href="/dashboard">
          <button className="bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded">
            Ir al Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
