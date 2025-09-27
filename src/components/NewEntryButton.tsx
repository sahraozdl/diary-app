"use client";
import React from "react";
import { Plus } from "phosphor-react";
import EntryPopup from "./EntryPopup";
import { createRoot } from "react-dom/client";

export default function NewEntryButton() {
  return (
    <button
      onClick={() => {
        const popup = document.createElement("div");
        popup.id = "entry-popup";
        document.body.appendChild(popup);
        const root = createRoot(popup);
        root.render(
          <EntryPopup
            onClose={() => {
              root.unmount();
              popup.remove();
            }}
          />,
        );
      }}
      className="fixed bottom-6 right-6 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg transition"
      aria-label="New Entry"
    >
      <Plus />
    </button>
  );
}
