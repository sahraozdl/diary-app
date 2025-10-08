"use client";

import { useState } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import Link from "next/link";

export const features = [
  {
    title: "Daily Reflections",
    desc: "Capture your thoughts and feelings with guided prompts.",
    img: "/Image009.png",
  },
  {
    title: "Progress Tracking",
    desc: "Visualize your journey with charts and summaries.",
    img: "/Image009.png",
  },
  {
    title: "Mindfulness Exercises",
    desc: "Find peace with calming exercises and meditations.",
    img: "/Image011.png",
  },
  {
    title: "Connect with Friends",
    desc: "Share entries, react and comment on your friends' journeys.",
    img: "/Image009.png",
  },
  {
    title: "Custom Templates",
    desc: "Start with professionally designed diary layouts to inspire your writing.",
    img: "/Image011.png",
  },
];

export default function Features() {
  const [index, setIndex] = useState(0);
  const visibleCount = 3;

  const prev = () => {
    setIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const next = () => {
    setIndex((prev) => (prev + 1) % features.length);
  };

  const visibleFeatures = [];
  for (let i = 0; i < visibleCount; i++) {
    visibleFeatures.push(features[(index + i) % features.length]);
  }

  return (
    <section className="w-full max-w-[960px] py-10 px-4 mx-auto">
      <h2 className="text-[32px] font-bold mb-4">
        Features Designed for Your Growth
      </h2>
      <p className="mb-8 text-base max-w-[720px]">
        Explore the tools that make Idiary your ideal companion for personal
        development.
      </p>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={prev}>
          <CaretLeftIcon size={24} />
        </button>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 overflow-hidden flex-1">
          {visibleFeatures.map((feature, idx) => (
            <div key={idx} className="flex flex-col gap-3 pb-3">
              <div
                className="aspect-video bg-cover bg-center rounded-xl border-2 border-zinc-400"
                style={{ backgroundImage: `url(${feature.img})` }}
              />
              <p className="text-base font-medium">{feature.title}</p>
              <p className="text-sm text-[#60758a]">{feature.desc}</p>
            </div>
          ))}
        </div>
        <button onClick={next}>
          <CaretRightIcon size={24} />
        </button>
      </div>
      <Link href="/features" className="text-blue-600 hover:underline">
        View All Features
      </Link>
    </section>
  );
}
