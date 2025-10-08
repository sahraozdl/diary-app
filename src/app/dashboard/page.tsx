"use client";

import { useEffect, useState } from "react";
import {
  getUserEntries,
  getPublicEntriesFromFollowedUsers,
} from "@/firebase/firestoreEntries";
import EntryCard from "@/components/EntryCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import { useUser } from "@/components/UserContext";
import { EntryType } from "@/types/types";

export default function DashboardPage() {
  const { user } = useUser();
  const [entries, setEntries] = useState<EntryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;

      setLoading(true);

      const myEntries = await getUserEntries(user.id);

      let followedEntries: EntryType[] = [];
      if (user.following && user.following.length > 0) {
        followedEntries = await getPublicEntriesFromFollowedUsers(
          user.following,
        );
      }

      const combined = [...myEntries, ...followedEntries].sort(
        (a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0),
      );

      setEntries(combined);
      setLoading(false);
    };

    fetchEntries();
  }, [user]);

  return (
    <div className="space-y-4 p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Feed</h1>

      {loading ? (
        <SkeletonLoader type="entry" count={5} />
      ) : entries.length === 0 ? (
        <p>No entries to show.</p>
      ) : (
        entries.map((entry) => <EntryCard key={entry.id} entry={entry} />)
      )}
    </div>
  );
}
