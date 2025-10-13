import { db } from "./config";
import { getDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { UserTypes } from "@/types/types";

export async function createUserDocIfNotExists(user: UserTypes, name?: string) {
  if (!user.id) return;

  const userRef = doc(db, "users", user.id);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      id: user.id,
      email: user.email,
      name: name || user.name || "Anonymous",
      photoURL: user.photoURL || "",
      writes: [],
      writesCount: 0,
      createdAt: serverTimestamp(),
      following: [],
      followers: [],
    });
  }
}
