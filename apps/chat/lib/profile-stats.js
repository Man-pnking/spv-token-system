import { supabase } from "./supabase";

export async function getProfileStats(userId) {
  const [
    { count: tweets },
    { count: following },
    { count: followers },
    { count: likes },
  ] = await Promise.all([
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("author_id", userId)
      .is("parent_id", null),
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", userId),
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", userId),
    supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  return {
    tweets: tweets ?? 0,
    following: following ?? 0,
    followers: followers ?? 0,
    likes: likes ?? 0,
  };
}

export async function getFollowedByPreview(viewerId, targetId) {
  if (viewerId === targetId) return null;

  const { data } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("following_id", targetId)
    .neq("follower_id", viewerId)
    .limit(20);

  if (!data || data.length === 0) return null;

  const ids = data.map((r) => r.follower_id);

  const { data: mutuals } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", viewerId)
    .in("following_id", ids);

  if (!mutuals || mutuals.length === 0) return null;

  const mutualId = mutuals[0].following_id;

  const { data: user } = await supabase
    .from("users")
    .select("username")
    .eq("id", mutualId)
    .maybeSingle();

  if (!user) return null;

  return {
    username: user.username,
    count: mutuals.length,
  };
}
