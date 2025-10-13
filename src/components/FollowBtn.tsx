"use client";
import React from "react";
import { followUser, unfollowUser } from "@/firebase/firestoreUser";
import { useUser } from "@/components/UserContext";
import { UserTypes } from "@/types/types";

interface FollowBtnProps {
  profileUser: UserTypes;
}

export default function FollowBtn({ profileUser }: FollowBtnProps) {
  const { user, setUser } = useUser();

  if (!user || user.id === profileUser.id) return null;

  const isFollowing = user.following?.includes(profileUser.id);

  const handleFollowToggle = async () => {
    if (!user?.id || !profileUser?.id) return;

    try {
      if (isFollowing) {
        await unfollowUser(user.id, profileUser.id);
        setUser((prev) =>
          prev
            ? {
                ...prev,
                following: prev.following.filter((f) => f !== profileUser.id),
              }
            : prev,
        );
      } else {
        await followUser(user.id, profileUser.id);
        setUser((prev) =>
          prev
            ? {
                ...prev,
                following: [...(prev.following ?? []), profileUser.id],
              }
            : prev,
        );
      }
    } catch (err) {
      console.error("Error in follow/unfollow:", err);
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      className="mt-2 px-4 py-1 rounded-md text-sm font-medium border bg-[var(--primary)] hover:bg-[var(--hover-primary)] text-[var(--foreground)] cursor-pointer"
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
