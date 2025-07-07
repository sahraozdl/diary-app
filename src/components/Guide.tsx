"use client";

import Link from "next/link";

const gettingStartedFeatures = [
  {
    title: "Download the App",
    desc: "Get Idiary on your device and start journaling anytime, anywhere.",
    img: "/Image012.png",
  },
  {
    title: "Set Your Goals",
    desc: "Define your personal growth objectives and track your progress over time.",
    img: "/Image013.png",
  },
  {
    title: "Connect with Friends",
    desc: "Share your reflections and insights with a supportive community of fellow learners.",
    img: "/Image014.png",
  },
];

export default function GettingStarted() {
  return (
    <section className="w-full max-w-[960px] py-10 px-4 mx-auto">
      <h2 className="text-[32px] font-bold mb-4">
        Getting Started with Idiary
      </h2>
      <p className="mb-8 text-base max-w-[720px]">
        It only takes a moment to begin your journey. Here’s how to get started
        with Idiary.
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-4 mb-6">
        {gettingStartedFeatures.map((feature, idx) => (
          <div key={idx} className="flex flex-col gap-3 pb-3">
            <div
              className="aspect-video bg-cover bg-center rounded-xl border-2 border-zinc-400"
              style={{ backgroundImage: `url(${feature.img})` }}
              role="img"
              aria-label={feature.title}
            />
            <h3 className="text-base font-medium">{feature.title}</h3>
            <p className="text-sm text-[#60758a]">{feature.desc}</p>
          </div>
        ))}
      </div>
      <Link href="/login" className="text-blue-600 hover:underline">
        Start Your Journey →
      </Link>
    </section>
  );
}
