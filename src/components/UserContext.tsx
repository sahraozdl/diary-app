"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  User as FirebaseUser,
  getIdToken,
} from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { createUserDocIfNotExists } from "@/firebase/auth";
import { UserTypes } from "@/types/types";

export interface AuthErrorTypes {
  email?: string[];
  name?: string[];
  password?: string[];
}

interface IUserContext {
  user: UserTypes | null;
  setUser: React.Dispatch<React.SetStateAction<UserTypes | null>>;
  loading: boolean;
  errors: AuthErrorTypes | null;
  setError: React.Dispatch<React.SetStateAction<AuthErrorTypes | null>>;
  signUp: (
    username: string,
    email: string,
    password: string,
  ) => Promise<{ error?: string } | void>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error?: string } | void>;
  signOutUser: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error?: string } | void>;
  resetPassword: (
    email: string,
  ) => Promise<{ success?: boolean; message?: string } | void>;
}

const UserContext = createContext<IUserContext>({
  user: null,
  setUser: () => {},
  loading: true,
  errors: null,
  setError: () => {},
  signUp: async () => {},
  signIn: async () => {},
  signOutUser: async () => {},
  signInWithGoogle: async () => {},
  resetPassword: async () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setError] = useState<AuthErrorTypes | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const token = await getIdToken(firebaseUser);
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};

          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email ?? undefined,
            name: firebaseUser.displayName ?? userData.name ?? undefined,
            photoURL: firebaseUser.photoURL ?? undefined,
            emailVerified: firebaseUser.emailVerified,
            token,
            providerData: firebaseUser.providerData,
            createdAt: userData.createdAt?.toDate() ?? undefined,
            writes: userData.writes ?? [],
            writesCount: userData.writesCount ?? 0,
            following: userData.following ?? [],
            followers: userData.followers ?? [],
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const signUp = async (username: string, email: string, password: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await createUserDocIfNotExists(
        {
          id: cred.user.uid,
          email: cred.user.email ?? "",
          photoURL: cred.user.photoURL || "",
          following: [],
          followers: [],
          writes: [],
          writesCount: 0,
        },
        username,
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      return { error: message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      return { error: message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await createUserDocIfNotExists({
        id: user.uid,
        email: user.email ?? "",
        photoURL: user.photoURL || "",
        name: user.displayName ?? "",
        following: [],
        followers: [],
        writes: [],
        writesCount: 0,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      return { error: message };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: "Password reset email sent." };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      return { success: false, message };
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        errors,
        setUser,
        setError,
        signUp,
        signIn,
        signOutUser,
        signInWithGoogle,
        resetPassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
