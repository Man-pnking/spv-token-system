"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { deletePost } from "@/lib/posts";

export default function PostMenu({ postId, isOwner }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!isOwner) return null;

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this post?")) return;

    setDeleting(true);
    const { error } = await deletePost(postId);
    setDeleting(false);
    if (!error) {
      router.refresh();
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="p-1 rounded-full text-warm-mute hover:text-warm hover:bg-white/5 transition-colors"
        aria-label="Post menu"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-32 glass-strong rounded-lg overflow-hidden z-10">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="w-3 h-3" />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}
