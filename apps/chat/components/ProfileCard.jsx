import Link from "next/link";
import Avatar from "./Avatar";

export default function ProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <div className="glass p-6">
      <div className="flex items-start gap-4">
        <Avatar url={profile.avatar_url} username={profile.username} size={72} />
        <div className="flex-1 min-w-0">
          <h1 className="display-md text-warm truncate">@{profile.username}</h1>
          {profile.bio && (
            <p className="text-warm-dim text-sm mt-2">{profile.bio}</p>
          )}
          <div className="text-[10px] text-warm-mute mt-3">
            Joined {new Date(profile.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
