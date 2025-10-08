"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "./UserContext";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
}

export default function ProtectedRoute({
  children,
  redirectPath = "/login",
}: ProtectedRouteProps) {
  const { user, loading, errors } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [showError, setShowError] = useState<string | null>(null);

  const publicPaths = ["/login", "/", "/reset-password"];
  const isPublic = publicPaths.includes(pathname);

  useEffect(() => {
    if (!loading) {
      if (errors && Object.keys(errors).length > 0) {
        setShowError("Authentication error. Please try again.");
      } else if (!user && !isPublic) {
        router.replace(redirectPath);
      }
    }
  }, [user, loading, errors, router, redirectPath, isPublic]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-600">
        Loading user...
      </div>
    );

  if (showError)
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        {showError}
      </div>
    );
  if (isPublic || user) {
    return <>{children}</>;
  }

  return null;
}
