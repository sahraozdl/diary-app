"use client";
import React, { useState, useEffect, useRef } from "react";
import { searchUsersByName } from "@/firebase/firestoreUser";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { SearchUser } from "@/types/types";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 2) {
      searchUsersByName(query).then((users) => {
        setResults(users);
      });
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (userId: string) => {
    setQuery("");
    setExpanded(false);
    router.push(`/profile/${userId}`);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`flex items-center rounded-lg transition-all duration-300 ease-in-out p-2 bg-[var(--background)] ${
          expanded ? "w-64 shadow-md border border-gray-300" : "w-30"
        } overflow-hidden`}
      >
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setExpanded(true)}
          className={`transition-all duration-300 ease-in-out px-2 py-1 outline-none bg-transparent w-full ${
            expanded
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        />
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center justify-center text-gray-500 hover:text-purple-500 transition"
          aria-label="Toggle search"
        >
          <MagnifyingGlassIcon size={30} />
        </button>
      </div>

      {expanded && results.length > 0 && (
        <ul className="absolute top-full left-0 mt-1 w-64 bg-[var(--background)] border border-gray-300 rounded shadow-lg max-h-48 overflow-auto z-50">
          {results.map((user) => (
            <li
              key={user.id}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(user.id);
              }}
              className="cursor-pointer p-2 hover:bg-[var(--primary)]/90"
            >
              {user.name || user.email || "Unnamed user"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
