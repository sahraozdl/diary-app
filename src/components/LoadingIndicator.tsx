"use client";

import React from "react";

interface LoadingIndicatorProps {
  fullScreen?: boolean;
}

export default function LoadingIndicator({
  fullScreen = false,
}: LoadingIndicatorProps) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "h-screen" : "h-auto"
      } bg-[var(--background)] transition-colors`}
      role="status"
      aria-label="Loading"
    >
      <div className="w-12 h-12 border-4 border-gray-300 border-t-[var(--primary)] rounded-full animate-spin" />
    </div>
  );
}
