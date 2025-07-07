"use client";
import React, { useState, useEffect } from "react";
import { searchUsersByName } from "@/firebase/firestoreUser";
import { MagnifyingGlass } from "phosphor-react";
import { useRouter } from "next/navigation";
import { SearchUser } from "@/types/types";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (query.length > 2) {
      searchUsersByName(query).then((users) => {
        setResults(users);
        setShowDropdown(true);
      });
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [query]);

  const handleSelect = (userId: string) => {
    setQuery("");
    setShowDropdown(false);
    router.push(`/profile/${userId}`);
  };

  return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length > 2 && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // delay so click works
      />
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-500"
        onClick={() => {}}
      >
        <MagnifyingGlass size={24} />
      </button>

      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-auto shadow-lg">
          {results.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelect(user.id)}
              className="cursor-pointer p-2 hover:bg-purple-100"
            >
              {user.name || user.email || "Unnamed user"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
