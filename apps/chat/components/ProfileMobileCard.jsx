import Link from "next/link";
import { ArrowLeft, MessageCircle, UserPlus, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { supabase } from "@/lib/supabase";
import { followUser, unfollowUser, isFollowing } from "@/lib/follows";
import { gradientForUsername } from "@/lib/colors";

function MobileFollowButton({ targetUserId }) {
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
    return <div className="flex-1 h-12 rounded-full bg-white/5 animate-pulse" />;
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={
        "flex-1 flex items-center justify-center gap-2 h-12 rounded-full font-semibold text-base transition-all disabled:opacity-50 " +
        (following
          ? "bg-white/5 border border-[#00ffff]/20 text-warm"
          : "bg-white text-black hover:bg-white/90")
      }
    >
      {following ? (
        <>
          <UserCheck className="w-5 h-5" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="w-5 h-5" />
          Follow
        </>
      )}
    </button>
  );
}

export default function ProfileMobileCard({ profile, isMe, counts }) {
  const bannerGradient = gradientForUsername(profile.username);

  return (
    <div className="md:hidden px-4 pt-4 pb-6">
      {/* Back link */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/feed" className="p-2 rounded-full hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5 text-warm" />
        </Link>
        <span className="text-warm-mute text-sm">Profile</span>
      </div>

      {/* Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
        {/* Banner */}
        <div className="h-28 w-full" style={{ background: bannerGradient }} />

        {/* White lower body */}
        <div className="relative bg-white px-5 pt-16 pb-5">
          {/* Avatar overlapping */}
          <div
            className="absolute -top-14 left-5 rounded-full p-1"
            style={{ background: "#ffffff" }}
          >
            <div className="rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Avatar url={profile.avatar_url} username={profile.username} size={96} />
            </div>
          </div>

          {/* Name + handle */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-black leading-tight">
              {profile.username}
            </h1>
            <div className="text-gray-500 text-sm">@{profile.username}</div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
              {profile.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm mb-5">
            <div>
              <span className="text-black font-bold">{counts.following}</span>{" "}
              <span className="text-gray-500">Following</span>
            </div>
            <div>
              <span className="text-black font-bold">{counts.followers}</span>{" "}
              <span className="text-gray-500">Followers</span>
            </div>
          </div>

          {/* Action row */}
          <div className="flex items-center gap-3">
            {isMe ? (
              <Link
                href="/settings"
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-full bg-black text-white font-semibold text-base"
              >
                Edit profile
              </Link>
            ) : (
              <>
                <MobileFollowButton targetUserId={profile.id} />
                <Link
                  href={"/chats/new?to=" + profile.username}
                  aria-label="Message"
                  className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-gray-700" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
