"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { followUser, unfollowUser, isFollowing } from "@/lib/follows";

export default function FollowButton({ targetUserId }) {
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
      const { following } = await isFollowing(user.id, targetUserId);
      if (mounted) {
        setFollowing(following);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [targetUserId]);

  const toggle = async () => {
    if (!currentUserId || pending) return;
    setPending(true);
    try {
      if (following) {
        await unfollowUser(currentUserId, targetUserId);
        setFollowing(false);
      } else {
        await followUser(currentUserId, targetUserId);
        setFollowing(true);
      }
    } finally {
      setPending(false);
    }
  };

  if (loading) {
    return <div className="h-9 w-24 rounded-full bg-white/5 animate-pulse" />;
  }

  if (!currentUserId) return null;

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={
        following
          ? "glass-button text-sm font-semibold disabled:opacity-50"
          : "btn-gold text-sm font-semibold disabled:opacity-50"
      }
    >
      {pending ? "..." : following ? "Following" : "Follow"}
    </button>
  );
}
