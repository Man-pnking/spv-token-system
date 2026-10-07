import Link from "next/link";
import { ArrowLeft, Share2, MoreHorizontal } from "lucide-react";
import Avatar from "./Avatar";
import ProfileActions from "./ProfileActions";
import ProfileStatsRow from "./ProfileStatsRow";
import ProfileAbout from "./ProfileAbout";
import ProfileTabs from "./ProfileTabs";
import Feed from "./Feed";
import { gradientForUsername } from "@/lib/colors";

export default function ProfileDesktopHeader({
  profile,
  isMe,
  stats,
  currentUserId,
  posts,
  likeCounts,
  replyCounts,
}) {
  const gradient = gradientForUsername(profile.username);

  return (
    <div className="hidden md:block max-w-3xl mx-auto border-x border-white/5">
      {/* Banner */}
      <div className="relative h-52" style={{ background: gradient }}>
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
          <Link
            href="/feed"
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </Link>
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4 text-white" />
            </button>
            <button
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center"
              aria-label="More"
            >
              <MoreHorizontal className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <div className="absolute -bottom-14 left-6">
          <div className="rounded-full p-1 bg-[#050510]">
            <Avatar url={profile.avatar_url} username={profile.username} size={112} />
          </div>
        </div>
      </div>

      {/* Name + meta */}
      <div className="px-6 pt-20 pb-5">
        <h1 className="text-2xl font-bold text-warm">{profile.username}</h1>
        <div className="text-sm text-warm-mute mt-1">@{profile.username}</div>
      </div>

      {/* Stats */}
      <div className="px-6 pb-6 max-w-md">
        <ProfileStatsRow stats={stats} />
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 max-w-md">
        {isMe ? (
          <Link
            href="/settings"
            className="block w-full text-center px-4 py-2.5 rounded-full bg-white text-black text-sm font-semibold"
          >
            Edit profile
          </Link>
        ) : (
          <ProfileActions
            targetUserId={profile.id}
            targetUsername={profile.username}
          />
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-white/10 mx-6" />

      {/* About */}
      <ProfileAbout profile={profile} />

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Tabs + Feed */}
      <ProfileTabs />
      <Feed
        posts={posts || []}
        currentUserId={currentUserId}
        likeCounts={likeCounts}
        replyCounts={replyCounts}
        emptyMessage={isMe ? "You haven't posted yet." : "No posts yet."}
      />
    </div>
  );
}
