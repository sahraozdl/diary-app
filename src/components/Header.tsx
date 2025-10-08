"use client";

import Link from "next/link";
import { getAuth, signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { app } from "@/firebase/config";
import {
  HouseSimpleIcon,
  GlobeHemisphereEastIcon,
  NewspaperIcon,
  RabbitIcon,
  SignOutIcon,
  SignInIcon,
} from "@phosphor-icons/react";
import React from "react";
import ThemeToggle from "./ThemeToggleBtn";
import SearchBar from "./SearchBar";
import { useUser } from "./UserContext";

const navItems = [
  { href: "/", icon: HouseSimpleIcon, label: "Home", authOnly: false },
  {
    href: "/entry",
    icon: GlobeHemisphereEastIcon,
    label: "Entry",
    authOnly: true,
  },
  {
    href: "/dashboard",
    icon: NewspaperIcon,
    label: "Dashboard",
    authOnly: true,
  },
  { href: "/profile", icon: RabbitIcon, label: "Profile", authOnly: true },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const auth = getAuth(app);
  const { user, loading } = useUser();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) return null;

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--background)]/80 border-b border-neutral-700 p-4 flex justify-between items-center">
        <Link href="/" className="text-3xl font-extrabold tracking-tight">
          Idiary
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-6">
          <SearchBar />
          <div className="flex items-center pt-4 space-x-6">
            {navItems.map((item) => {
              if (item.authOnly && !user?.id) return null;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center transition-colors group ${
                    isActive
                      ? "text-[var(--accent)]"
                      : "text-[var(--foreground)] hover:text-[var(--accent)]"
                  }`}
                >
                  <item.icon
                    size={36}
                    weight="duotone"
                    className="transition-transform group-hover:scale-110"
                  />
                  <span
                    className={`mt-1 text-sm opacity-0 group-hover:opacity-100 ${
                      isActive ? "opacity-100 font-semibold" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {user?.id ? (
              <button
                onClick={handleLogout}
                className="flex flex-col items-center text-purple-600 hover:text-purple-700 transition group"
              >
                <SignOutIcon
                  size={36}
                  weight="duotone"
                  className="transition-transform group-hover:scale-110"
                />
                <span className="mt-1 text-sm opacity-0 group-hover:opacity-100">
                  Logout
                </span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex flex-col items-center text-[var(--button-text)] px-4 py-2 rounded-md font-semibold group"
              >
                <SignInIcon
                  size={36}
                  weight="duotone"
                  className="transition-transform group-hover:scale-110"
                />
                <span className="mt-1 text-sm opacity-0 group-hover:opacity-100">
                  Login
                </span>
              </Link>
            )}
          </div>
          <ThemeToggle />
        </div>

        {/* Mobile search */}
        <div className="md:hidden flex items-center w-full justify-end gap-3">
          <SearchBar />
          <ThemeToggle />
        </div>
      </header>

      {/* Bottom mobile nav */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center bg-[var(--background)] border-t border-neutral-700 p-2 md:hidden z-50">
        {navItems.map((item) => {
          if (item.authOnly && !user?.id) return null;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center transition-colors group ${
                isActive
                  ? "text-[var(--accent)]"
                  : "text-[var(--foreground)] hover:text-[var(--accent)]"
              }`}
            >
              <item.icon
                size={32}
                weight="duotone"
                className="transition-transform group-hover:scale-110"
              />
            </Link>
          );
        })}

        {user?.id ? (
          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-purple-600 hover:text-purple-700 transition group"
          >
            <SignOutIcon
              size={32}
              weight="duotone"
              className="transition-transform group-hover:scale-110"
            />
          </button>
        ) : (
          <Link
            href="/login"
            className="flex flex-col items-center text-[var(--button-text)] px-2 py-1 rounded-md font-semibold group"
          >
            <SignInIcon
              size={32}
              weight="duotone"
              className="transition-transform group-hover:scale-110"
            />
          </Link>
        )}
      </nav>
    </>
  );
}
