"use client";
import React, { useState } from "react";
import { Quotes } from "@phosphor-icons/react";
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
        className="fixed bottom-15 right-6 bg-purple-500 hover:bg-purple-600 text-white px-4 py-4 rounded-full shadow-lg transition"
        aria-label="New Entry"
      >
        <Quotes size={32} weight="duotone" />
      </button>

      {showPopup && <EntryPopup onClose={() => setShowPopup(false)} />}
    </>
  );
}
