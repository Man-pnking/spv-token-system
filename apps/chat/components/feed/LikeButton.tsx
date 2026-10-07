"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { likePost, unlikePost, hasLiked } from "@/lib/likes";

type Props = {
  postId: string;
  initialCount?: number;
  initialLiked?: boolean;
};

export function LikeButton({
  postId,
  initialCount = 0,
  initialLiked = false,
}: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    let mounted = true;
    hasLiked(postId).then(({ liked }: { liked: boolean }) => {
      if (mounted) {
        setLiked(liked);
        setReady(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, [postId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;

    setPending(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setCount((c) => (wasLiked ? Math.max(0, c - 1) : c + 1));
    if (!wasLiked) {
      setBurst(true);
      setTimeout(() => setBurst(false), 600);
    }

    try {
      const { error } = wasLiked
        ? await unlikePost(postId)
        : await likePost(postId);
      if (error) throw error;
    } catch {
      setLiked(wasLiked);
      setCount((c) => (wasLiked ? c + 1 : Math.max(0, c - 1)));
    } finally {
      setPending(false);
    }
  };

  const active = liked && ready;

  return (
    <button
      onClick={toggle}
      disabled={pending}
      aria-label={active ? "Unlike" : "Like"}
      aria-pressed={active}
      className={
        "relative flex items-center gap-2 transition-colors text-xs group " +
        (active
          ? "text-red-500"
          : "text-warm-mute hover:text-red-500")
      }
    >
      <span className="relative">
        <Heart
          className={
            "w-4 h-4 transition-transform " +
            (active ? "fill-current scale-110" : "group-hover:scale-110")
          }
        />
        {burst && (
          <span className="absolute inset-0 -m-2 rounded-full bg-red-500/40 animate-ping" />
        )}
      </span>
      <span className="font-mono">{count}</span>
    </button>
  );
}

export default LikeButton;
