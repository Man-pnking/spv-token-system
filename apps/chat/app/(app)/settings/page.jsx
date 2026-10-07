import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import ProfileForm from "@/components/ProfileForm";
import PageHeader from "@/components/ui/PageHeader";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/profile/setup");

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Settings"
        backHref={`/profile/${profile.username}`}
      />

      <div className="px-4 py-6 space-y-6">
        <section>
          <h2 className="text-label mb-3">Profile</h2>
          <div className="glass p-6">
            <ProfileForm existing={profile} />
          </div>
        </section>

        <section>
          <h2 className="text-label mb-3">Account</h2>
          <div className="glass p-6">
            <div className="text-xs text-warm-dim mb-1">Email</div>
            <div className="text-mono text-sm text-warm break-all">
              {user.email}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-label mb-3">Session</h2>
          <div className="glass p-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-sm text-warm">Sign out</div>
              <div className="text-xs text-warm-mute mt-0.5">
                End your session on this device
              </div>
            </div>
            <Link
              href="/sign-in"
              className="px-4 py-2 rounded-full text-xs font-semibold border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
            >
              Sign out
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
