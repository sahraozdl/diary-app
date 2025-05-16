import Image from "next/image";
import { AuthForm } from "@/pages/Auth/page";
import download from "@/app/download.jpeg";
export default function HomePage() {
  return (<>
    <Image
      alt="Girl Reading a book"
      src={download}
      placeholder="blur"
      quality={100}
      fill
      sizes="100vw"
      style={{
        objectFit: 'cover',
      }}
    />
    <AuthForm/> 
    </>
    
  );
}
