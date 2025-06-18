"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function EntryPage() {
  return (
    <ProtectedRoute>
      <div className="p-4 mt-20">
        <h1 className="text-2xl font-bold">EntryPage</h1>
      </div>
    </ProtectedRoute>
  );
}
