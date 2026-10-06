import Link from "next/link";
import { Calendar, Link as LinkIcon } from "lucide-react";
import Avatar from "./Avatar";
import FollowButton from "./FollowButton";
import ProfileStatsRow from "./ProfileStatsRow";

export default function ProfileLeftColumn({ profile, isMe, stats }) {
  const joined = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <aside className="hidden md:block w-[280px] lg:w-[320px] shrink-0 border-r border-[#00ffff]/10">
      {/* Avatar overlapping banner handled by parent — this is just the info column */}
      <div className="px-5 pt-4 pb-8">

        {/* Name + handle */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-warm">{profile.username}</h1>
          <div className="text-warm-mute text-sm">@{profile.username}</div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-warm text-sm leading-relaxed mb-4 whitespace-pre-wrap">
            {profile.bio}
          </p>
        )}

        {/* Website */}
        {profile.website && (
          <div className="flex items-center gap-2 text-[#00ffff] text-sm mb-2">
            <LinkIcon className="w-3.5 h-3.5" />
            <a
              href={profile.website.startsWith("http") ? profile.website : "https://" + profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline truncate"
            >
              {profile.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}

        {/* Joined */}
        <div className="flex items-center gap-2 text-warm-mute text-sm mb-5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Joined {joined}</span>
        </div>

        {/* Stats */}
        <div className="mb-5">
          <ProfileStatsRow stats={stats} />
        </div>

        {/* Action */}
        {!isMe && (
          <div className="flex items-center gap-2">
            <FollowButton targetUserId={profile.id} />
          </div>
        )}
      </div>
    </aside>
  );
}
