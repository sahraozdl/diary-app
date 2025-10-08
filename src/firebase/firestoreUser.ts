import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { db } from "./config";
import { EntryType, UserTypes, SearchUser } from "@/types/types";

export const followUser = async (
  currentUserId: string,
  targetUserId: string,
) => {
  const currentRef = doc(db, "users", currentUserId);
  const targetRef = doc(db, "users", targetUserId);

  await updateDoc(currentRef, {
    following: arrayUnion(targetUserId),
  });

  await updateDoc(targetRef, {
    followers: arrayUnion(currentUserId),
  });
};

export const unfollowUser = async (
  currentUserId: string,
  targetUserId: string,
) => {
  const currentRef = doc(db, "users", currentUserId);
  const targetRef = doc(db, "users", targetUserId);

  await updateDoc(currentRef, {
    following: arrayRemove(targetUserId),
  });

  await updateDoc(targetRef, {
    followers: arrayRemove(currentUserId),
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
    }),
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
    }),
  );
  return following.filter(Boolean) as UserTypes[];
}

export async function searchUsersByName(
  queryString: string,
): Promise<SearchUser[]> {
  const snapshot = await getDocs(collection(db, "users"));

  const lowerQuery = queryString.toLowerCase();

  return snapshot.docs
    .map((doc: QueryDocumentSnapshot<DocumentData>): SearchUser => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name ?? undefined,
        email: data.email ?? undefined,
        photoURL: data.photoURL ?? undefined,
      };
    })
    .filter(
      (u) =>
        (u.name?.toLowerCase().includes(lowerQuery) ?? false) ||
        (u.email?.toLowerCase().includes(lowerQuery) ?? false),
    );
}

export async function getUserById(userId: string) {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function getUserEntries(
  userId: string,
  visibility?: "public" | "private",
): Promise<EntryType[]> {
  let q;

  if (visibility) {
    q = query(
      collection(db, "entries"),
      where("authorId", "==", userId),
      where("visibility", "==", visibility),
      orderBy("createdAt", "desc"),
    );
  } else {
    q = query(
      collection(db, "entries"),
      where("authorId", "==", userId),
      orderBy("createdAt", "desc"),
    );
  }

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<EntryType, "id">),
  }));
}
export async function getPublicEntries(): Promise<EntryType[]> {
  try {
    const entriesRef = collection(db, "entries");
    const q = query(
      entriesRef,
      where("visibility", "==", "public"),
      orderBy("createdAt", "desc"),
    );

    const snapshot = await getDocs(q);

    const entries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<EntryType, "id">),
    }));

    return entries;
  } catch (error) {
    console.error("Error fetching public entries:", error);
    return [];
  }
}
