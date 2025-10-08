"use client";
import React, { useState } from "react";
import { Plus } from "phosphor-react";
import EntryPopup from "./EntryPopup";
import { useUser } from "./UserContext";
import { useRouter } from "next/navigation";

export default function NewEntryButton() {
  const { user } = useUser();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setShowPopup(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg transition"
        aria-label="New Entry"
      >
        <Plus />
      </button>

      {showPopup && <EntryPopup onClose={() => setShowPopup(false)} />}
    </>
  );
}
