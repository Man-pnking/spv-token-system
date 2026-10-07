import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import ChatList from "@/components/ChatList";
import PageHeader from "@/components/ui/PageHeader";

export default async function ChatsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: rawConversations } = await supabase
    .from("conversations")
    .select(`
      id, user_a, user_b, last_message_at,
      a:user_a ( id, username, avatar_url ),
      b:user_b ( id, username, avatar_url )
    `)
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
    .order("last_message_at", { ascending: false })
    .limit(50);

  const conversations = (rawConversations || []).map((c) => ({
    id: c.id,
    last_message_at: c.last_message_at,
    other: c.user_a === user.id ? c.b : c.a,
  }));

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Chats" />
      <ChatList conversations={conversations} />
    </div>
  );
}
