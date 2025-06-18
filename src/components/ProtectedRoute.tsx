"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
}

export default function ProtectedRoute({ children, redirectPath = "/" }: ProtectedRouteProps) {
  const { user, loading, errors } = useUser();
  const router = useRouter();
  const [showError, setShowError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (errors && Object.keys(errors).length > 0) {
        setShowError("Authentication error. Please try again.");
      } else if (!user?.email) {
        router.replace(redirectPath);
      }
    }
  }, [user, loading, router, redirectPath, errors]);

  if (loading) return <div>Loading...</div>;
  if (showError) return <div className="text-red-600">{showError}</div>;
  if (!user?.email) return null; // avoid flash while redirecting

  console.log("Dashboard user:", user);

  return <>{children}</>;
}