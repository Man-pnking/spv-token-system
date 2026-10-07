import { supabase } from "./supabase";

function orderPair(a, b) {
  return a < b ? [a, b] : [b, a];
}

export async function getOrCreateConversation(otherUserId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { conversation: null, error: new Error("Not authenticated") };

  const [user_a, user_b] = orderPair(user.id, otherUserId);

  const { data: existing } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_a", user_a)
    .eq("user_b", user_b)
    .maybeSingle();

  if (existing) return { conversation: existing, error: null };

  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_a, user_b })
    .select()
    .single();

  return { conversation: data, error };
}

export async function getMyConversations() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { conversations: [], error: null };

  const { data, error } = await supabase
    .from("conversations")
    .select(`
      id, user_a, user_b, last_message_at,
      a:user_a ( id, username, avatar_url ),
      b:user_b ( id, username, avatar_url )
    `)
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
    .order("last_message_at", { ascending: false })
    .limit(50);

  if (error) return { conversations: [], error };

  const normalized = (data || []).map((c) => {
    const other = c.user_a === user.id ? c.b : c.a;
    return {
      id: c.id,
      last_message_at: c.last_message_at,
      other,
    };
  });

  return { conversations: normalized, error: null };
}
