"use client";
import React from "react";

type EntryCardProps = {
  entry: {
    id: string;
    authorName: string;
    content: string;
    title: string;
    createdAt?: { seconds: number }; // from Firestore
    visibility: "public" | "private";
  };
  showAuthor?: boolean;
};

export default function EntryCard({ entry, showAuthor = true }: EntryCardProps) {
  const date = entry.createdAt
    ? new Date(entry.createdAt.seconds * 1000).toLocaleDateString()
    : "Just now";

  return (
    <div className="border rounded-xl p-4 shadow bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold">{entry.title}</h3>
      {showAuthor && (
        <p className="text-sm text-gray-500 mb-1">by {entry.authorName} • {date}</p>
      )}
      <p className="text-gray-700 dark:text-gray-300">{entry.content}</p>
      <span className="text-xs text-gray-400 mt-2 block">{entry.visibility}</span>
    </div>
  );
}