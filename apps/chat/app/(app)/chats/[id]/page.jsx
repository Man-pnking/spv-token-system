import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatView from "@/components/chat/ChatView";

export default async function ChatDetailPage({ params }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: conversation } = await supabase
    .from("conversations")
    .select(`
      id, user_a, user_b,
      a:user_a ( id, username, avatar_url ),
      b:user_b ( id, username, avatar_url )
    `)
    .eq("id", params.id)
    .maybeSingle();

  if (!conversation) notFound();

  const isParticipant =
    conversation.user_a === user.id || conversation.user_b === user.id;
  if (!isParticipant) notFound();

  const otherUser =
    conversation.user_a === user.id ? conversation.b : conversation.a;

  return (
    <div className="flex flex-col h-dvh md:h-full">
      <ChatHeader
        username={otherUser.username}
        avatarUrl={otherUser.avatar_url}
      />
      <ChatView
        conversationId={conversation.id}
        currentUserId={user.id}
        otherUser={otherUser}
      />
    </div>
  );
}
