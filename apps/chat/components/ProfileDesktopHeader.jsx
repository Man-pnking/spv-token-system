import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Avatar from "./Avatar";
import FollowButton from "./FollowButton";
import ProfileLeftColumn from "./ProfileLeftColumn";
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
  return (
    <div className="hidden md:block">
      {/* Top row */}
      <div
        className="sticky top-0 z-20 flex items-center gap-4 px-4 py-3 backdrop-blur-xl border-b border-[#00ffff]/10"
        style={{ background: "rgba(5, 5, 16, 0.92)" }}
      >
        <Link href="/feed" className="p-2 rounded-full hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5 text-warm" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="text-warm font-bold truncate">{profile.username}</div>
          <div className="text-warm-mute text-xs">{stats.tweets} posts</div>
        </div>
        {isMe && (
          <Link href="/settings" className="glass-button text-sm">Edit profile</Link>
        )}
        {!isMe && <FollowButton targetUserId={profile.id} />}
      </div>

      {/* Banner + avatar overlap area */}
      <div className="relative">
        <div
          className="h-40 lg:h-48 w-full"
          style={{ background: gradientForUsername(profile.username) }}
        />

        {/* Avatar — positioned to overlap banner bottom, sits over the left column */}
        <div className="absolute left-5 top-full -translate-y-1/2">
          <div className="rounded-full p-1" style={{ background: "#050510" }}>
            <Avatar url={profile.avatar_url} username={profile.username} size={120} />
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex pt-16">
        <ProfileLeftColumn profile={profile} isMe={isMe} stats={stats} />

        <section className="flex-1 min-w-0">
          <ProfileTabs />
          <Feed
            posts={posts || []}
            currentUserId={currentUserId}
            likeCounts={likeCounts}
            replyCounts={replyCounts}
            emptyMessage={isMe ? "You haven't posted yet." : "No posts yet."}
          />
        </section>
      </div>
    </div>
  );
}
