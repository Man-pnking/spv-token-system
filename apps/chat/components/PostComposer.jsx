"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/posts";
import Avatar from "./Avatar";

const MAX = 500;

export default function PostComposer({ profile }) {
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
      const { error } = await createPost(content.trim());
      if (error) throw error;
      setContent("");
      router.refresh();
    } catch (err) {
      setError(err.message || "Failed to post");
    } finally {
      setPosting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-b border-[#00ffff]/10 px-4 py-4">
      <div className="flex gap-3">
        <Avatar url={profile?.avatar_url} username={profile?.username} size={44} />
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            rows={3}
            maxLength={MAX + 50}
            className="w-full bg-transparent text-warm text-lg outline-none placeholder:text-warm-mute resize-none py-2"
          />

          {error && (
            <div className="text-xs text-red-400 mb-2">{error}</div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-[#00ffff]/10">
            <div className={`text-xs font-mono ${remaining < 0 ? "text-red-400" : remaining < 50 ? "text-[#ff8c00]" : "text-warm-mute"}`}>
              {remaining}
            </div>

            <button
              type="submit"
              disabled={!canPost}
              className="btn-gold text-sm font-semibold disabled:opacity-40 px-5 py-2"
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
