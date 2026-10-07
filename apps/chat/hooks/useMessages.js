"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { getMessages, markMessagesRead } from "@/lib/messages";

export function useMessages(conversationId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;

    let mounted = true;

    getMessages(conversationId).then(({ messages }) => {
      if (!mounted) return;
      setMessages(messages);
      setLoading(false);
      markMessagesRead(conversationId);
    });

    const channel = supabase
      .channel("messages:" + conversationId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: "conversation_id=eq." + conversationId,
        },
        async (payload) => {
          const { data } = await supabase
            .from("messages")
            .select(`
              id, content, image_url, created_at, read_at, sender_id,
              sender:sender_id ( id, username, avatar_url )
            `)
            .eq("id", payload.new.id)
            .single();

          if (data && mounted) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === data.id)) return prev;
              return [...prev, data];
            });
            markMessagesRead(conversationId);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      mounted = false;
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [conversationId]);

  return { messages, loading };
}
