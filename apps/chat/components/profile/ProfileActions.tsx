"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UserPlus, UserCheck, MessageCircle, Bookmark } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { followUser, unfollowUser, isFollowing } from "@/lib/follows";

type TargetUser = {
  id: string;
  username: string;
};

type Props = {
  targetUser: TargetUser;
};

export function ProfileActions({ targetUser }: Props) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
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
    return () => {
      mounted = false;
    };
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
    return (
      <div className="h-10 w-full bg-white/5 rounded-full animate-pulse" />
    );
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <button
        onClick={toggleFollow}
        disabled={pending}
        className={
          "flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 " +
          (following
            ? "bg-white/5 border border-white/15 text-warm hover:bg-white/10 hover:border-white/25"
            : "bg-gradient-to-br from-[#00ffff] to-[#00a8a8] text-[#050510] shadow-[0_4px_20px_rgba(0,255,255,0.25)] hover:shadow-[0_6px_28px_rgba(0,255,255,0.4)] hover:-translate-y-px")
        }
      >
        {following ? (
          <UserCheck className="w-3.5 h-3.5" />
        ) : (
          <UserPlus className="w-3.5 h-3.5" />
        )}
        {following ? "Following" : "Follow"}
      </button>

      <Link
        href={`/chats/new?to=${targetUser.username}`}
        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full text-xs font-semibold border border-white/15 text-warm hover:bg-white/5 hover:border-white/25 transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        Message
      </Link>

      <button
        aria-label="Save"
        className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/15 text-warm hover:bg-white/5 hover:border-white/25 transition-colors shrink-0"
      >
        <Bookmark className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default ProfileActions;
