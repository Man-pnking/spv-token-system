"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AppRail } from "./shell/AppRail";
import { ConversationsPanel } from "./shell/ConversationsPanel";
import { MainColumn } from "./shell/MainColumn";
import { MobileTopBar, MobileBottomNav } from "./shell/MobileShell";
import { getMyConversations } from "@/lib/conversations";

type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
};

type Conversation = {
  id: string;
  last_message_at: string | null;
  other: { id: string; username: string; avatar_url: string | null } | null;
};

type Props = {
  profile: Profile;
  children: ReactNode;
};

// Only show conversations panel on chat-related routes
const PANEL_ROUTES = ["/chats"];

export default function AppShell({ profile, children }: Props) {
  const pathname = usePathname();
  const isChatDetail =
    /^\/chats\/[^/]+$/.test(pathname) && pathname !== "/chats/new";
  const showPanel = PANEL_ROUTES.some((r) => pathname.startsWith(r)) && !isChatDetail;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Fetch conversations only when the panel is about to be shown
  useEffect(() => {
    if (!showPanel || loaded) return;
    let mounted = true;
    getMyConversations().then(({ conversations }) => {
      if (mounted) {
        setConversations(conversations as Conversation[]);
        setLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, [showPanel, loaded]);

  return (
    <div className="min-h-dvh flex flex-col">
      <MobileTopBar
        username={profile.username}
        avatarUrl={profile.avatar_url}
      />

      <div className="flex flex-1 min-h-0">
        <AppRail username={profile.username} avatarUrl={profile.avatar_url} />

        {showPanel && (
          <ConversationsPanel conversations={conversations} />
        )}

        <MainColumn>
          <div
            className={
              isChatDetail
                ? "flex-1 min-h-0 flex flex-col"
                : "flex-1 pb-24 md:pb-6"
            }
          >
            {children}
          </div>
        </MainColumn>
      </div>

      {!isChatDetail && <MobileBottomNav username={profile.username} />}
    </div>
  );
}
