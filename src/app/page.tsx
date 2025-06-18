import Image from "next/image";
import { AuthForm } from "@/components/AuthForm";
import download from "@/app/download.jpeg";

export default function HomePage() {
  return (
    <>
    
      <div className="relative w-full h-screen">
        <Image
          alt="Girl Reading a book"
          src={download}
          placeholder="blur"
          quality={100}
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
          }}
        />
      </div>
      <AuthForm />

    </>
  );
}
