"use client";
import React, { useEffect, useState } from "react";
import { getPublicEntries } from "@/firebase/firestoreUser";
import SkeletonLoader from "@/components/SkeletonLoader";
import { EntryType } from "@/types/types";
import EntryCard from "@/components/EntryCard";

export default function GlobalFeed() {
  const [entries, setEntries] = useState<EntryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEntries() {
      try {
        const data = await getPublicEntries();
        setEntries(data);
      } catch (error) {
        console.error("Failed to fetch public entries:", error);
      } finally {
        setLoading(false);
      }
    }
    loadEntries();
  }, []);

  if (loading) return <SkeletonLoader type="entry" count={5} />;

  return (
    <div className="min-h-screen p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Global Feed</h1>

      {entries.length === 0 ? (
        <p className="text-gray-500">No public entries yet.</p>
      ) : (
        entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            showAuthor={true}
            maxChars={250} // optional, you can adjust
          />
        ))
      )}
    </div>
  );
}
