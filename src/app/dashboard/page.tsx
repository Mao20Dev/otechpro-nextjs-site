import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import backgroundImage from "@/assets/mainbackground.jpg";
import CompanyCards from "./_components/CompanyCards";

export default async function  Home() {
  const { userId } = auth();
  console.log(userId);

  const user = await currentUser();
  console.log(user);
  return (
    <>

      <div className="font-bold text-4xl text-gray-800 pt-4 md:pt-0 mb-8">Principal</div>

      
      
      <div className=" w-full h-auto rounded-lg grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6  ">
          <CompanyCards />
          <CompanyCards />
          <CompanyCards />
      </div>

      <div className="border-dashed border border-zinc-500 w-full h-[300px] rounded-lg">
        Graficas
      </div>
      <div className="border-dashed border border-zinc-500 w-full h-[300px] rounded-lg">
        Graficas 2
      </div>

      

      
      
    </>
  );
}