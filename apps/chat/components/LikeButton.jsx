"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { likePost, unlikePost, hasLiked } from "@/lib/likes";

export default function LikeButton({ postId, initialCount = 0, initialLiked = false }) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    hasLiked(postId).then(({ liked }) => {
      if (mounted) {
        setLiked(liked);
        setReady(true);
      }
    });
    return () => { mounted = false; };
  }, [postId]);

  const toggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;

    setPending(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setCount((c) => wasLiked ? Math.max(0, c - 1) : c + 1);

    try {
      if (wasLiked) {
        const { error } = await unlikePost(postId);
        if (error) throw error;
      } else {
        const { error } = await likePost(postId);
        if (error) throw error;
      }
    } catch {
      setLiked(wasLiked);
      setCount((c) => wasLiked ? c + 1 : Math.max(0, c - 1));
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
      className={
        "flex items-center gap-2 transition-colors text-sm " +
        (active ? "text-red-500" : "text-warm-mute hover:text-red-500")
      }
    >
      <Heart className={"w-4 h-4 " + (active ? "fill-current" : "")} />
      <span>{count}</span>
    </button>
  );
}
