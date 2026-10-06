import Link from "next/link";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Avatar from "./Avatar";
import { formatRelativeTime } from "@/lib/utils";

export default function PostCard({ post }) {
  const author = post.users || {};
  const time = formatRelativeTime(post.created_at);

  return (
    <article className="border-b border-[#00ffff]/10 px-4 py-4 hover:bg-white/[0.02] transition-colors">
      <div className="flex gap-3">
        <Link href={"/profile/" + (author.username || "")} className="shrink-0">
          <Avatar url={author.avatar_url} username={author.username} size={44} />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
            <Link
              href={"/profile/" + (author.username || "")}
              className="text-warm font-bold text-sm hover:underline"
            >
              {author.username || "unknown"}
            </Link>
            <span className="text-warm-mute text-sm">@{author.username || "unknown"}</span>
            <span className="text-warm-mute text-sm">·</span>
            <span className="text-warm-mute text-sm">{time}</span>
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
            <button className="flex items-center gap-2 hover:text-[#00ffff] transition-colors text-sm">
              <MessageCircle className="w-4 h-4" />
              <span>0</span>
            </button>
            <button className="flex items-center gap-2 hover:text-[#ff8c00] transition-colors text-sm">
              <Heart className="w-4 h-4" />
              <span>0</span>
            </button>
            <button className="flex items-center gap-2 hover:text-[#00ffff] transition-colors text-sm">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
