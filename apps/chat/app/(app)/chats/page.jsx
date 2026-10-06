import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function ChatsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <div className="text-label mb-2">Chats</div>
      <h1 className="display-lg gradient-text mb-6">Direct messages</h1>

      <div className="glass p-6">
        <div className="text-warm text-sm">Chats coming in Level 11.</div>
        <div className="text-warm-dim text-xs mt-2">
          You will be able to send direct messages to other users here.
        </div>
      </div>
    </div>
  );
}
