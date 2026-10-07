import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import LayoutSwitch from "@/components/LayoutSwitch";
import ChatMobile from "@/components/chat/ChatMobile";
import ChatDesktop from "@/components/chat/ChatDesktop";
import Avatar from "@/components/Avatar";

export default async function ChatDetailPage({ params }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
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
    <div className="flex flex-col h-screen">
      <div
        className="sticky top-0 z-20 backdrop-blur-xl border-b border-white/5 flex items-center gap-3 px-4 py-3"
        style={{ background: "rgba(5, 5, 16, 0.92)" }}
      >
        <Link
          href="/chats"
          className="md:hidden p-2 rounded-full hover:bg-white/5"
        >
          <ArrowLeft className="w-5 h-5 text-warm" />
        </Link>
        <Link
          href={"/profile/" + otherUser.username}
          className="flex items-center gap-3 flex-1 min-w-0"
        >
          <Avatar
            url={otherUser.avatar_url}
            username={otherUser.username}
            size={36}
          />
          <div className="min-w-0">
            <div className="text-warm font-semibold text-sm truncate">
              @{otherUser.username}
            </div>
          </div>
        </Link>
      </div>

      <LayoutSwitch
        mobile={
          <ChatMobile
            conversationId={conversation.id}
            currentUserId={user.id}
            otherUser={otherUser}
          />
        }
        desktop={
          <ChatDesktop
            conversationId={conversation.id}
            currentUserId={user.id}
            otherUser={otherUser}
          />
        }
      />
    </div>
  );
}
