import { auth, currentUser } from "@clerk/nextjs/server";


export default async function  Home() {
  const { userId } = auth();
  console.log(userId);

  const user = await currentUser();
  console.log(user);
  return (
    <>
      <span className="font-bold text-4xl text-gray-800">Home</span>
      <div className="border-dashed border border-zinc-500 w-full h-12 rounded-lg">{user?.firstName}</div>
      <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg">{user?.lastName}</div>
      <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
      <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
      <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
      <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
    </>
  );
}