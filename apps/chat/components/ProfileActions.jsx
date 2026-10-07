"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UserPlus, UserCheck, MessageCircle, Bookmark } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { followUser, unfollowUser, isFollowing } from "@/lib/follows";

export default function ProfileActions({ targetUser }) {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!mounted) return;
      if (!user) {
        setLoading(false);
        return;
      }
      setCurrentUserId(user.id);
      const { following } = await isFollowing(user.id, targetUser.id);
      if (mounted) {
        setFollowing(following);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [targetUser.id]);

  const toggleFollow = async () => {
    if (!currentUserId || pending) return;
    setPending(true);
    try {
      if (following) {
        await unfollowUser(currentUserId, targetUser.id);
        setFollowing(false);
      } else {
        await followUser(currentUserId, targetUser.id);
        setFollowing(true);
      }
    } finally {
      setPending(false);
    }
  };

  if (loading) {
    return <div className="h-10 w-full bg-white/5 rounded animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <button
        onClick={toggleFollow}
        disabled={pending}
        className={
          "flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors " +
          (following
            ? "bg-white/5 border border-white/15 text-warm hover:bg-white/10"
            : "bg-white text-black hover:bg-white/90")
        }
      >
        {following ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
        {following ? "Following" : "Follow"}
      </button>

      <Link
        href={"/chats/new?to=" + targetUser.username}
        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border border-white/15 text-warm hover:bg-white/5 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        Message
      </Link>

      <button
        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border border-white/15 text-warm hover:bg-white/5 transition-colors"
        aria-label="Save"
      >
        <Bookmark className="w-4 h-4" />
        Save
      </button>
    </div>
  );
}
