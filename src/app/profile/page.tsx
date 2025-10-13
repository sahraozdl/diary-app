"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@/components/UserContext";
import { getUserEntries } from "@/firebase/firestoreEntries";
import { getUserFollowers, getUserFollowing } from "@/firebase/firestoreUser";
import EntryCard from "@/components/EntryCard";
import { EntryType, UserTypes } from "@/types/types";
import UserPreview from "@/components/UserPreview";
import { updateProfile } from "firebase/auth";
import { auth } from "@/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function UserProfilePage() {
  const { user, setUser } = useUser();
  const [entries, setEntries] = useState<EntryType[]>([]);
  const [followers, setFollowers] = useState<UserTypes[]>([]);
  const [following, setFollowing] = useState<UserTypes[]>([]);
  const [activeTab, setActiveTab] = useState("entries");
  const [selectedAvatar, setSelectedAvatar] = useState(
    user?.photoURL || "/avatars/default.png",
  );
  const [isPublic, setIsPublic] = useState(true);
  const [name, setName] = useState(user?.name || "");

  useEffect(() => {
    async function fetchEntries() {
      if (!user?.id) return;
      const data = await getUserEntries(user.id);
      setEntries(data);
    }
    fetchEntries();
  }, [user?.id]);

  useEffect(() => {
    async function fetchFollowersAndFollowing() {
      if (!user?.id) return;
      const followersData = await getUserFollowers(user.id);
      const followingData = await getUserFollowing(user.id);
      setFollowers(followersData);
      setFollowing(followingData);
    }
    fetchFollowersAndFollowing();
  }, [user?.id]);

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // 🔹 Update Firebase Auth profile (displayName & photoURL)
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: selectedAvatar,
        });
      }

      // 🔹 Update Firestore document
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
        name,
        photoURL: selectedAvatar,
        isPublic,
        updatedAt: new Date(),
      });

      // 🔹 Update global context (instant UI update)
      setUser((prev) =>
        prev
          ? {
              ...prev,
              name,
              photoURL: selectedAvatar,
              isPublic,
            }
          : null,
      );

      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert(" Failed to update profile. Please try again.");
    }
  };

  if (!user) return <p className="p-4">Loading your profile...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <Image
          src={selectedAvatar}
          alt="Profile Avatar"
          width={64}
          height={64}
          className="w-16 h-16 rounded-full object-cover border dark:border-gray-600"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.name || user.email}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>
      </div>

      <nav className="flex space-x-4 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
        {["entries", "followers", "following", "settings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-2 pb-1 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-purple-600 text-purple-600 dark:text-purple-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {
              {
                entries: "My Entries",
                followers: `Followers (${followers.length})`,
                following: `Following (${following.length})`,
                settings: "Profile Settings",
              }[tab]
            }
          </button>
        ))}
      </nav>

      {activeTab === "entries" && (
        <section>
          <h2 className="text-xl font-semibold mb-3 dark:text-white">
            All Your Entries
          </h2>
          {entries.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No entries yet.</p>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} showAuthor={false} />
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "followers" && (
        <section>
          <h2 className="text-xl font-semibold mb-3 dark:text-white">
            Followers
          </h2>
          {followers.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No followers yet.
            </p>
          ) : (
            <div className="space-y-2">
              {followers.map((f) => (
                <UserPreview key={f.id} initialUser={f} />
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "following" && (
        <section>
          <h2 className="text-xl font-semibold mb-3 dark:text-white">
            Following
          </h2>
          {following.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              Not following anyone yet.
            </p>
          ) : (
            <div className="space-y-2">
              {following.map((f) => (
                <UserPreview key={f.id} initialUser={f} />
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "settings" && (
        <section>
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Edit Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 mt-1 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Choose Avatar
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((i) => {
                  const avatarUrl = `/avatars/avatar${i}.png`;
                  const isSelected = selectedAvatar === avatarUrl;
                  return (
                    <Image
                      key={i}
                      src={avatarUrl}
                      alt={`Avatar ${i}`}
                      width={56}
                      height={56}
                      onClick={() => handleAvatarSelect(avatarUrl)}
                      className={`w-14 h-14 cursor-pointer rounded-full border ${
                        isSelected
                          ? "ring-2 ring-purple-500"
                          : "hover:ring-2 hover:ring-purple-300"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={() => setIsPublic((prev) => !prev)}
                  className="accent-purple-500"
                />
                Make my profile public
              </label>
            </div>

            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              Save Changes
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
