"use client";

import Link from "next/link";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "@/firebase/config";
import { List, X } from "phosphor-react";
import React, { useState } from "react";
import ThemeToggle from "./ThemeToggleBtn";
import SearchBar from "./SearchBar";
import { useUser } from "./UserContext";

export default function Header() {
  const router = useRouter();
  const auth = getAuth(app);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <header
      className="sticky top-0 backdrop-blur-md bg-[var(--background)]/80 border-b border-neutral-700 p-4 flex justify-between items-center z-50"
      style={{
        color: "var(--foreground)",
      }}
    >
      <Link href="/" className="text-2xl font-extrabold tracking-tight">
        Idiary
      </Link>

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
        {user?.id && (
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-400 transition font-semibold"
          >
            Logout
          </button>
        )}
        {!user?.id && (
          <Link
            href="/login"
            className="text-[var(--button-text)] px-4 py-2 rounded-md font-semibold"
          >
            Login
          </Link>
        )}
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
          {user?.id && (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="text-red-500 hover:text-red-400 transition font-semibold text-left text-lg"
            >
              Logout
            </button>
          )}
          {!user?.id && (
            <Link
              href="/login"
              className="text-[var(--button-text)] px-4 py-2 rounded-md font-semibold text-lg"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
          <ThemeToggle />
        </nav>
      )}
    </header>
  );
}
