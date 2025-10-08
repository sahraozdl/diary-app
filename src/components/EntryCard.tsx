"use client";
import React, { useState } from "react";
import { EntryType } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import FollowBtn from "@/components/FollowBtn";

type EntryCardProps = {
  entry: EntryType;
  showAuthor?: boolean;
  maxChars?: number;
};

export default function EntryCard({
  entry,
  showAuthor = true,
  maxChars = 200,
}: EntryCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (!entry) return null;

  const date = entry.createdAt
    ? new Date(entry.createdAt.seconds * 1000).toLocaleDateString()
    : "Just now";

  const isLong = entry.content.length > maxChars;
  const displayedContent = expanded
    ? entry.content
    : isLong
      ? entry.content.slice(0, maxChars) + "..."
      : entry.content;

  return (
    <article
      className="border rounded-xl p-4 shadow-md hover:shadow-xl transition-shadow duration-200 bg-[var(--background)] text-[var(--foreground)]"
      aria-label={`Entry titled ${entry.title}`}
    >
      {showAuthor && (
        <div className="flex items-start justify-between mb-3">
          <Link
            href={`/profile/${entry.authorId}`}
            className="flex items-center gap-3 hover:opacity-80 transition"
          >
            <Image
              src={entry.authorPhotoURL || "/default-avatar.png"}
              alt={entry.authorName || "User"}
              width={44}
              height={44}
              className="rounded-full object-cover w-11 h-11"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-[var(--foreground)]">
                {entry.authorName || "Unknown"}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {entry.authorEmail || ""}
              </span>
            </div>
          </Link>

          {entry.authorId && (
            <FollowBtn
              profileUser={{
                id: entry.authorId,
                name: entry.authorName,
                email: entry.authorEmail,
                photoURL: entry.authorPhotoURL,
                followers: [],
                following: [],
              }}
              setProfileUser={() => {}}
              isInitiallyFollowing={false}
            />
          )}
        </div>
      )}

      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
        {entry.title}
      </h3>

      <p className="text-[var(--foreground)] leading-relaxed">
        {displayedContent}
        {isLong && (
          <button
            className="ml-1 text-[var(--primary)] font-semibold hover:text-[var(--hover-primary)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--primary)] rounded transition-colors"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>

      <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
        <span>{date}</span>
        <span>{entry.visibility}</span>
      </div>
    </article>
  );
}
