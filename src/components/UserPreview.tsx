"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { UserTypes } from "@/types/types";
import FollowBtn from "@/components/FollowBtn";
import { useUser } from "@/components/UserContext";

interface UserPreviewProps {
  initialUser: UserTypes;
  showFollowButton?: boolean;
}

export default function UserPreview({
  initialUser,
  showFollowButton = true,
}: UserPreviewProps) {
  const [profileUser, setProfileUser] = useState<UserTypes | null>(initialUser);
  const { user } = useUser();
  const isFollowing = useMemo(() => {
    if (!user || !user.following) return false;
    return user.following.includes(initialUser.id);
  }, [user, initialUser.id]);

  if (!profileUser) return null;

  return (
    <div className="flex items-center justify-between p-2 hover:bg-[var(--background-hover)] transition-colors border-b border-[var(--foreground)]">
      <Link
        href={`/profile/${profileUser.id}`}
        className="flex items-center gap-3 flex-1"
      >
        <Image
          src={profileUser.photoURL || "/avatars/default.png"}
          alt={`${profileUser.name || "User"}'s avatar`}
          width={48}
          height={48}
          className="rounded-full object-cover w-12 h-12"
        />
        <div>
          <p className="text-[var(--foreground)] font-medium">
            {profileUser.name || "Unnamed User"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {profileUser.email}
          </p>
        </div>
      </Link>

      {showFollowButton && (
        <FollowBtn
          profileUser={profileUser}
          setProfileUser={setProfileUser}
          isInitiallyFollowing={isFollowing}
        />
      )}
    </div>
  );
}
