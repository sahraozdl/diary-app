"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  getUserById,
  getUserEntries,
  getUserFollowers,
  getUserFollowing,
} from "@/firebase/firestoreUser";
import EntryCard from "@/components/EntryCard";
import FollowBtn from "@/components/FollowBtn";
import UserPreview from "@/components/UserPreview";
import SkeletonLoader from "@/components/SkeletonLoader";
import { EntryType, UserTypes } from "@/types/types";
import { useUser } from "@/components/UserContext";

export default function ProfilePage() {
  const params = useParams();
  const userId = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId!;
  const { user } = useUser();

  const [profileUser, setProfileUser] = useState<UserTypes | null>(null);
  const [entries, setEntries] = useState<EntryType[]>([]);
  const [followers, setFollowers] = useState<UserTypes[]>([]);
  const [following, setFollowing] = useState<UserTypes[]>([]);
  const [activeTab, setActiveTab] = useState<
    "entries" | "followers" | "following"
  >("entries");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const fetchedUser = await getUserById(userId);
      if (fetchedUser) {
        setProfileUser(fetchedUser as UserTypes);

        const publicEntries = await getUserEntries(userId, "public");
        setEntries(publicEntries);
      }
      setLoading(false);
    }
    fetchData();
  }, [userId]);

  useEffect(() => {
    async function fetchFollowersAndFollowing() {
      if (!userId) return;
      const followersData = await getUserFollowers(userId);
      const followingData = await getUserFollowing(userId);
      setFollowers(followersData);
      setFollowing(followingData);
    }
    fetchFollowersAndFollowing();
  }, [userId]);

  if (!profileUser && !loading)
    return <div className="p-4">User not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {loading ? (
        <div className="flex items-center gap-4 mb-4">
          <SkeletonLoader type="user" count={1} />
        </div>
      ) : (
        <div className="flex items-center gap-4 mb-4">
          <Image
            src={profileUser?.photoURL || "/default-avatar.png"}
            alt="Profile Avatar"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-xl font-bold">
              {profileUser?.name || profileUser?.email}
            </h2>
            <p className="text-sm text-gray-500">{profileUser?.email}</p>
            <FollowBtn
              profileUser={profileUser!}
              setProfileUser={setProfileUser}
            />
          </div>
        </div>
      )}

      <div className="flex space-x-6 border-b-2 pb-2 mb-4">
        <button
          onClick={() => setActiveTab("entries")}
          className={`${activeTab === "entries" ? "text-purple-600 font-semibold" : "text-gray-500"} hover:text-purple-600`}
        >
          Entries
        </button>
        <button
          onClick={() => setActiveTab("followers")}
          className={`${activeTab === "followers" ? "text-purple-600 font-semibold" : "text-gray-500"} hover:text-purple-600`}
        >
          Followers ({profileUser?.followers?.length ?? 0})
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`${activeTab === "following" ? "text-purple-600 font-semibold" : "text-gray-500"} hover:text-purple-600`}
        >
          Following ({profileUser?.following?.length ?? 0})
        </button>
      </div>

      {loading ? (
        <SkeletonLoader
          type={activeTab === "entries" ? "entry" : "user"}
          count={activeTab === "entries" ? 3 : 5}
        />
      ) : (
        <>
          {activeTab === "entries" && (
            <div>
              {entries.length === 0 ? (
                <p>No public entries yet.</p>
              ) : (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <EntryCard
                      key={entry.id}
                      entry={entry}
                      showAuthor={false}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "followers" && (
            <div className="space-y-2">
              {followers.length === 0 ? (
                <p>No followers yet.</p>
              ) : (
                followers.map((follower) => (
                  <UserPreview
                    key={follower.id}
                    initialUser={follower}
                    showFollowButton={user?.id !== follower.id}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === "following" && (
            <div className="space-y-2">
              {following.length === 0 ? (
                <p>Not following anyone yet.</p>
              ) : (
                following.map((followedUser) => (
                  <UserPreview
                    key={followedUser.id}
                    initialUser={followedUser}
                    showFollowButton={user?.id !== followedUser.id}
                  />
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
