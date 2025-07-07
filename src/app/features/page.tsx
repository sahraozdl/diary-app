"use client";

import Image from "next/image";
import { features } from "@/components/Features";

export default function AllFeaturesPage() {
  return (
    <section className="max-w-6xl px-4 py-16 mx-auto">
      <h1 className="text-4xl font-bold mb-10">All Features</h1>
      <div className="grid md:grid-cols-2 gap-10">
        {features.map((feature, i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-900 shadow-lg rounded-xl overflow-hidden border border-zinc-800"
          >
            <div className="relative h-48 w-full">
              <Image
                src={feature.img}
                alt={feature.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2 text-zinc-200">{feature.title}</h2>
              <p className="text-zinc-600 dark:text-zinc-300 mb-4">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
