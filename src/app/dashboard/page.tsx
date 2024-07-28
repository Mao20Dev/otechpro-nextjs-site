import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import backgroundImage from "@/assets/mainbackground.jpg";

export default async function  Home() {
  const { userId } = auth();
  console.log(userId);

  const user = await currentUser();
  console.log(user);
  return (
    <>
      <div className="font-bold text-4xl text-gray-800 pt-3">Principal</div>
      {/* <div className="w-full h-[60px] rounded-tl rounded-tr overflow-hidden flex flex-col items-center justify-center bg-gray-800 text-white">
        <Image objectFit="cover" objectPosition="center bottom" src={backgroundImage} alt="background" />
      </div> */}
      
      
      
    </>
  );
}