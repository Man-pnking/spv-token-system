import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import Avatar from "@/components/Avatar";

export default async function ExplorePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: users } = await supabase
    .from("users")
    .select("id, username, avatar_url, bio, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="text-label mb-2">Explore</div>
        <h1 className="display-lg gradient-text">People on SPV Chat</h1>
      </div>

      {!users || users.length === 0 ? (
        <div className="px-6 py-16 text-center text-warm-dim text-sm">
          No users yet. Invite someone to join.
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <Link
              key={u.id}
              href={"/profile/" + u.username}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors"
            >
              <Avatar url={u.avatar_url} username={u.username} size={48} />
              <div className="flex-1 min-w-0">
                <div className="text-warm font-semibold truncate">
                  @{u.username}
                </div>
                {u.bio && (
                  <div className="text-warm-mute text-sm truncate">
                    {u.bio}
                  </div>
                )}
              </div>
              <div className="text-warm-mute text-xs">
                {new Date(u.created_at).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
