import PostCard from "./PostCard";

export default function Feed({ posts, emptyMessage }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <div className="text-warm text-lg mb-2">No posts yet</div>
        <div className="text-warm-dim text-sm">
          {emptyMessage || "Be the first to post."}
        </div>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
