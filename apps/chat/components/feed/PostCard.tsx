"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle, Share2 } from "lucide-react";
import Avatar from "../Avatar";
import LikeButton from "./LikeButton";
import PostMenu from "./PostMenu";
import { formatRelativeTime } from "@/lib/utils";

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
  post: Post;
  currentUserId?: string;
  likeCount?: number;
  replyCount?: number;
  detail?: boolean;
};

export function PostCard({
  post,
  currentUserId,
  likeCount = 0,
  replyCount = 0,
  detail = false,
}: Props) {
  const router = useRouter();
  const author = post.users || {};
  const time = formatRelativeTime(post.created_at);
  const isOwner = currentUserId && currentUserId === post.author_id;

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCardClick = () => {
    if (!detail) router.push(`/post/${post.id}`);
  };

  const content = (
    <div className="flex gap-3">
      {/* Avatar — links to profile, stops propagation */}
      <Link
        href={`/profile/${author.username ?? ""}`}
        onClick={stop}
        className="shrink-0 group"
      >
        <div className="rounded-full p-0.5 transition-all group-hover:ring-2 group-hover:ring-[#00ffff]/40">
          <Avatar
            url={author.avatar_url}
            username={author.username}
            size={44}
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <Link
            href={`/profile/${author.username ?? ""}`}
            onClick={stop}
            className="text-warm font-bold text-sm hover:text-[#00ffff] transition-colors"
          >
            {author.username || "unknown"}
          </Link>
          <span className="text-warm-mute text-sm">
            @{author.username || "unknown"}
          </span>
          <span className="text-warm-mute text-sm">·</span>
          <Link
            href={`/post/${post.id}`}
            onClick={stop}
            className="text-warm-mute text-xs font-mono hover:text-[#00ffff] transition-colors"
          >
            {time}
          </Link>

          <div className="ml-auto" onClick={stop}>
            <PostMenu postId={post.id} isOwner={!!isOwner} />
          </div>
        </div>

        {/* Content */}
        <div className="text-warm text-[15px] leading-relaxed whitespace-pre-wrap break-words mb-3">
          {post.content}
        </div>

        {/* Image */}
        {post.image_url && (
          <div className="rounded-2xl overflow-hidden border border-[#00ffff]/10 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image_url}
              alt=""
              className="w-full h-auto max-h-[520px] object-cover"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-6 md:gap-8 text-warm-mute">
          <Link
            href={`/post/${post.id}`}
            onClick={stop}
            className="flex items-center gap-2 hover:text-[#00ffff] transition-colors text-xs group"
            aria-label="Replies"
          >
            <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="font-mono">{replyCount}</span>
          </Link>

          <LikeButton postId={post.id} initialCount={likeCount} />

          <button
            onClick={stop}
            className="flex items-center gap-2 hover:text-[#00ffff] transition-colors text-xs"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (detail) {
    return <article className="px-4 py-4">{content}</article>;
  }

  return (
    <article
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !detail) router.push(`/post/${post.id}`);
      }}
      className="border-b border-[#00ffff]/10 px-4 py-4 cursor-pointer transition-all duration-200 hover:bg-white/[0.025] hover:border-[#00ffff]/20"
    >
      {content}
    </article>
  );
}

export default PostCard;
