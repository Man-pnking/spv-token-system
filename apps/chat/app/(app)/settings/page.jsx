import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import ProfileForm from "@/components/ProfileForm";
import SignOutButton from "@/components/SignOutButton";

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/profile/setup");

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href={"/profile/" + profile.username} className="text-label hover:text-[#00ffff]">
            ← Back to profile
          </Link>
          <SignOutButton />
        </div>

        <h1 className="display-lg gradient-text mb-8">Settings</h1>

        <div className="glass p-6">
          <ProfileForm existing={profile} />
        </div>

        <div className="glass p-6 mt-6">
          <div className="text-label mb-2">Email</div>
          <div className="text-mono text-sm text-warm-dim">{user.email}</div>
        </div>
      </div>
    </div>
  );
}
