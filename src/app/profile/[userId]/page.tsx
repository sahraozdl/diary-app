"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "@/components/UserContext";
import {
  getUserById,
  getUserEntries,
  followUser,
  unfollowUser,
} from "@/firebase/firestoreUser";
import EntryCard from "@/components/EntryCard";
import { EntryType, UserTypes } from "@/types/types";

export default function ProfilePage() {
  const params = useParams();
  const userId = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId!;
  const { user } = useUser();

  const [profileUser, setProfileUser] = useState<UserTypes | null>(null);
  const [entries, setEntries] = useState<EntryType[]>([]);
  const [activeTab, setActiveTab] = useState<
    "entries" | "followers" | "following"
  >("entries");
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const fetchedUser = await getUserById(userId);
      if (fetchedUser) {
        setProfileUser(fetchedUser);
        const publicEntries = await getUserEntries(userId, "public");
        setEntries(publicEntries);
      }
      setLoading(false);
    }
    fetchData();
  }, [userId]);

  useEffect(() => {
    if (user && profileUser) {
      setIsFollowing(
        user.id ? profileUser.followers?.includes(user.id) || false : false,
      );
    }
  }, [user, profileUser]);

  const handleFollowToggle = async () => {
    if (!user || !profileUser || !user.id || !profileUser.id) return;

    if (isFollowing) {
      await unfollowUser(user.id, profileUser.id);
      setIsFollowing(false);
      setProfileUser((prev) =>
        prev
          ? {
              ...prev,
              followers: prev.followers?.filter((f) => f !== user.id) ?? [],
            }
          : prev,
      );
    } else {
      await followUser(user.id, profileUser.id);
      setIsFollowing(true);
      setProfileUser((prev) =>
        prev && user.id
          ? {
              ...prev,
              followers: [...(prev.followers ?? []), user.id as string],
            }
          : prev,
      );
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!profileUser) return <div className="p-4">User not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-4">
        <Image
          src={profileUser.photoURL || "/default-avatar.png"}
          alt="Profile Avatar"
          width={64}
          height={64}
          className="w-16 h-16 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-xl font-bold">
            {profileUser.name || profileUser.email}
          </h2>
          <p className="text-sm text-gray-500">{profileUser.email}</p>
          {user && user.id !== profileUser.id && (
            <button
              onClick={handleFollowToggle}
              className="mt-2 px-4 py-1 rounded-md text-sm font-medium border bg-white dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-gray-700"
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>

      <div className="flex space-x-6 border-b pb-2 mb-4">
        <button
          onClick={() => setActiveTab("entries")}
          className={`${
            activeTab === "entries"
              ? "text-purple-600 font-semibold"
              : "text-gray-500"
          } hover:text-purple-600`}
        >
          Entries
        </button>
        <button
          onClick={() => setActiveTab("followers")}
          className={`${
            activeTab === "followers"
              ? "text-purple-600 font-semibold"
              : "text-gray-500"
          } hover:text-purple-600`}
        >
          Followers ({profileUser.followers?.length ?? 0})
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`${
            activeTab === "following"
              ? "text-purple-600 font-semibold"
              : "text-gray-500"
          } hover:text-purple-600`}
        >
          Following ({profileUser.following?.length ?? 0})
        </button>
      </div>

      {activeTab === "entries" && (
        <div>
          {entries.length === 0 ? (
            <p>No public entries yet.</p>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} showAuthor={false} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "followers" && (
        <div className="space-y-2">
          {profileUser.followers?.length === 0 ? (
            <p>No followers yet.</p>
          ) : (
            profileUser.followers?.map((id: string) => (
              <Link
                key={id}
                href={`/profile/${id}`}
                className="block text-purple-600 hover:underline"
              >
                {id}
              </Link>
            ))
          )}
        </div>
      )}

      {activeTab === "following" && (
        <div className="space-y-2">
          {profileUser.following?.length === 0 ? (
            <p>Not following anyone yet.</p>
          ) : (
            profileUser.following?.map((id: string) => (
              <Link
                key={id}
                href={`/profile/${id}`}
                className="block text-purple-600 hover:underline"
              >
                {id}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
