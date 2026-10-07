import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import ChatList from "@/components/ChatList";

export default async function ChatsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
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
      <div
        className="sticky top-0 z-20 backdrop-blur-xl border-b border-white/5 px-4 py-3"
        style={{ background: "rgba(5, 5, 16, 0.92)" }}
      >
        <h1 className="text-warm font-bold text-lg">Chats</h1>
      </div>

      <ChatList conversations={conversations} />
    </div>
  );
}
