import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import SignOutButton from "@/components/SignOutButton";

export default async function FeedPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-label mb-2">SPV Chat</div>
            <h1 className="display-lg gradient-text">Feed</h1>
          </div>
          <SignOutButton />
        </div>

        <div className="glass p-6 mb-6">
          <div className="text-label mb-3">Signed in as</div>
          <div className="text-mono text-sm text-warm break-all">{user.email}</div>
          <div className="text-mono text-xs text-warm-dim mt-2 break-all">ID: {user.id}</div>
        </div>

        <div className="glass p-6">
          <div className="text-warm text-sm">Level 6 complete. You are authenticated.</div>
          <div className="text-warm-dim text-xs mt-2">
            Level 7 adds profile setup. Level 9 adds the real feed.
          </div>
        </div>
      </div>
    </div>
  );
}
