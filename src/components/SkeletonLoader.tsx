"use client";
import React from "react";

interface SkeletonLoaderProps {
  type: "entry" | "user" | "text";
  count?: number;
}

export default function SkeletonLoader({
  type,
  count = 3,
}: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case "entry":
        return (
          <div className="border rounded-xl p-4 shadow bg-gray-200 dark:bg-gray-700 animate-pulse">
            <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 mb-2 rounded" />
            <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 mb-4 rounded" />
            <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
            <div className="h-3 w-1/4 bg-gray-300 dark:bg-gray-600 rounded" />
          </div>
        );
      case "user":
        return (
          <div className="flex items-center gap-3 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600" />
            <div className="flex flex-col flex-1 gap-2">
              <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded" />
            </div>
          </div>
        );
      case "text":
        return (
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="mb-4">
            {renderSkeleton()}
          </div>
        ))}
    </>
  );
}
