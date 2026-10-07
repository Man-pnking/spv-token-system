import PostCard from "./PostCard";

type Post = {
  id: string;
  content: string;
  image_url?: string | null;
  created_at: string;
  author_id: string;
  users?: {
    id?: string;
    username?: string;
    avatar_url?: string | null;
  } | null;
};

type Props = {
  posts: Post[];
  currentUserId: string;
  likeCounts?: Record<string, number>;
  replyCounts?: Record<string, number>;
  emptyMessage?: string;
};

export function Feed({
  posts,
  currentUserId,
  likeCounts = {},
  replyCounts = {},
  emptyMessage,
}: Props) {
  if (!posts || posts.length === 0) {
    return (
      <div className="px-6 py-20 text-center animate-fade-up">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-[#00ffff]/20 to-[#ff8c00]/10 border border-[#00ffff]/20 flex items-center justify-center">
          <span className="text-2xl">✨</span>
        </div>
        <div className="text-warm text-base font-semibold mb-1">
          No posts yet
        </div>
        <div className="text-warm-dim text-sm">
          {emptyMessage || "Be the first to post."}
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/5">
      {posts.map((post, i) => (
        <div
          key={post.id}
          className="animate-fade-up"
          style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
        >
          <PostCard
            post={post}
            currentUserId={currentUserId}
            likeCount={likeCounts[post.id] || 0}
            replyCount={replyCounts[post.id] || 0}
          />
        </div>
      ))}
    </div>
  );
}

export default Feed;
