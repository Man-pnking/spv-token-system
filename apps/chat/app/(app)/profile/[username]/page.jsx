import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import ProfileCard from "@/components/ProfileCard";
import SignOutButton from "@/components/SignOutButton";

export default async function ProfilePage({ params }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("username", params.username.toLowerCase())
    .maybeSingle();

  if (!profile) notFound();

  const isMe = user?.id === profile.id;

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/feed" className="text-label hover:text-[#00ffff]">
            ← Back to feed
          </Link>
          <div className="flex items-center gap-2">
            {isMe && (
              <Link href="/settings" className="glass-button text-sm">
                Edit profile
              </Link>
            )}
            <SignOutButton />
          </div>
        </div>

        <ProfileCard profile={profile} />

        <div className="glass p-6 mt-6">
          <div className="text-label mb-3">Posts</div>
          <div className="text-warm-dim text-sm">
            No posts yet. Level 9 adds the real feed.
          </div>
        </div>
      </div>
    </div>
  );
}
