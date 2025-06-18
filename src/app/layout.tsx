import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { UserProvider } from "@/components/UserContext";

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
      <body>
        <UserProvider>
          <Header />
          <main>{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
