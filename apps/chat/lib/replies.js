import { supabase } from "./supabase";

export async function getReplies(postId) {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id, content, image_url, created_at, author_id,
      users:author_id ( id, username, avatar_url )
    `)
    .eq("parent_id", postId)
    .order("created_at", { ascending: true });

  return { replies: data || [], error };
}

export async function createReply(postId, content) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { reply: null, error: new Error("Not authenticated") };

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      content,
      parent_id: postId,
    })
    .select(`
      id, content, image_url, created_at, author_id,
      users:author_id ( id, username, avatar_url )
    `)
    .single();

  return { reply: data, error };
}

export async function getReplyCountsForPosts(postIds) {
  if (!postIds || postIds.length === 0) return {};

  const { data } = await supabase
    .from("posts")
    .select("parent_id")
    .in("parent_id", postIds);

  const counts = {};
  for (const row of data || []) {
    counts[row.parent_id] = (counts[row.parent_id] || 0) + 1;
  }
  return counts;
}
