import Link from "next/link";
import { ArrowLeft, Share2, MoreHorizontal } from "lucide-react";
import Avatar from "./Avatar";
import ProfileActions from "./ProfileActions";
import ProfileStatsRow from "./ProfileStatsRow";
import ProfileAbout from "./ProfileAbout";
import { gradientForUsername } from "@/lib/colors";

export default function ProfileMobileCard({ profile, isMe, counts }) {
  const gradient = gradientForUsername(profile.username);

  return (
    <div className="md:hidden">
      <div className="relative h-40" style={{ background: gradient }}>
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
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

        <div className="absolute -bottom-10 left-5">
          <div className="rounded-full p-1 bg-[#050510]">
            <Avatar url={profile.avatar_url} username={profile.username} size={80} />
          </div>
        </div>
      </div>

      <div className="px-5 pt-14 pb-4">
        <h1 className="text-xl font-bold text-warm">{profile.username}</h1>
        <div className="text-sm text-warm-mute mt-1">@{profile.username}</div>
      </div>

      <div className="px-5 pb-5">
        <ProfileStatsRow stats={counts} />
      </div>

      <div className="px-5 pb-6">
        {isMe ? (
          <Link
            href="/settings"
            className="block w-full text-center px-4 py-2.5 rounded-full bg-white text-black text-sm font-semibold"
          >
            Edit profile
          </Link>
        ) : (
          <ProfileActions targetUser={profile} />
        )}
      </div>

      <div className="border-t border-dashed border-white/10 mx-5" />

      <ProfileAbout profile={profile} />
    </div>
  );
}
