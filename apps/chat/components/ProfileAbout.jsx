import { MapPin, Link as LinkIcon } from "lucide-react";

export default function ProfileAbout({ profile }) {
  const hasContent = profile.bio || profile.location || profile.website;

  if (!hasContent) return null;

  return (
    <div className="px-5 py-6">
      <h3 className="text-sm font-bold text-warm mb-4">About</h3>

      {profile.bio && (
        <p className="text-sm text-warm-dim leading-relaxed whitespace-pre-wrap mb-4">
          {profile.bio}
        </p>
      )}

      <div className="space-y-2">
        {profile.location && (
          <div className="flex items-center gap-2 text-sm text-warm-dim">
            <MapPin className="w-4 h-4 text-warm-mute shrink-0" />
            <span>{profile.location}</span>
          </div>
        )}

        {profile.website && (
          <div className="flex items-center gap-2 text-sm">
            <LinkIcon className="w-4 h-4 text-warm-mute shrink-0" />
            <a
              href={profile.website.startsWith("http") ? profile.website : "https://" + profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00ffff] hover:underline truncate"
            >
              {profile.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
