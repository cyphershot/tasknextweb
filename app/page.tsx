import Image from "next/image";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Add your page content here */}
      <Hero />
    </main>
  );
}
