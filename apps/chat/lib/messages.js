import { supabase } from "./supabase";

export async function getMessages(conversationId, limit = 100) {
  const { data, error } = await supabase
    .from("messages")
    .select(`
      id, content, image_url, created_at, read_at, sender_id,
      sender:sender_id ( id, username, avatar_url )
    `)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(limit);

  return { messages: data || [], error };
}

export async function sendMessage(conversationId, content) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { message: null, error: new Error("Not authenticated") };

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: content.trim(),
    })
    .select(`
      id, content, image_url, created_at, read_at, sender_id,
      sender:sender_id ( id, username, avatar_url )
    `)
    .single();

  return { message: data, error };
}

export async function markMessagesRead(conversationId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .is("read_at", null);
}
