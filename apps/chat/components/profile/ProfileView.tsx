import Link from "next/link";
import { ArrowLeft, Share2, MoreHorizontal } from "lucide-react";
import Avatar from "../Avatar";
import ProfileActions from "./ProfileActions";
import ProfileStatsRow from "./ProfileStatsRow";
import ProfileAbout from "./ProfileAbout";
import ProfileTabs from "./ProfileTabs";
import Feed from "../feed/Feed";
import { gradientForUsername } from "@/lib/colors";

type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  created_at?: string;
};

type Post = {
  id: string;
  content: string;
  image_url?: string | null;
  created_at: string;
  author_id: string;
  users?: {
    id?: string;
    username?: string;
    avatar_url?: string | null;
  } | null;
};

type Props = {
  profile: Profile;
  isMe: boolean;
  stats: {
    followers?: number;
    following?: number;
    tweets?: number;
  };
  currentUserId: string;
  posts: Post[];
  likeCounts?: Record<string, number>;
  replyCounts?: Record<string, number>;
};

export function ProfileView({
  profile,
  isMe,
  stats,
  currentUserId,
  posts,
  likeCounts,
  replyCounts,
}: Props) {
  const gradient = gradientForUsername(profile.username);

  return (
    <div className="md:max-w-5xl md:mx-auto">
      {/* Banner */}
      <div
        className="relative h-40 md:h-56"
        style={{ background: gradient }}
      >
        <div className="absolute top-3 left-3 right-3 md:left-4 md:right-4 flex items-center justify-between">
          <Link
            href="/feed"
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center hover:bg-black/60 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </Link>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center hover:bg-black/60 transition-colors">
              <Share2 className="w-4 h-4 text-white" />
            </button>
            <button className="w-9 h-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center hover:bg-black/60 transition-colors">
              <MoreHorizontal className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <div className="absolute -bottom-12 md:-bottom-16 left-5 md:left-8">
          <div className="rounded-full p-1 bg-[#050510]">
            <Avatar
              url={profile.avatar_url}
              username={profile.username}
              size={88}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="md:grid md:grid-cols-[300px_1fr] md:gap-6 md:px-8">
        {/* Left column (info) */}
        <div className="md:pt-6">
          <div className="px-5 md:px-0 pt-16 md:pt-4 pb-4">
            <h1 className="text-xl md:text-2xl font-bold text-warm">
              {profile.username}
            </h1>
            <div className="text-sm text-warm-mute font-mono mt-0.5">
              @{profile.username}
            </div>
          </div>

          <div className="px-5 md:px-0 pb-5">
            <ProfileStatsRow stats={stats} />
          </div>

          <div className="px-5 md:px-0 pb-5">
            {isMe ? (
              <Link
                href="/settings"
                className="block w-full text-center px-4 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                Edit profile
              </Link>
            ) : (
              <ProfileActions targetUser={profile} />
            )}
          </div>

          <div className="px-5 md:px-0">
            <ProfileAbout profile={profile} />
          </div>
        </div>

        {/* Right column (tabs + feed) */}
        <div className="md:pt-6">
          <div className="md:sticky md:top-0 md:z-10 md:backdrop-blur-xl md:bg-[#050510]/60">
            <ProfileTabs />
          </div>
          <Feed
            posts={posts}
            currentUserId={currentUserId}
            likeCounts={likeCounts}
            replyCounts={replyCounts}
            emptyMessage={isMe ? "You haven't posted yet." : "No posts yet."}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
