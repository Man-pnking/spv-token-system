import PostCard from "../PostCard";

export default function FeedDesktop({ posts, currentUserId, likeCounts = {}, replyCounts = {}, emptyMessage }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <div className="text-warm text-lg mb-2">No posts yet</div>
        <div className="text-warm-dim text-sm">{emptyMessage || "Be the first to post."}</div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/5">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          likeCount={likeCounts[post.id] || 0}
          replyCount={replyCounts[post.id] || 0}
        />
      ))}
    </div>
  );
}
