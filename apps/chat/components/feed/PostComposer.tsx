"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { createPost } from "@/lib/posts";
import Avatar from "../Avatar";

const MAX = 500;

type Profile = {
  avatar_url?: string | null;
  username?: string;
};

type Props = {
  profile?: Profile;
};

export function PostComposer({ profile }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (expanded) textareaRef.current?.focus();
  }, [expanded]);

  const remaining = MAX - content.length;
  const canPost = content.trim().length > 0 && remaining >= 0 && !posting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPost) return;

    setPosting(true);
    setError(null);

    try {
      const { error } = await createPost(content.trim());
      if (error) throw error;
      setContent("");
      setExpanded(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post");
    } finally {
      setPosting(false);
    }
  };

  const cancel = () => {
    setContent("");
    setExpanded(false);
    setError(null);
  };

  // Collapsed state
  if (!expanded) {
    return (
      <div className="border-b border-[#00ffff]/10 px-4 py-3">
        <button
          onClick={() => setExpanded(true)}
          className="w-full flex items-center gap-3 text-left group"
        >
          <Avatar url={profile?.avatar_url} username={profile?.username} size={40} />
          <div className="flex-1 px-4 py-2.5 rounded-bubble bg-white/[0.03] border border-white/5 text-warm-mute text-sm transition-all group-hover:border-[#00ffff]/30 group-hover:bg-white/[0.05]">
            What&apos;s happening?
          </div>
        </button>
      </div>
    );
  }

  // Expanded state
  return (
    <form
      onSubmit={handleSubmit}
      className="border-b border-[#00ffff]/10 px-4 py-4 animate-fade-up"
    >
      <div className="flex gap-3">
        <Avatar url={profile?.avatar_url} username={profile?.username} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="text-xs text-warm-mute font-mono">
              @{profile?.username || "you"}
            </div>
            <button
              type="button"
              onClick={cancel}
              aria-label="Close composer"
              className="p-1 rounded-full text-warm-mute hover:text-warm hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            rows={3}
            maxLength={MAX + 50}
            className="w-full bg-transparent text-warm text-lg outline-none placeholder:text-warm-mute resize-none py-2"
          />

          {error && <div className="text-xs text-red-400 mb-2">{error}</div>}

          <div className="flex items-center justify-between pt-3 border-t border-[#00ffff]/10">
            <div className="flex items-center gap-2">
              <div
                className={
                  "text-xs font-mono " +
                  (remaining < 0
                    ? "text-red-400"
                    : remaining < 50
                    ? "text-[#ff8c00]"
                    : "text-warm-mute")
                }
              >
                {remaining}
              </div>
              {remaining < 0 && (
                <div className="text-[10px] text-red-400">Too long</div>
              )}
            </div>

            <button
              type="submit"
              disabled={!canPost}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all bg-gradient-to-br from-[#00ffff] to-[#00a8a8] text-[#050510] shadow-[0_4px_20px_rgba(0,255,255,0.25)] hover:shadow-[0_6px_28px_rgba(0,255,255,0.45)] hover:-translate-y-px disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0"
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PostComposer;
