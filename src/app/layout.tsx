import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { UserProvider } from "@/components/UserContext";
import NewEntryButton from "@/components/NewEntryButton";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Idiary App",
  description:
    "A simple app to capture and organize your daily thoughts and memories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <UserProvider>
          <ProtectedRoute>
            <Header />
            <main className="min-h-screen">{children}</main>
            <NewEntryButton />
          </ProtectedRoute>
        </UserProvider>
      </body>
    </html>
  );
}
