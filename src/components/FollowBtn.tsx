"use client";
import React, { useState, useEffect } from "react";
import { followUser, unfollowUser } from "@/firebase/firestoreUser";
import { UserTypes } from "@/types/types";
import { useUser } from "@/components/UserContext";

interface FollowBtnProps {
  profileUser: UserTypes;
  setProfileUser: React.Dispatch<React.SetStateAction<UserTypes | null>>;
  isInitiallyFollowing?: boolean;
}

export default function FollowBtn({
  profileUser,
  setProfileUser,
  isInitiallyFollowing,
}: FollowBtnProps) {
  const { user, setUser } = useUser();
  const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing ?? false);

  useEffect(() => {
    if (user && profileUser && isInitiallyFollowing === undefined) {
      setIsFollowing(profileUser.followers?.includes(user.id) || false);
    }
  }, [user, profileUser, isInitiallyFollowing]);

  const handleFollowToggle = async () => {
    if (!user?.id || !profileUser?.id) return;

    try {
      if (isFollowing) {
        await unfollowUser(user.id, profileUser.id);

        setIsFollowing(false);

        setProfileUser((prev) =>
          prev
            ? {
                ...prev,
                followers: (prev.followers ?? []).filter(
                  (f): f is string => !!f && f !== user.id,
                ),
              }
            : prev,
        );

        setUser((prev) =>
          prev
            ? {
                ...prev,
                following: (prev.following ?? []).filter(
                  (f): f is string => !!f && f !== profileUser.id,
                ),
              }
            : prev,
        );
      } else {
        await followUser(user.id, profileUser.id);

        setIsFollowing(true);

        setProfileUser((prev) =>
          prev
            ? {
                ...prev,
                followers: [
                  ...(prev.followers?.filter(Boolean) ?? []),
                  user.id,
                ],
              }
            : prev,
        );

        setUser((prev) =>
          prev
            ? {
                ...prev,
                following: [
                  ...(prev.following?.filter(Boolean) ?? []),
                  profileUser.id,
                ],
              }
            : prev,
        );
      }
    } catch (error) {
      console.error("Error in follow/unfollow:", error);
    }
  };

  if (!user || user.id === profileUser.id) return null;

  return (
    <button
      onClick={handleFollowToggle}
      className="mt-2 px-4 py-1 rounded-md text-sm font-medium border bg-[var(--primary)] hover:bg-[var(--hover-primary)] text-[var(--foreground)] cursor-pointer"
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
