import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import PostComposer from "@/components/PostComposer";
import Feed from "@/components/Feed";

export default async function FeedPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/profile/setup");

  const { data: posts } = await supabase
    .from("posts")
    .select(`
      id, content, image_url, created_at, author_id,
      users:author_id ( id, username, avatar_url )
    `)
    .is("parent_id", null)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-[#00ffff]/10"
        style={{ background: "rgba(5, 5, 16, 0.92)" }}>
        <div className="px-4 py-3">
          <h1 className="text-warm font-bold text-lg">Home</h1>
        </div>
      </div>

      <PostComposer profile={profile} />
      <Feed posts={posts || []} emptyMessage="Be the first to post." />
    </div>
  );
}
