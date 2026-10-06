import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import PostCard from "@/components/PostCard";
import ReplyForm from "@/components/ReplyForm";
import { getLikeCount } from "@/lib/likes";
import { getReplies } from "@/lib/replies";

export default async function PostDetailPage({ params }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
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
      <div
        className="sticky top-0 z-20 backdrop-blur-xl border-b border-[#00ffff]/10 flex items-center gap-3 px-4 py-3"
        style={{ background: "rgba(5, 5, 16, 0.92)" }}
      >
        <Link href="/feed" className="p-2 rounded-full hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5 text-warm" />
        </Link>
        <h1 className="text-warm font-bold text-lg">Post</h1>
      </div>

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
