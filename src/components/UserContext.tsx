"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/firebase/config";
import { UserTypes } from "@/types/types";

interface IUserContext {
  user: UserTypes | null;
  loading: boolean;
  errors: UserTypes["errors"] | null;
  setError: React.Dispatch<React.SetStateAction<UserTypes["errors"] | null>>;
}

const UserContext = createContext<IUserContext>({
  user: null,
  loading: true,
  errors: null,
  setError: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setError] = useState<UserTypes["errors"] | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email ?? undefined,
            name: firebaseUser.displayName ?? undefined,
            photoURL: firebaseUser.photoURL ?? undefined,
            createdAt: undefined,
            writes: [],
            writesCount: 0,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
        setError(null);
      },
      (firebaseError) => {
        console.error("Firebase auth error:", firebaseError);
        setError({
          email: [firebaseError.message],
          name: undefined,
          password: undefined,
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, errors, setError }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
