"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkUsernameAvailable, upsertProfile } from "@/lib/profiles";
import { supabase } from "@/lib/supabase";
import AvatarUpload from "./AvatarUpload";

export default function ProfileForm({ existing, isSetup = false }) {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(existing?.username || "");
  const [bio, setBio] = useState(existing?.bio || "");
  const [website, setWebsite] = useState(existing?.website || "");
  const [location, setLocation] = useState(existing?.location || "");
  const [avatarUrl, setAvatarUrl] = useState(existing?.avatar_url || null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (username.length < 3 || username.length > 20) {
      setError("Username must be 3-20 characters");
      return;
    }
    if (!/^[a-z0-9_]+$/.test(username)) {
      setError("Lowercase letters, numbers, underscores only");
      return;
    }

    setSaving(true);
    try {
      const { available } = await checkUsernameAvailable(username, userId);
      if (!available) throw new Error("Username already taken");

      const { error: saveError } = await upsertProfile({
        username,
        bio,
        website,
        location,
        avatarUrl,
      });
      if (saveError) throw saveError;

      router.push("/profile/" + username.toLowerCase());
      router.refresh();
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {userId && (
        <AvatarUpload
          userId={userId}
          currentUrl={avatarUrl}
          onUploaded={setAvatarUrl}
        />
      )}

      <div>
        <label className="text-xs text-warm-dim block mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          required
          disabled={!isSetup && !!existing}
          className="w-full bg-transparent border-b border-white/15 px-0 py-2 text-sm outline-none focus:border-white/40 transition-colors disabled:opacity-50"
        />
      </div>

      <div>
        <label className="text-xs text-warm-dim block mb-1">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          maxLength={160}
          placeholder="Tell people about yourself"
          className="w-full bg-transparent border border-white/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/40 transition-colors resize-none"
        />
        <div className="text-[10px] text-warm-mute mt-1">{bio.length} / 160</div>
      </div>

      <div>
        <label className="text-xs text-warm-dim block mb-1">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, Country"
          className="w-full bg-transparent border-b border-white/15 px-0 py-2 text-sm outline-none focus:border-white/40 transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-warm-dim block mb-1">Website</label>
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="your-site.com"
          className="w-full bg-transparent border-b border-white/15 px-0 py-2 text-sm outline-none focus:border-white/40 transition-colors"
        />
      </div>

      {error && <div className="text-xs text-red-400">{error}</div>}

      <button
        type="submit"
        disabled={saving}
        className="w-full px-4 py-2.5 rounded-full bg-white text-black text-sm font-semibold disabled:opacity-50"
      >
        {saving ? "Saving..." : isSetup ? "Create profile" : "Save changes"}
      </button>
    </form>
  );
}
