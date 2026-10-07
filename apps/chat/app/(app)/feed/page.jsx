import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import LayoutSwitch from "@/components/LayoutSwitch";
import PostComposer from "@/components/PostComposer";
import FeedMobile from "@/components/feed/FeedMobile";
import FeedDesktop from "@/components/feed/FeedDesktop";
import { getLikeCountsForPosts } from "@/lib/likes";
import { getReplyCountsForPosts } from "@/lib/replies";

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

  const postIds = (posts || []).map((p) => p.id);
  const likeCounts = await getLikeCountsForPosts(postIds);
  const replyCounts = await getReplyCountsForPosts(postIds);

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="sticky top-0 z-20 backdrop-blur-xl border-b border-white/5"
        style={{ background: "rgba(5, 5, 16, 0.92)" }}
      >
        <div className="px-4 py-3">
          <h1 className="text-warm font-bold text-lg">Home</h1>
        </div>
      </div>

      <PostComposer profile={profile} />

      <LayoutSwitch
        mobile={
          <FeedMobile
            posts={posts || []}
            currentUserId={user.id}
            likeCounts={likeCounts}
            replyCounts={replyCounts}
            emptyMessage="Be the first to post."
          />
        }
        desktop={
          <FeedDesktop
            posts={posts || []}
            currentUserId={user.id}
            likeCounts={likeCounts}
            replyCounts={replyCounts}
            emptyMessage="Be the first to post."
          />
        }
      />
    </div>
  );
}
