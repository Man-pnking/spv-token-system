import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import PostComposer from "@/components/feed/PostComposer";
import Feed from "@/components/feed/Feed";
import PageHeader from "@/components/ui/PageHeader";
import { getLikeCountsForPosts } from "@/lib/likes";
import { getReplyCountsForPosts } from "@/lib/replies";

export default async function FeedPage() {
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
      <PageHeader title="Home" />
      <PostComposer profile={profile} />
      <Feed
        posts={posts || []}
        currentUserId={user.id}
        likeCounts={likeCounts}
        replyCounts={replyCounts}
        emptyMessage="Be the first to post."
      />
    </div>
  );
}
