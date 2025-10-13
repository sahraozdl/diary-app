"use client";

import { useState } from "react";
import { addEntry } from "@/firebase/firestoreEntries";
import { useUser } from "./UserContext";
import { XCircleIcon } from "@phosphor-icons/react";

export default function EntryPopup({ onClose }: { onClose: () => void }) {
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title || !content) return;

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
      onClose();
    } catch (error) {
      console.error("Failed to add entry:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="relative bg-[var(--background)] p-6 rounded-3xl shadow-2xl w-full max-w-md flex flex-col space-y-4 border border-[var(--accent)]"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--foreground)] hover:text-[var(--primary)] transition cursor-pointer"
        >
          <XCircleIcon size={30} weight="fill" />
        </button>

        <h2 className="text-2xl font-bold text-[var(--foreground)] text-center">
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
          className="w-full p-3 border-b-2 border-[var(--accent)] bg-transparent text-[var(--foreground)] text-lg focus:outline-none focus:border-[var(--primary)] transition"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Write your thoughts..."
          className="w-full p-3 h-48 border-b-2 border-[var(--accent)] rounded-md resize-none bg-[var(--background-hover)] text-[var(--foreground)] shadow-inner focus:outline-none focus:border-[var(--primary)] transition"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <div className="flex justify-between items-center text-[var(--foreground)]">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={visibility === "public"}
              onChange={() => setVisibility("public")}
              className="accent-[var(--primary)]"
            />
            <span>Public</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={visibility === "private"}
              onChange={() => setVisibility("private")}
              className="accent-[var(--primary)]"
            />
            <span>Private</span>
          </label>
        </div>

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="bg-[var(--primary)] text-[var(--background)] px-6 py-2 rounded-full font-semibold hover:bg-[var(--hover-primary)] transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
