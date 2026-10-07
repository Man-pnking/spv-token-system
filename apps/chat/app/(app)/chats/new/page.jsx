import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function NewChatPage({ searchParams }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const to = (searchParams?.to || "").toLowerCase();
  if (!to) redirect("/chats");

  const { data: otherUser } = await supabase
    .from("users")
    .select("id, username")
    .eq("username", to)
    .maybeSingle();

  if (!otherUser || otherUser.id === user.id) redirect("/chats");

  const [user_a, user_b] =
    user.id < otherUser.id ? [user.id, otherUser.id] : [otherUser.id, user.id];

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_a", user_a)
    .eq("user_b", user_b)
    .maybeSingle();

  if (existing) redirect("/chats/" + existing.id);

  const { data: created } = await supabase
    .from("conversations")
    .insert({ user_a, user_b })
    .select("id")
    .single();

  if (!created) redirect("/chats");
  redirect("/chats/" + created.id);
}
