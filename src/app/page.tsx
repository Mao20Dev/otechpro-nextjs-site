import Link from "next/link";
import Image from "next/image";
import backgroundImage from "../assets/background.jpg";
import LampDemo from "@/components/ui/lamp";

export default function Home() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-500 rounded-none">
      <LampDemo />
    </div>
  );
}
