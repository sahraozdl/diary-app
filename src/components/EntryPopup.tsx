"use client";

import { useState } from "react";
import { addEntry } from "@/firebase/firestoreEntries";
import { useUser } from "./UserContext";

export default function EntryPopup({ onClose }: { onClose: () => void }) {
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.warn("User not loaded yet");
      return;
    }
    if (!title || !content) {
      console.warn("Title or content missing");
      return;
    }

    setLoading(true);
    try {
      await addEntry({
        authorId: user.id || "unknown",
        authorName: user.name || "Anonymous",
        authorPhotoURL: user.photoURL || "",
        authorEmail: user.email || "",
        title,
        content,
        visibility,
      });
      console.log("Entry added successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to add entry:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <form
        className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold dark:text-zinc-200">
          New Diary Entry
        </h2>

        <input type="hidden" name="authorId" value={user.id} />
        <input type="hidden" name="authorName" value={user.name} />
        <input
          type="hidden"
          name="authorPhotoURL"
          value={user.photoURL || ""}
        />
        <input type="hidden" name="authorEmail" value={user.email || ""} />

        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:text-zinc-200"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Write your thoughts..."
          className="w-full p-2 h-40 border rounded-md resize-none dark:bg-zinc-800 dark:text-zinc-200"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 dark:text-zinc-200">
            <span className="text-sm">Public</span>
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={visibility === "public"}
              onChange={() => setVisibility("public")}
            />
          </label>
          <label className="flex items-center space-x-2 dark:text-zinc-200">
            <span className="text-sm">Private</span>
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={visibility === "private"}
              onChange={() => setVisibility("private")}
            />
          </label>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
