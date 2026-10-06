import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import Avatar from "./Avatar";
import FollowButton from "./FollowButton";
import { gradientForUsername } from "@/lib/colors";

export default function ProfileDesktopHeader({ profile, isMe, counts }) {
  const joined = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="hidden md:block border-b border-[#00ffff]/10">
      {/* Sticky top row */}
      <div
        className="sticky top-0 z-20 flex items-center gap-4 px-4 py-3 backdrop-blur-xl border-b border-[#00ffff]/10"
        style={{ background: "rgba(5, 5, 16, 0.92)" }}
      >
        <Link href="/feed" className="p-2 rounded-full hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5 text-warm" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="text-warm font-bold truncate">{profile.username}</div>
          <div className="text-warm-mute text-xs">@{profile.username}</div>
        </div>
        {isMe ? (
          <Link href="/settings" className="glass-button text-sm">Edit</Link>
        ) : (
          <FollowButton targetUserId={profile.id} />
        )}
      </div>

      {/* Banner */}
      <div
        className="h-44 lg:h-52 w-full"
        style={{ background: gradientForUsername(profile.username) }}
      />

      {/* Avatar + info */}
      <div className="px-6 pb-6">
        <div className="flex items-end justify-between -mt-16 lg:-mt-20 mb-6">
          <div className="rounded-full p-1" style={{ background: "#050510" }}>
            <Avatar url={profile.avatar_url} username={profile.username} size={128} />
          </div>

          <div className="pb-2 flex items-center gap-2">
            {isMe ? (
              <Link href="/settings" className="glass-button text-sm">Edit profile</Link>
            ) : (
              <>
                <Link
                  href={"/chats/new?to=" + profile.username}
                  className="glass-button text-sm"
                  aria-label="Message"
                >
                  Message
                </Link>
                <FollowButton targetUserId={profile.id} />
              </>
            )}
          </div>
        </div>

        <div className="mb-3">
          <h1 className="text-2xl font-bold text-warm">{profile.username}</h1>
          <div className="text-warm-mute text-sm">@{profile.username}</div>
        </div>

        {profile.bio && (
          <p className="text-warm text-base mb-4 whitespace-pre-wrap max-w-2xl">
            {profile.bio}
          </p>
        )}

        <div className="flex items-center gap-2 text-warm-mute text-sm mb-4">
          <Calendar className="w-4 h-4" />
          <span>Joined {joined}</span>
        </div>

        <div className="flex items-center gap-6 text-base">
          <div>
            <span className="text-warm font-bold">{counts.following}</span>{" "}
            <span className="text-warm-mute">Following</span>
          </div>
          <div>
            <span className="text-warm font-bold">{counts.followers}</span>{" "}
            <span className="text-warm-mute">Followers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
