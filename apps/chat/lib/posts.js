import { supabase } from "./supabase";

export async function getFeed({ limit = 50, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id, content, image_url, created_at, author_id,
      users:author_id ( id, username, avatar_url )
    `)
    .is("parent_id", null)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return { posts: data || [], error };
}

export async function getUserPosts(userId, { limit = 50 } = {}) {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id, content, image_url, created_at, author_id,
      users:author_id ( id, username, avatar_url )
    `)
    .eq("author_id", userId)
    .is("parent_id", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { posts: data || [], error };
}

export async function createPost(content) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { post: null, error: new Error("Not authenticated") };

  const { data, error } = await supabase
    .from("posts")
    .insert({ author_id: user.id, content })
    .select(`
      id, content, image_url, created_at, author_id,
      users:author_id ( id, username, avatar_url )
    `)
    .single();

  return { post: data, error };
}

export async function deletePost(postId) {
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  return { error };
}
