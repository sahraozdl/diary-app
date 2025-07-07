import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { collection, getDocs, query, where, QueryDocumentSnapshot, DocumentData, orderBy, getDoc } from "firebase/firestore";
import { db } from "./config";
import { EntryType } from "@/types/types";
import { UserTypes } from "@/types/types";

export const followUser = async (currentUserId: string, targetUserId: string) => {
  const currentRef = doc(db, "users", currentUserId);
  await updateDoc(currentRef, {
    following: arrayUnion(targetUserId),
  });
};
export const unfollowUser = async (currentUserId: string, targetUserId: string) => {
  const currentRef = doc(db, "users", currentUserId);
  await updateDoc(currentRef, {
    following: arrayRemove(targetUserId),
  });
};

export async function getUserFollowers(userId: string) {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (!userDoc.exists()) return [];
  const data = userDoc.data();
  const followerIds: string[] = data?.followers || [];

  const followers = await Promise.all(
    followerIds.map(async (fid) => {
      const followerDoc = await getDoc(doc(db, "users", fid));
      if (!followerDoc.exists()) return null;
      return { id: fid, ...followerDoc.data() } as UserTypes;
    })
  );
  return followers.filter(Boolean) as UserTypes[];
}

export async function getUserFollowing(userId: string) {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (!userDoc.exists()) return [];
  const data = userDoc.data();
  const followingIds: string[] = data?.following || [];

  const following = await Promise.all(
    followingIds.map(async (fid) => {
      const followedDoc = await getDoc(doc(db, "users", fid));
      if (!followedDoc.exists()) return null;
      return { id: fid, ...followedDoc.data() } as UserTypes;
    })
  );
  return following.filter(Boolean) as UserTypes[];
}

export async function searchUsersByName(queryString: string) {
  const q = query(
    collection(db, "users"),
    where("name", ">=", queryString),
    where("name", "<=", queryString + "\uf8ff")
  );
  const results = await getDocs(q);
  return results.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() }));
}

export async function getUserById(userId: string) {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function getUserEntries(userId: string, visibility?: "public" | "private"): Promise<EntryType[]> {
  let q;

  if (visibility) {
    q = query(
      collection(db, "entries"),
      where("authorId", "==", userId),
      where("visibility", "==", visibility),
      orderBy("createdAt", "desc")
    );
  } else {
    q = query(
      collection(db, "entries"),
      where("authorId", "==", userId),
      orderBy("createdAt", "desc")
    );
  }

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<EntryType, "id">),
  }));
}