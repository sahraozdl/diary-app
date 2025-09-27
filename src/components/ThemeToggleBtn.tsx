"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "phosphor-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", initial);
    setTheme(initial);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md font-medium transition-all duration-300 border"
      style={{
        backgroundColor: "var(--primary)",
        color: "var(--background)",
        borderColor: "rgba(0,0,0,0.1)",
      }}
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      {theme === "light" ? "Dark mode" : "Light mode"}
    </button>
  );
}
