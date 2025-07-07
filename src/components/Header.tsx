"use client";

import Link from "next/link";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "@/firebase/config";
import { List, X } from "phosphor-react";
import React, { useState } from "react";
import ThemeToggle from "./ThemeToggleBtn";
import SearchBar from "./SearchBar";

export default function Header() {
  const router = useRouter();
  const auth = getAuth(app);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <header
      className="shadow-md p-4 flex justify-between items-center relative z-50"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <h1 className="text-2xl font-extrabold tracking-tight">Idiary</h1>

      <nav className="hidden md:flex space-x-6 font-medium text-lg items-center">
        <SearchBar />
        <Link
          href="/"
          className="hover:text-[var(--accent)] transition duration-200"
        >
          Home
        </Link>
        <Link
          href="/entry"
          className="hover:text-[var(--accent)] transition duration-200"
        >
          Entry
        </Link>
        <Link
          href="/dashboard"
          className="hover:text-[var(--accent)] transition duration-200"
        >
          Dashboard
        </Link>
        <Link
          href="/profile"
          className="hover:text-[var(--accent)] transition duration-200"
        >
          Profile
        </Link>
        <Link
          href="/features"
          className="hover:text-[var(--accent)] transition duration-200"
        >
          Features
        </Link>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-400 transition font-semibold"
        >
          Logout
        </button>
        <ThemeToggle />
      </nav>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden p-2 rounded-md hover:bg-[var(--primary)] transition"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        style={{
          color: "var(--foreground)",
          backgroundColor: "transparent",
        }}
      >
        {menuOpen ? (
          <X size={28} weight="bold" />
        ) : (
          <List size={28} weight="bold" />
        )}
      </button>

      {menuOpen && (
        <nav
          className="absolute top-full left-0 w-full flex flex-col p-4 space-y-4 md:hidden z-40 shadow-lg"
          style={{
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
        >
          <Link
            href="/"
            className="hover:text-[var(--accent)] transition text-lg"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/entry"
            className="hover:text-[var(--accent)] transition text-lg"
            onClick={() => setMenuOpen(false)}
          >
            Entry
          </Link>
          <Link
            href="/profile"
            className="hover:text-[var(--accent)] transition text-lg"
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-[var(--accent)] transition text-lg"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="text-red-500 hover:text-red-400 transition font-semibold text-left text-lg"
          >
            Logout
          </button>
        </nav>
      )}
    </header>
  );
}
