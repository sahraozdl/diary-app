import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "./config"; // make sure your config exports `db`

// FOLLOW user
export const followUser = async (currentUserId: string, targetUserId: string) => {
  const currentRef = doc(db, "users", currentUserId);
  const targetRef = doc(db, "users", targetUserId);

  await updateDoc(currentRef, {
    following: arrayUnion(targetUserId),
  });

  await updateDoc(targetRef, {
    followers: arrayUnion(currentUserId),
  });
};

// UNFOLLOW user
export const unfollowUser = async (currentUserId: string, targetUserId: string) => {
  const currentRef = doc(db, "users", currentUserId);
  const targetRef = doc(db, "users", targetUserId);

  await updateDoc(currentRef, {
    following: arrayRemove(targetUserId),
  });

  await updateDoc(targetRef, {
    followers: arrayRemove(currentUserId),
  });
};