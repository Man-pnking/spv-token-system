"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { config } from "@/lib/config";

export default function Home() {
  const [status, setStatus] = useState({ state: "checking" });
  const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const { count, error } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true });

        if (cancelled) return;

        if (error) {
          setStatus({ state: "error", message: error.message });
        } else {
          setUserCount(count ?? 0);
          setStatus({ state: "ok" });
        }
      } catch (err) {
        if (cancelled) return;
        setStatus({ state: "error", message: err.message });
      }
    }

    check();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl w-full">
        <div className="text-label mb-4">Level 4 · Connection Check</div>
        <h1 className="display-lg gradient-text mb-6">SPV Chat</h1>

        <div className="glass p-6 mb-6">
          <div className="text-label mb-3">Supabase Status</div>

          {status.state === "checking" && (
            <div className="text-warm-dim text-sm">Checking connection…</div>
          )}

          {status.state === "ok" && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-warm font-mono text-sm">Connected</span>
              </div>
              <div className="text-warm-dim text-xs">
                Query ran against the <code className="text-[#00ffff]">users</code> table.
                Currently {userCount} row{userCount === 1 ? "" : "s"}.
              </div>
            </>
          )}

          {status.state === "error" && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-warm font-mono text-sm">Error</span>
              </div>
              <div className="text-red-400 text-xs break-words">
                {status.message}
              </div>
            </>
          )}
        </div>

        <div className="text-label mb-2">Configuration</div>
        <div className="text-mono text-xs text-warm-dim space-y-1">
          <div>Supabase URL: {config.supabaseUrl?.slice(0, 40)}…</div>
          <div>Chain ID: {config.chainId}</div>
          <div>SPV Token: {config.contracts.spvToken?.slice(0, 10)}…</div>
        </div>
      </div>
    </div>
  );
}