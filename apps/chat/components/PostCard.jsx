import Link from "next/link";
import { MessageCircle, Share2 } from "lucide-react";
import Avatar from "./Avatar";
import LikeButton from "./LikeButton";
import PostMenu from "./PostMenu";
import { formatRelativeTime } from "@/lib/utils";

export default function PostCard({ post, currentUserId, likeCount = 0, replyCount = 0, detail = false }) {
  const author = post.users || {};
  const time = formatRelativeTime(post.created_at);
  const isOwner = currentUserId && currentUserId === post.author_id;

  const wrapperClass = detail
    ? "px-4 py-4"
    : "border-b border-[#00ffff]/10 px-4 py-4 hover:bg-white/[0.02] transition-colors block";

  const inner = (
    <div className="flex gap-3">
      <Link href={"/profile/" + (author.username || "")} className="shrink-0" onClick={(e) => e.stopPropagation()}>
        <Avatar url={author.avatar_url} username={author.username} size={44} />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <Link
            href={"/profile/" + (author.username || "")}
            onClick={(e) => e.stopPropagation()}
            className="text-warm font-bold text-sm hover:underline"
          >
            {author.username || "unknown"}
          </Link>
          <span className="text-warm-mute text-sm">@{author.username || "unknown"}</span>
          <span className="text-warm-mute text-sm">·</span>
          <span className="text-warm-mute text-sm">{time}</span>

          <div className="ml-auto">
            <PostMenu postId={post.id} isOwner={isOwner} />
          </div>
        </div>

        <div className="text-warm text-base whitespace-pre-wrap break-words mb-3">
          {post.content}
        </div>

        {post.image_url && (
          <div className="rounded-2xl overflow-hidden border border-[#00ffff]/10 mb-3">
            <img src={post.image_url} alt="" className="w-full h-auto" />
          </div>
        )}

        <div className="flex items-center gap-8 text-warm-mute">
          <Link
            href={"/post/" + post.id}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 hover:text-[#00ffff] transition-colors text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{replyCount}</span>
          </Link>

          <LikeButton postId={post.id} initialCount={likeCount} />

          <button className="flex items-center gap-2 hover:text-[#00ffff] transition-colors text-sm">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (detail) {
    return <article className={wrapperClass}>{inner}</article>;
  }

  return (
    <Link href={"/post/" + post.id} className={wrapperClass}>
      {inner}
    </Link>
  );
}
