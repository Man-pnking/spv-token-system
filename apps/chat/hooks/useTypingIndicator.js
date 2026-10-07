"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export function useTypingIndicator(conversationId, currentUserId) {
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const channelRef = useRef(null);
  const timeoutRef = useRef(null);
  const lastSentRef = useRef(0);

  useEffect(() => {
    if (!conversationId || !currentUserId) return;

    const channel = supabase.channel("typing:" + conversationId, {
      config: { broadcast: { self: false } },
    });

    channel
      .on("broadcast", { event: "typing" }, (payload) => {
        if (payload.payload?.user_id === currentUserId) return;

        setIsOtherTyping(true);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setIsOtherTyping(false);
        }, 3000);
      })
      .on("broadcast", { event: "stop_typing" }, (payload) => {
        if (payload.payload?.user_id === currentUserId) return;
        setIsOtherTyping(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [conversationId, currentUserId]);

  const notifyTyping = useCallback(() => {
    if (!channelRef.current) return;

    const now = Date.now();
    if (now - lastSentRef.current < 2000) return;
    lastSentRef.current = now;

    channelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: { user_id: currentUserId },
    });
  }, [currentUserId]);

  const notifyStopTyping = useCallback(() => {
    if (!channelRef.current) return;

    channelRef.current.send({
      type: "broadcast",
      event: "stop_typing",
      payload: { user_id: currentUserId },
    });
  }, [currentUserId]);

  return { isOtherTyping, notifyTyping, notifyStopTyping };
}
