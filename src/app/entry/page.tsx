"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import EntryPopup from "@/components/EntryPopup";

export default function EntryPage() {
   const [showPopup, setShowPopup] = useState(false);
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Your Diary Feed</h1>

      <button
        onClick={() => setShowPopup(true)}
        className="fixed bottom-6 right-6 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg transition"
      >
        + New Entry
      </button>

      {showPopup && <EntryPopup onClose={() => setShowPopup(false)} />}
    </div>
    </ProtectedRoute>
  );
}
