"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function EntryPage() {
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">later will be global feed</h1>
      </div>
    </ProtectedRoute>
  );
}
