import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import PostCard from "@/components/feed/PostCard";
import ReplyForm from "@/components/ReplyForm";
import PageHeader from "@/components/ui/PageHeader";
import { getLikeCount } from "@/lib/likes";
import { getReplies } from "@/lib/replies";

export default async function PostDetailPage({ params }) {
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

  const { data: post } = await supabase
    .from("posts")
    .select(`
      id, content, image_url, created_at, author_id,
      users:author_id ( id, username, avatar_url )
    `)
    .eq("id", params.id)
    .maybeSingle();

  if (!post) notFound();

  const likeCount = await getLikeCount(post.id);
  const { replies } = await getReplies(post.id);

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Post" backHref="/feed" />

      <div className="border-b border-[#00ffff]/10">
        <PostCard
          post={post}
          currentUserId={user.id}
          likeCount={likeCount}
          replyCount={replies.length}
          detail
        />
      </div>

      <ReplyForm postId={post.id} profile={profile} />

      {replies.length === 0 ? (
        <div className="px-6 py-12 text-center text-warm-dim text-sm">
          No replies yet. Be the first to reply.
        </div>
      ) : (
        <div>
          {replies.map((reply) => (
            <PostCard
              key={reply.id}
              post={reply}
              currentUserId={user.id}
              detail
            />
          ))}
        </div>
      )}
    </div>
  );
}
