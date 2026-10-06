"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createReply } from "@/lib/replies";
import Avatar from "./Avatar";

const MAX = 500;

export default function ReplyForm({ postId, profile }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);

  const remaining = MAX - content.length;
  const canPost = content.trim().length > 0 && remaining >= 0 && !posting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canPost) return;

    setPosting(true);
    setError(null);

    try {
      const { error } = await createReply(postId, content.trim());
      if (error) throw error;
      setContent("");
      router.refresh();
    } catch (err) {
      setError(err.message || "Failed to reply");
    } finally {
      setPosting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-b border-[#00ffff]/10 px-4 py-4">
      <div className="flex gap-3">
        <Avatar url={profile?.avatar_url} username={profile?.username} size={40} />
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Post your reply"
            rows={2}
            maxLength={MAX + 50}
            className="w-full bg-transparent text-warm outline-none placeholder:text-warm-mute resize-none py-2"
          />

          {error && <div className="text-xs text-red-400 mb-2">{error}</div>}

          <div className="flex items-center justify-between pt-2 border-t border-[#00ffff]/10">
            <div className={"text-xs font-mono " + (remaining < 0 ? "text-red-400" : "text-warm-mute")}>
              {remaining}
            </div>
            <button
              type="submit"
              disabled={!canPost}
              className="btn-gold text-sm font-semibold disabled:opacity-40 px-4 py-1.5"
            >
              {posting ? "..." : "Reply"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
