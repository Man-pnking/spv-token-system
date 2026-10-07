import { supabase } from "./supabase";

export async function searchUsers(query) {
  const q = (query || "").trim().toLowerCase();
  if (q.length < 1) return { users: [], error: null };

  const { data, error } = await supabase
    .from("users")
    .select("id, username, avatar_url, bio")
    .ilike("username", "%" + q + "%")
    .limit(8);

  return { users: data || [], error };
}

export async function getRecentUsers(limit = 12) {
  const { data, error } = await supabase
    .from("users")
    .select("id, username, avatar_url, bio, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  return { users: data || [], error };
}
