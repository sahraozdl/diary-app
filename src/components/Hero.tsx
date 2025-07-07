import Link from "next/link";
export default function Hero() {
  return (
    <section
      className="w-full max-w-[960px] my-10 flex flex-col gap-6 items-center justify-center bg-cover bg-center rounded-xl text-center p-6 min-h-[480px]"
      style={{
        backgroundImage: `linear-gradient(#CDA5EE, #FF9E00)`,
      }}
    >
      <h1 className="text-4xl font-black text-white leading-tight tracking-tight max-w-xl">
        Your Personal Growth Journey Starts Here
      </h1>
      <p className="text-white text-base max-w-md">
        Reflectly is your personal companion for self-discovery and growth.
        Capture your thoughts, track your progress, and unlock your potential.
      </p>
      <div className="flex gap-3 flex-wrap justify-center items-center">
        <Link
          href="/login"
          className="bg-[#000000] text-[#FF9E00] px-5 h-12 rounded-xl font-bold text-center content-center"
        >
          Get Started
        </Link>
        <Link
          href="/features"
          className="bg-[#f0f2f5] text-[#111418] px-5 h-12 rounded-xl font-bold text-center content-center"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
}
