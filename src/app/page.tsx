import Hero from "@/components/Hero";
import Features from "@/components/Features";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-1 flex-col items-center px-10">
        <Hero />
        <Features />
      </main>
    </div>
  );
}
