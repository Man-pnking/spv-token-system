import { supabase } from "./supabase";

export async function followUser(followerId, followingId) {
  const { error } = await supabase
    .from("follows")
    .insert({ follower_id: followerId, following_id: followingId });
  return { error };
}

export async function unfollowUser(followerId, followingId) {
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId);
  return { error };
}

export async function isFollowing(followerId, followingId) {
  const { data, error } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle();
  return { following: !!data, error };
}

export async function getFollowCounts(userId) {
  const [{ count: following }, { count: followers }] = await Promise.all([
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", userId),
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", userId),
  ]);
  return { following: following ?? 0, followers: followers ?? 0 };
}
