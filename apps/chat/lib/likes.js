import { cache } from "react";
import { supabase } from "./supabase";

export async function likePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error("Not authenticated") };

  const { error } = await supabase
    .from("likes")
    .insert({ user_id: user.id, post_id: postId });

  return { error };
}

export async function unlikePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error("Not authenticated") };

  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("user_id", user.id)
    .eq("post_id", postId);

  return { error };
}

export async function hasLiked(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { liked: false };

  const { data } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .maybeSingle();

  return { liked: !!data };
}

export async function getLikeCount(postId) {
  const { count } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  return count || 0;
}

export async function getLikeCountsForPosts(postIds) {
  if (!postIds || postIds.length === 0) return {};

  const { data } = await supabase
    .from("likes")
    .select("post_id")
    .in("post_id", postIds);

  const counts = {};
  for (const row of data || []) {
    counts[row.post_id] = (counts[row.post_id] || 0) + 1;
  }
  return counts;
}

export async function getLikedPostIds(postIds) {
  if (!postIds || postIds.length === 0) return new Set();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("likes")
    .select("post_id")
    .eq("user_id", user.id)
    .in("post_id", postIds);

  return new Set((data || []).map((r) => r.post_id));
}
