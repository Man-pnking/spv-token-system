import { supabase } from "./supabase";

export async function getMyProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { profile: null, error: null };

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { profile: data, error };
}

export async function getProfileByUsername(username) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username.toLowerCase())
    .maybeSingle();

  return { profile: data, error };
}

export async function upsertProfile({ username, bio, avatarUrl }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { profile: null, error: new Error("Not authenticated") };

  const payload = {
    id: user.id,
    wallet_address: user.email,
    username: username.toLowerCase(),
    bio: bio || "",
    avatar_url: avatarUrl || null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("users")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  return { profile: data, error };
}

export async function checkUsernameAvailable(username, currentUserId) {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (error) return { available: false, error };
  if (!data) return { available: true, error: null };
  if (data.id === currentUserId) return { available: true, error: null };
  return { available: false, error: null };
}
