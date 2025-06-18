"use client";

import Link from "next/link";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "@/firebase/config";
import { List, X } from "phosphor-react";
import React, { useState } from "react";

export default function Header() {
  const router = useRouter();
  const auth = getAuth(app);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <header className="bg-gray-900 text-white shadow-md p-4 flex justify-between items-center relative z-50">
      <h1 className="text-2xl font-extrabold tracking-tight">Idiary</h1>

      {/* Desktop nav */}
      <nav className="hidden md:flex space-x-8 font-medium text-lg">
        <Link href="/" className="hover:text-gray-300 transition">
          Home
        </Link>
        <Link href="/entry" className="hover:text-gray-300 transition">
          Entry
        </Link>
        <Link href="/profile" className="hover:text-gray-300 transition">
          Profile
        </Link>
        <Link href="/dashboard" className="hover:text-gray-300 transition">
          Dashboard
        </Link>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-400 transition font-semibold"
        >
          Logout
        </button>
      </nav>

      {/* Mobile menu button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden p-2 rounded-md hover:bg-gray-800 transition"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? <X size={28} weight="bold" /> : <List size={28} weight="bold" />}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="absolute top-full left-0 w-full bg-gray-800 flex flex-col p-4 space-y-4 md:hidden z-40 shadow-lg">
          <Link
            href="/"
            className="hover:text-gray-300 transition text-lg"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/entry"
            className="hover:text-gray-300 transition text-lg"
            onClick={() => setMenuOpen(false)}
          >
            Entry
          </Link>
          <Link
            href="/profile"
            className="hover:text-gray-300 transition text-lg"
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-gray-300 transition text-lg"
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