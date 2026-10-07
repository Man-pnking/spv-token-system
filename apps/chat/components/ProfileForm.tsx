"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkUsernameAvailable, upsertProfile } from "@/lib/profiles";
import { supabase } from "@/lib/supabase";
import AvatarUpload from "./AvatarUpload";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Existing = {
  username?: string;
  bio?: string;
  website?: string;
  location?: string;
  avatar_url?: string | null;
};

type Props = {
  existing?: Existing;
  isSetup?: boolean;
};

export function ProfileForm({ existing, isSetup = false }: Props) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState(existing?.username || "");
  const [bio, setBio] = useState(existing?.bio || "");
  const [website, setWebsite] = useState(existing?.website || "");
  const [location, setLocation] = useState(existing?.location || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    existing?.avatar_url || null
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
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
      setError(err instanceof Error ? err.message : "Save failed");
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

      <Input
        type="text"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value.toLowerCase())}
        required
        disabled={!isSetup && !!existing}
        helper={
          !isSetup && !!existing
            ? "Username can't be changed after setup"
            : "3-20 characters, lowercase, numbers, underscores"
        }
        variant="filled"
      />

      <Textarea
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={3}
        maxLength={160}
        showCount={160}
        placeholder="Tell people about yourself"
        variant="filled"
      />

      <Input
        type="text"
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="City, Country"
        variant="filled"
      />

      <Input
        type="text"
        label="Website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        placeholder="your-site.com"
        variant="filled"
      />

      {error && (
        <div className="text-xs text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <Button type="submit" loading={saving} fullWidth size="lg">
        {saving
          ? "Saving..."
          : isSetup
          ? "Create profile"
          : "Save changes"}
      </Button>
    </form>
  );
}

export default ProfileForm;
