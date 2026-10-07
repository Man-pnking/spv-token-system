import { MapPin, Link as LinkIcon, Calendar } from "lucide-react";

type Profile = {
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  created_at?: string;
};

type Props = {
  profile: Profile;
};

export function ProfileAbout({ profile }: Props) {
  const hasContent =
    profile.bio || profile.location || profile.website || profile.created_at;

  if (!hasContent) return null;

  const joined = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="px-5 md:px-6 py-5">
      {profile.bio && (
        <p className="text-sm text-warm leading-relaxed whitespace-pre-wrap mb-4">
          {profile.bio}
        </p>
      )}

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-warm-dim">
        {profile.location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-warm-mute shrink-0" />
            <span>{profile.location}</span>
          </div>
        )}

        {profile.website && (
          <div className="flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-warm-mute shrink-0" />
            <a
              href={
                profile.website.startsWith("http")
                  ? profile.website
                  : `https://${profile.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00ffff] hover:underline truncate max-w-[200px]"
            >
              {profile.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}

        {joined && (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-warm-mute shrink-0" />
            <span>Joined {joined}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileAbout;
